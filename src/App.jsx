import { useHabits } from './hooks/useHabits';
import { useReminders } from './hooks/useReminders';
import { useWisdomCards } from './hooks/useWisdomCards';
import { Garden } from './components/Garden';
import { HabitList } from './components/HabitList';
import { AiZenMaster } from './components/AiZenMaster';
import { ThemeToggle } from './components/ThemeToggle';
import { WeatherEffects } from './components/WeatherEffects';
import { ZenFocusMode } from './components/ZenFocusMode';
import { StreakHeatmap } from './components/StreakHeatmap';
import { RareEncounter } from './components/RareEncounter';
import { StreakCelebration } from './components/StreakCelebration';
import { GardenShareCard } from './components/GardenShareCard';
import { ReminderModal } from './components/ReminderModal';
import { MoodCheck } from './components/MoodCheck';
import { WateringCanCursor } from './components/WateringCanCursor';
import { WisdomCardModal } from './components/WisdomCardModal';
import { generateZenMessage, generateMoodResponse } from './utils/aiMock';
import { playSwoosh, playChime } from './utils/soundfx';
import { Leaf, Share2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';


function App() {
  const { habits, addHabit, completeHabit, removeHabit, clearWeeds, aiMessage, setAiMessage } = useHabits();
  const { reminders, permission, requestPermission, setReminder, removeReminder } = useReminders(habits);
  const wisdomCardsState = useWisdomCards();

  const [themeSetting, setThemeSetting] = useState('auto');
  const [activeTheme, setActiveTheme] = useState('day');
  const [activeFocusHabit, setActiveFocusHabit] = useState(null);
  const [streakCelebration, setStreakCelebration] = useState(null);
  const [showShareCard, setShowShareCard] = useState(false);
  const [showWisdomModal, setShowWisdomModal] = useState(false);
  const [reminderHabit, setReminderHabit] = useState(null);
  const [moodCheck, setMoodCheck] = useState(null); // { habitTitle, habitId, context } // habit being edited


  // Watering Interactive States
  const [wateringHabitId, setWateringHabitId] = useState(null);
  const [wateringTargetRect, setWateringTargetRect] = useState(null);
  const [isWateringTilting, setIsWateringTilting] = useState(false);

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

  const handleStartWatering = (id) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;
    if (habit.isCompletedToday) return;

    if (habit.hasWeeds) {
      setAiMessage("Cabut rumput dan singkirkan hama di tanamanmu dulu sebelum menyiramnya! 🌿🐛");
      setTimeout(() => setAiMessage(null), 5000);
      return;
    }

    setWateringHabitId(id);
    playSwoosh();

    // Scroll to garden smoothly
    setTimeout(() => {
      const gardenEl = document.getElementById('garden-section');
      if (gardenEl) {
        gardenEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleComplete = async (id) => {
    // Ambil title dulu dari habits sebelum completeHabit dipanggil
    const habit = habits.find(h => h.id === id);
    const habitTitle = habit?.title ?? '';

    const { justLeveledUp, completedTitle, newStreak } = completeHabit(id);
    playChime();

    // Show TikTok-style streak celebration on milestones
    if (newStreak > 0) {
      setStreakCelebration({ streak: newStreak, habitTitle });
    }

    // Show mood check after completing a habit
    setMoodCheck({
      habitTitle,
      context: { streak: newStreak, stage: habit?.stage ?? 0, justLeveledUp },
    });
  };

  const handleMoodSelect = async (mood) => {
    setMoodCheck(null);
    const { habitTitle, context } = moodCheck;

    // Generate mood-aware Gemini response
    const message = await generateMoodResponse(mood.value, mood.label, habitTitle);
    setAiMessage(message);
    setTimeout(() => setAiMessage(null), 10000);

    // Also trigger zen message on level up (separate from mood response)
    if (context.justLeveledUp) {
      setTimeout(async () => {
        const zenMsg = await generateZenMessage(habitTitle, context);
        setAiMessage(zenMsg);
        setTimeout(() => setAiMessage(null), 9000);
      }, 11000);
    }
  };

  const handleMoodSkip = () => {
    const { habitTitle, context } = moodCheck ?? {};
    setMoodCheck(null);

    // Fall back to regular zen message if skipped
    if (context?.justLeveledUp || Math.random() > 0.4) {
      generateZenMessage(habitTitle, context ?? {}).then(msg => {
        setAiMessage(msg);
        setTimeout(() => setAiMessage(null), 9000);
      });
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
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowWisdomModal(true)}
                title="Pesan Alam"
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0 1rem', height: '40px', borderRadius: '20px',
                  background: 'rgba(192, 154, 118, 0.08)',
                  border: '1px solid rgba(192, 154, 118, 0.2)',
                  color: 'var(--accent-brown)', fontWeight: 600,
                  fontSize: '0.85rem', cursor: 'pointer',
                  position: 'relative',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <Sparkles size={15} />
                Pesan Alam
                
                {/* Pulsing notification badge if card hasn't been drawn today */}
                {!wisdomCardsState.hasDrawnToday && (
                  <motion.span 
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    style={{
                      position: 'absolute',
                      top: '-3px',
                      right: '-3px',
                      width: '8px',
                      height: '8px',
                      background: '#e74c3c',
                      borderRadius: '50%',
                      boxShadow: '0 0 8px #e74c3c'
                    }} 
                  />
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowShareCard(true)}
                title="Bagikan Tamanmu"
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0 1rem', height: '40px', borderRadius: '20px',
                  background: 'rgba(141,163,153,0.08)',
                  border: '1px solid rgba(141,163,153,0.2)',
                  color: 'var(--accent-green)', fontWeight: 600,
                  fontSize: '0.85rem', cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <Share2 size={15} />
                Share
              </motion.button>
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
          id="garden-section"
        >
          <Garden 
            habits={habits} 
            onClearWeeds={clearWeeds} 
            wateringHabitId={wateringHabitId}
            onWateringComplete={(id) => {
              setWateringHabitId(null);
              setIsWateringTilting(false);
              setWateringTargetRect(null);
              handleComplete(id);
            }}
            onWateringStateChange={(isTilting, rect) => {
              setIsWateringTilting(isTilting);
              setWateringTargetRect(rect);
            }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <HabitList 
            habits={habits} 
            onAdd={addHabit} 
            onComplete={handleStartWatering} 
            onRemove={removeHabit}
            onFocus={(habit) => setActiveFocusHabit(habit)}
            onSetReminder={(habit) => setReminderHabit(habit)}
            reminders={reminders}
            wateringHabitId={wateringHabitId}
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
      <StreakCelebration
        streak={streakCelebration?.streak}
        habitTitle={streakCelebration?.habitTitle}
        onDone={() => setStreakCelebration(null)}
      />
      {showShareCard && (
        <GardenShareCard habits={habits} onClose={() => setShowShareCard(false)} />
      )}
      {reminderHabit && (
        <ReminderModal
          habit={reminderHabit}
          reminder={reminders[reminderHabit.id]}
          permission={permission}
          onRequestPermission={requestPermission}
          onSave={setReminder}
          onRemove={removeReminder}
          onClose={() => setReminderHabit(null)}
        />
      )}
      {moodCheck && (
        <MoodCheck
          habitTitle={moodCheck.habitTitle}
          onSelect={handleMoodSelect}
          onSkip={handleMoodSkip}
        />
      )}

      {/* Floating Instructions for Watering Mode */}
      <AnimatePresence>
        {wateringHabitId && (
          <motion.div
            initial={{ y: 80, x: '-50%', opacity: 0 }}
            animate={{ y: 0, x: '-50%', opacity: 1 }}
            exit={{ y: 80, x: '-50%', opacity: 0 }}
            style={{
              position: 'fixed',
              bottom: '2rem',
              left: '50%',
              background: 'var(--card-bg)',
              backdropFilter: 'blur(15px)',
              border: '1px solid var(--border-color)',
              padding: '0.8rem 1.5rem',
              borderRadius: '30px',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              zIndex: 999
            }}
          >
            <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>
              💧 Arahkan penyiram atau ketuk tanaman <strong>{habits.find(h => h.id === wateringHabitId)?.title}</strong> untuk menyiramnya!
            </span>
            <button
              onClick={() => {
                setWateringHabitId(null);
                setIsWateringTilting(false);
                setWateringTargetRect(null);
              }}
              style={{
                background: 'rgba(231, 76, 60, 0.1)',
                color: '#e74c3c',
                border: 'none',
                padding: '4px 12px',
                borderRadius: '20px',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              Batal
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {showWisdomModal && (
        <WisdomCardModal
          habits={habits}
          wisdomCardsState={wisdomCardsState}
          onClose={() => setShowWisdomModal(false)}
        />
      )}

      <WateringCanCursor
        active={wateringHabitId !== null}
        isTilting={isWateringTilting}
        targetRect={wateringTargetRect}
      />
    </>
  );
}

export default App;
