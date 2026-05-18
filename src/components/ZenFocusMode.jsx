import { motion, AnimatePresence } from 'framer-motion';
import { Plant } from './Plant';
import { useState, useEffect } from 'react';
import { X, Play, Pause } from 'lucide-react';

export const ZenFocusMode = ({ habit, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {habit && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}
        >
          <button 
            onClick={onClose}
            style={{ position: 'absolute', top: '2rem', right: '2rem', color: '#fff', opacity: 0.7, background: 'none', border: 'none', cursor: 'pointer', zIndex: 101 }}
            onMouseOver={(e) => e.currentTarget.style.opacity = 1}
            onMouseOut={(e) => e.currentTarget.style.opacity = 0.7}
          >
            <X size={32} />
          </button>

          <motion.div
            animate={{ scale: isActive ? [1, 1.1, 1] : 1 }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            style={{ transformOrigin: 'bottom center', marginBottom: '3rem' }}
          >
            {/* Provide a larger base size for the focus mode plant by wrapping it */}
            <div style={{ transform: 'scale(1.5)', transformOrigin: 'bottom center' }}>
              <Plant stage={habit.stage} isWilted={false} type={habit.type} />
            </div>
          </motion.div>

          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 600, textAlign: 'center' }}>{habit.title}</h2>
          
          <div style={{ fontSize: '5rem', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '4px', marginBottom: '2rem' }}>
            {formatTime(timeLeft)}
          </div>

          <button 
            onClick={() => setIsActive(!isActive)}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '1rem 2rem',
              borderRadius: '50px',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1.2rem',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
          >
            {isActive ? <Pause /> : <Play />}
            {isActive ? 'Pause Timer' : 'Resume Timer'}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
