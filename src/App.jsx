import { useHabits } from './hooks/useHabits';
import { Garden } from './components/Garden';
import { HabitList } from './components/HabitList';
import { AiZenMaster } from './components/AiZenMaster';
import { ThemeToggle } from './components/ThemeToggle';
import { WeatherEffects } from './components/WeatherEffects';
import { ZenFocusMode } from './components/ZenFocusMode';
import { StreakHeatmap } from './components/StreakHeatmap';
import { RareEncounter } from './components/RareEncounter';
import { generateZenMessage } from './utils/aiMock';
import { Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

function App() {
  const { habits, addHabit, completeHabit, removeHabit, clearWeeds, aiMessage, setAiMessage } = useHabits();
  
  const [themeSetting, setThemeSetting] = useState('auto');
  const [activeTheme, setActiveTheme] = useState('day');
  const [activeFocusHabit, setActiveFocusHabit] = useState(null);

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
      <WeatherEffects theme={activeTheme} />
      <RareEncounter onCatch={() => {
        setAiMessage("Kamu berhasil menangkap Kupu-Kupu Langka! Kesabaran dan fokusmu sungguh luar biasa hari ini. Teruslah bertumbuh! 🦋✨");
      }} />
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
          <Garden habits={habits} onClearWeeds={clearWeeds} />
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
            onFocus={(habit) => setActiveFocusHabit(habit)}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <StreakHeatmap habits={habits} />
        </motion.div>
      </main>

        <AiZenMaster message={aiMessage} onClose={() => setAiMessage(null)} />
      </div>
      {activeFocusHabit && (
        <ZenFocusMode habit={activeFocusHabit} onClose={() => setActiveFocusHabit(null)} />
      )}
    </>
  );
}

export default App;
