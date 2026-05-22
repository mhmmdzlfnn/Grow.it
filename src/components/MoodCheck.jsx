import { motion, AnimatePresence } from 'framer-motion';

const MOODS = [
  { emoji: '😔', label: 'Berat',       value: 'berat' },
  { emoji: '😐', label: 'Biasa',       value: 'biasa' },
  { emoji: '🙂', label: 'Oke',         value: 'oke' },
  { emoji: '😄', label: 'Senang',      value: 'senang' },
  { emoji: '🤩', label: 'Luar Biasa',  value: 'luar_biasa' },
];

export const MoodCheck = ({ habitTitle, onSelect, onSkip }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => { if (e.target === e.currentTarget) onSkip(); }}
        style={{
          position: 'fixed', inset: 0, zIndex: 120,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          background: 'rgba(0,0,0,0.35)',
          backdropFilter: 'blur(4px)',
        }}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          style={{
            width: '100%',
            maxWidth: '520px',
            background: 'var(--card-bg)',
            borderRadius: '28px 28px 0 0',
            padding: '2rem 1.5rem 2.5rem',
            boxShadow: '0 -20px 60px rgba(0,0,0,0.2)',
            border: '1px solid var(--border-color)',
            borderBottom: 'none',
          }}
        >
          {/* Handle bar */}
          <div style={{
            width: '40px', height: '4px', borderRadius: '2px',
            background: 'var(--border-color)',
            margin: '0 auto 1.5rem',
          }} />

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.1 }}
              style={{ fontSize: '2rem', marginBottom: '0.5rem' }}
            >
              ✅
            </motion.div>
            <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', margin: 0 }}>
              "{habitTitle}" selesai!
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '0.4rem' }}>
              Gimana harimu hari ini?
            </p>
          </div>

          {/* Mood buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {MOODS.map((mood, i) => (
              <motion.button
                key={mood.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                whileHover={{ scale: 1.15, y: -4 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => onSelect(mood)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                  padding: '0.75rem 0.6rem',
                  borderRadius: '16px',
                  border: '2px solid var(--border-color)',
                  background: 'transparent',
                  cursor: 'pointer',
                  minWidth: '56px',
                  transition: 'border-color 0.2s, background 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-green)';
                  e.currentTarget.style.background = 'rgba(141,163,153,0.08)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{mood.emoji}</span>
                <span style={{ fontSize: '0.62rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {mood.label}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Skip */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={onSkip}
              style={{
                fontSize: '0.8rem', color: 'var(--text-secondary)',
                background: 'none', border: 'none', cursor: 'pointer',
                opacity: 0.6, padding: '0.25rem 0.5rem',
              }}
            >
              Lewati
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
