import { useState, useEffect } from 'react';

const STORAGE_KEY = 'zen-wisdom-history';

const getToday = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const useWisdomCards = () => {
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const todayStr = getToday();
  const todayCard = history.find(item => item.date === todayStr) || null;
  const hasDrawnToday = todayCard !== null;

  const drawCard = (element, wisdomData) => {
    if (hasDrawnToday) return todayCard;

    const emojis = {
      Bumi: '🪨',
      Air: '💧',
      Angin: '🌬️',
      Api: '🔥',
      Emas: '✨'
    };

    const newCard = {
      date: todayStr,
      element,
      emoji: emojis[element] || '🌱',
      wisdom: wisdomData.wisdom,
      prompt: wisdomData.prompt,
      reflection: '',
      timestamp: Date.now()
    };

    setHistory(prev => [newCard, ...prev]);
    return newCard;
  };

  const saveReflection = (text) => {
    setHistory(prev => prev.map(item => {
      if (item.date === todayStr) {
        return { ...item, reflection: text };
      }
      return item;
    }));
  };

  return {
    history,
    todayCard,
    hasDrawnToday,
    drawCard,
    saveReflection
  };
};
