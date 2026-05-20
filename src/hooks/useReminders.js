import { useState, useEffect, useRef } from 'react';

const STORAGE_KEY = 'zen-reminders';

const loadReminders = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

// ── Service Worker helpers ────────────────────────────────────────────────────

const getSW = async () => {
  if (!('serviceWorker' in navigator)) return null;
  const reg = await navigator.serviceWorker.ready.catch(() => null);
  return reg?.active ?? null;
};

const postToSW = async (message) => {
  const sw = await getSW();
  sw?.postMessage(message);
};

const fireViaSW = async (habit) => {
  const messages = [
    `💧 Waktunya siram "${habit.title}"! Jangan biarkan tanamanmu layu.`,
    `🌱 "${habit.title}" menunggumu hari ini. Yuk, tetap konsisten!`,
    `🔥 Jaga streakmu! Saatnya menyelesaikan "${habit.title}".`,
    `🌿 Tanamanmu butuh perhatianmu — selesaikan "${habit.title}" sekarang!`,
  ];
  const body = messages[Math.floor(Math.random() * messages.length)];

  // Try via Service Worker first (works when tab is hidden/closed)
  const sw = await getSW();
  if (sw) {
    postToSW({
      type: 'FIRE_NOTIFICATION',
      payload: {
        title: 'Grow.it — Pengingat Kebiasaan 🌱',
        body,
        tag: `growit-${habit.id}`,
      },
    });
    return;
  }

  // Fallback: fire directly from main thread (tab must be open)
  if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
    try {
      const notif = new Notification('Grow.it — Pengingat Kebiasaan 🌱', {
        body,
        icon: '/favicon.svg',
        tag: `growit-${habit.id}`,
      });
      notif.onclick = () => { window.focus(); notif.close(); };
    } catch (e) {
      console.warn('Notification failed:', e);
    }
  }
};

// ── Register Service Worker ───────────────────────────────────────────────────

const registerSW = async () => {
  if (!('serviceWorker' in navigator)) return;
  try {
    await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    // Tell SW to start the background alarm loop
    postToSW({ type: 'START_ALARM' });
  } catch (e) {
    console.warn('SW registration failed:', e);
  }
};

// ── Hook ──────────────────────────────────────────────────────────────────────

export const useReminders = (habits) => {
  const [reminders, setReminders] = useState(loadReminders);
  const [permission, setPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  );
  const firedTodayRef = useRef({});

  // Register SW once on mount
  useEffect(() => {
    registerSW();
  }, []);

  // Persist reminders
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
  }, [reminders]);

  // Listen for SW_CHECK_REMINDERS messages from the service worker
  useEffect(() => {
    const handler = (event) => {
      if (event.data?.type === 'SW_CHECK_REMINDERS') {
        runCheck();
      }
    };
    navigator.serviceWorker?.addEventListener('message', handler);
    return () => navigator.serviceWorker?.removeEventListener('message', handler);
  }, [habits, reminders, permission]);

  const requestPermission = async () => {
    if (typeof Notification === 'undefined') return 'denied';
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  };

  const setReminder = (habitId, time, enabled = true) => {
    setReminders(prev => ({ ...prev, [habitId]: { time, enabled } }));
  };

  const removeReminder = (habitId) => {
    setReminders(prev => {
      const next = { ...prev };
      delete next[habitId];
      return next;
    });
  };

  const toggleReminder = (habitId) => {
    setReminders(prev => ({
      ...prev,
      [habitId]: { ...prev[habitId], enabled: !prev[habitId]?.enabled },
    }));
  };

  // Core check logic — called both from interval and SW message
  const runCheck = () => {
    const now = new Date();
    const todayKey = now.toISOString().split('T')[0];
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (firedTodayRef.current._date !== todayKey) {
      firedTodayRef.current = { _date: todayKey };
    }

    habits.forEach(habit => {
      const reminder = reminders[habit.id];
      if (!reminder?.enabled || !reminder?.time) return;
      if (habit.isCompletedToday) return;
      if (firedTodayRef.current[habit.id]) return;

      if (currentTime === reminder.time) {
        firedTodayRef.current[habit.id] = true;
        fireViaSW(habit);
      }
    });
  };

  // Fallback interval when tab is open (catches cases SW message doesn't arrive)
  useEffect(() => {
    const interval = setInterval(runCheck, 30000);
    runCheck();
    return () => clearInterval(interval);
  }, [habits, reminders, permission]);

  return { reminders, permission, requestPermission, setReminder, removeReminder, toggleReminder };
};
