import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

const MILESTONES = [3, 7, 14, 21, 30, 50, 100];

const getMilestoneConfig = (streak) => {
  if (streak >= 100) return { emoji: '🔥', label: 'LEGENDA', color: '#ff4500', glow: '#ff4500' };
  if (streak >= 50)  return { emoji: '🔥', label: 'MASTER', color: '#ff6b00', glow: '#ff6b00' };
  if (streak >= 30)  return { emoji: '🔥', label: 'LUAR BIASA', color: '#ff8c00', glow: '#ff8c00' };
  if (streak >= 21)  return { emoji: '🔥', label: 'KONSISTEN', color: '#ffa500', glow: '#ffa500' };
  if (streak >= 14)  return { emoji: '🔥', label: 'MANTAP', color: '#ffb700', glow: '#ffb700' };
  if (streak >= 7)   return { emoji: '🔥', label: 'ON FIRE', color: '#ff6b35', glow: '#ff6b35' };
  return               { emoji: '🔥', label: 'STREAK', color: '#ff8c42', glow: '#ff8c42' };
};

// Floating fire particles
const FireParticle = ({ delay, x, size }) => (
  <motion.div
    initial={{ y: 0, opacity: 1, scale: 1 }}
    animate={{ y: -120, opacity: 0, scale: 0.3, x: x }}
    transition={{ duration: 1.2, delay, ease: 'easeOut' }}
    style={{
      position: 'absolute',
      bottom: '10px',
      left: '50%',
      fontSize: size,
      pointerEvents: 'none',
    }}
  >
    🔥
  </motion.div>
);

export const StreakCelebration = ({ streak, habitTitle, onDone }) => {
  const show = MILESTONES.includes(streak);
  const config = getMilestoneConfig(streak);

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onDone, 3000);
    return () => clearTimeout(timer);
  }, [show, streak]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onDone}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'all',
            cursor: 'pointer',
          }}
        >
          {/* Blurred dark backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(6px)',
            }}
          />

          {/* Main card */}
          <motion.div
            initial={{ scale: 0.4, opacity: 0, y: 60 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: -40 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '2.5rem 3rem',
              borderRadius: '32px',
              background: 'rgba(20, 15, 10, 0.92)',
              border: `2px solid ${config.color}`,
              boxShadow: `0 0 60px ${config.glow}88, 0 0 120px ${config.glow}33`,
              minWidth: '280px',
              textAlign: 'center',
              overflow: 'visible',
            }}
          >
            {/* Floating fire particles */}
            {[...Array(6)].map((_, i) => (
              <FireParticle
                key={i}
                delay={i * 0.15}
                x={`${(i - 2.5) * 18}px`}
                size={i % 2 === 0 ? '1.4rem' : '1rem'}
              />
            ))}

            {/* Big fire emoji */}
            <motion.div
              animate={{ scale: [1, 1.15, 1], rotate: [-5, 5, -5] }}
              transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
              style={{ fontSize: '5rem', lineHeight: 1, filter: `drop-shadow(0 0 20px ${config.glow})` }}
            >
              🔥
            </motion.div>

            {/* Streak number */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.15, stiffness: 400, damping: 18 }}
              style={{
                fontSize: '4.5rem',
                fontWeight: 900,
                lineHeight: 1,
                color: config.color,
                textShadow: `0 0 30px ${config.glow}`,
                letterSpacing: '-2px',
              }}
            >
              {streak}
            </motion.div>

            {/* Label */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              style={{
                fontSize: '1rem',
                fontWeight: 800,
                letterSpacing: '4px',
                color: config.color,
                textTransform: 'uppercase',
              }}
            >
              {config.label}
            </motion.div>

            {/* Hari berturut-turut */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.2rem' }}
            >
              hari berturut-turut
            </motion.div>

            {/* Habit name */}
            {habitTitle && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                style={{
                  marginTop: '0.8rem',
                  fontSize: '0.9rem',
                  color: 'rgba(255,255,255,0.5)',
                  fontStyle: 'italic',
                  maxWidth: '220px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                "{habitTitle}"
              </motion.div>
            )}

            {/* Tap to dismiss hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 1.5 }}
              style={{ fontSize: '0.7rem', color: '#fff', marginTop: '1rem' }}
            >
              tap untuk tutup
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
