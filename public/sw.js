// Grow.it Service Worker
// Handles background push notifications and caching

const CACHE_NAME = 'growit-v1';
const STATIC_ASSETS = ['/', '/index.html'];

// ── Install: cache shell ──────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// ── Activate: clean old caches ────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── Fetch: network-first, fallback to cache ───────────────────────────────────
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});

// ── Background reminder alarm ─────────────────────────────────────────────────
// The main app posts a message to schedule/cancel alarms.
// We use a simple setInterval-based approach inside the SW.

let reminderInterval = null;

const checkReminders = () => {
  // Read reminders & habits from the client via postMessage
  self.clients.matchAll({ type: 'window' }).then((clients) => {
    clients.forEach((client) => client.postMessage({ type: 'SW_CHECK_REMINDERS' }));
  });
};

self.addEventListener('message', (event) => {
  const { type, payload } = event.data ?? {};

  if (type === 'FIRE_NOTIFICATION') {
    // Main thread asks SW to fire a notification (works even when page is hidden)
    const { title, body, tag } = payload;
    self.registration.showNotification(title, {
      body,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      tag,
      renotify: false,
      requireInteraction: false,
      data: { url: '/' },
    });
  }

  if (type === 'START_ALARM') {
    if (reminderInterval) clearInterval(reminderInterval);
    // Check every 30 seconds
    reminderInterval = setInterval(checkReminders, 30000);
  }

  if (type === 'STOP_ALARM') {
    if (reminderInterval) clearInterval(reminderInterval);
    reminderInterval = null;
  }
});

// ── Notification click: focus or open the app ─────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((c) => c.url.includes(self.location.origin));
      if (existing) return existing.focus();
      return self.clients.openWindow('/');
    })
  );
});
