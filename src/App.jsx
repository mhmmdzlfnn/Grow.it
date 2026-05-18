import { useHabits } from './hooks/useHabits';
import { Garden } from './components/Garden';
import { HabitList } from './components/HabitList';
import { AiZenMaster } from './components/AiZenMaster';
import { ThemeToggle } from './components/ThemeToggle';
import { Fireflies } from './components/Fireflies';
import { generateZenMessage } from './utils/aiMock';
import { Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

function App() {
  const { habits, addHabit, completeHabit, removeHabit, aiMessage, setAiMessage } = useHabits();
  
  const [themeSetting, setThemeSetting] = useState('auto');
  const [activeTheme, setActiveTheme] = useState('day');

  // Logic to determine time of day for auto theme
  useEffect(() => {
    const applyTheme = () => {
      if (themeSetting !== 'auto') {
        setActiveTheme(themeSetting);
        document.body.setAttribute('data-theme', themeSetting);
        return;
      }
      
      const hour = new Date().getHours();
      let calculatedTheme = 'day';
      if (hour >= 16 && hour < 19) calculatedTheme = 'evening';
      else if (hour >= 19 || hour < 6) calculatedTheme = 'night';
      
      setActiveTheme(calculatedTheme);
      document.body.setAttribute('data-theme', calculatedTheme);
    };
    
    applyTheme();
    // Check time every minute if auto
    const interval = setInterval(applyTheme, 60000);
    return () => clearInterval(interval);
  }, [themeSetting]);

  const handleComplete = async (id) => {
    const { justLeveledUp, completedTitle } = completeHabit(id);
    
    // Trigger AI message if leveled up or sometimes randomly (for demo purposes)
    if (justLeveledUp || Math.random() > 0.5) {
      const message = await generateZenMessage(completedTitle);
      setAiMessage(message);
      
      // Auto close message after 8 seconds
      setTimeout(() => {
        setAiMessage(null);
      }, 8000);
    }
  };

  return (
    <>
      <AnimatePresence>
        {activeTheme === 'night' && <Fireflies />}
      </AnimatePresence>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem', position: 'relative', zIndex: 1 }}>
        <header className="header-container" style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="header-title-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <motion.div 
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: 'spring', damping: 15 }}
                style={{
                  width: '56px',
                  height: '56px',
                  background: 'linear-gradient(135deg, var(--accent-green), var(--accent-green-hover))',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  boxShadow: '0 10px 15px -3px rgba(141, 163, 153, 0.4)'
                }}
              >
                <Leaf size={30} strokeWidth={2.5} />
              </motion.div>
              <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.5px', margin: 0, lineHeight: 1.2 }}>
                  Grow.it
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0, marginTop: '2px' }}>
                  Tumbuhkan kebiasaan baik dengan penuh kesabaran.
                </p>
              </div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <ThemeToggle theme={themeSetting} setTheme={setThemeSetting} />
            </div>
          </div>
        </header>

      <main>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-panel" 
          style={{ overflow: 'hidden' }}
        >
          <Garden habits={habits} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <HabitList 
            habits={habits} 
            onAdd={addHabit} 
            onComplete={handleComplete} 
            onRemove={removeHabit}
          />
        </motion.div>
      </main>

        <AiZenMaster message={aiMessage} onClose={() => setAiMessage(null)} />
      </div>
    </>
  );
}

export default App;
