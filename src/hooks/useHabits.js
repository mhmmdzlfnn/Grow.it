import { useState, useEffect } from 'react';

const getToday = () => new Date().toISOString().split('T')[0];

export const useHabits = () => {
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('zen-habits');
    if (saved) return JSON.parse(saved);
    return [];
  });

  const [aiMessage, setAiMessage] = useState(null);

  useEffect(() => {
    localStorage.setItem('zen-habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = (title, type = 'sakura') => {
    const newHabit = {
      id: crypto.randomUUID(),
      title,
      type,
      createdAt: getToday(),
      history: [],
    };
    setHabits([...habits, newHabit]);
  };

  const completeHabit = (id) => {
    const today = getToday();
    let justLeveledUp = false;
    let completedTitle = '';

    setHabits(habits.map(habit => {
      if (habit.id === id) {
        completedTitle = habit.title;
        const newHistory = [...habit.history];
        if (!newHistory.includes(today)) {
          newHistory.push(today);
          
          // Check for level up (every 3 consecutive completions)
          if (newHistory.length % 3 === 0) {
             justLeveledUp = true;
          }
        }
        return { ...habit, history: newHistory };
      }
      return habit;
    }));

    return { justLeveledUp, completedTitle };
  };

  const removeHabit = (id) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  const clearWeeds = (id) => {
    setHabits(habits.map(habit => 
      habit.id === id ? { ...habit, lastWeedsCleared: getToday() } : habit
    ));
  };

  // Helper to calculate current state of a habit
  const getHabitState = (habit) => {
    const today = getToday();
    const isCompletedToday = habit.history.includes(today);
    
    // Stage logic: 0 (seed), 1 (sprout), 2 (small plant), 3 (bloom)
    const completions = habit.history.length;
    let stage = Math.min(3, Math.floor(completions / 3));

    // Wilted logic: if not completed yesterday or today (and history is not empty)
    let isWilted = false;
    let hasWeeds = false;
    if (completions > 0) {
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterday = yesterdayDate.toISOString().split('T')[0];

      if (!habit.history.includes(today) && !habit.history.includes(yesterday)) {
        isWilted = true;
        if (habit.lastWeedsCleared !== today) {
          hasWeeds = true;
        }
      }
    }

    return { ...habit, isCompletedToday, stage, isWilted, hasWeeds };
  };

  const enhancedHabits = habits.map(getHabitState);

  return { habits: enhancedHabits, addHabit, completeHabit, removeHabit, clearWeeds, aiMessage, setAiMessage };
};
