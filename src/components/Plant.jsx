import { motion } from 'framer-motion';

export const Plant = ({ stage, isWilted, type = 'sakura', isWet = false, wateringProgress = 0 }) => {
  const getPlantVisual = () => {
    if (type === 'bambu') {
      switch (stage) {
        case 0: return '🌱';
        case 1: return '🎍';
        case 2: return '🎋';
        case 3: default: return '🎋';
      }
    } else if (type === 'kaktus') {
      switch (stage) {
        case 0: return '🌱';
        case 1: return '🌵';
        case 2: return '🌵';
        case 3: default: return '🌵';
      }
    } else if (type === 'pohon') {
      switch (stage) {
        case 0: return '🌱';
        case 1: return '🌿';
        case 2: return '🌳';
        case 3: default: return '🍎';
      }
    } else {
      switch (stage) {
        case 0: return '🌱';
        case 1: return '🌿';
        case 2: return '🪴';
        case 3: default: return '🌸';
      }
    }
  };

  const sizes = {
    0: '2.5rem',
    1: '3.5rem',
    2: '4.5rem',
    3: '5.5rem'
  };

  const activeWet = isWet || wateringProgress > 0;
  const currentOpacity = isWet 
    ? 0.85 
    : (wateringProgress > 0 ? 0.2 + (wateringProgress / 100) * 0.65 : 0.2);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        filter: isWilted ? 'saturate(0.2) brightness(0.8)' : 'saturate(1.2) brightness(1)',
        rotate: isWilted ? 15 : 0
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        height: '120px',
        width: '100px',
        position: 'relative'
      }}
    >
      {/* Soil base with physics transitions */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        width: '60px',
        height: '15px',
        background: activeWet ? '#4E342E' : 'var(--text-secondary)',
        border: activeWet ? '1px solid #3E2723' : '1px solid transparent',
        boxShadow: activeWet ? '0 0 8px rgba(78, 52, 46, 0.4)' : 'none',
        borderRadius: '50%',
        opacity: currentOpacity,
        zIndex: -1,
        transition: 'background-color 0.4s ease, border-color 0.4s ease, opacity 0.4s ease, box-shadow 0.4s ease'
      }}></div>

      <motion.div
        animate={{
          y: isWilted ? [0, 5, 0] : [0, -8, 0],
          rotate: isWilted ? 0 : [-2, 2, -2]
        }}
        transition={{
          repeat: Infinity,
          duration: isWilted ? 5 : 4,
          ease: 'easeInOut'
        }}
        style={{
          fontSize: sizes[stage],
          lineHeight: 1,
          transformOrigin: 'bottom center',
          userSelect: 'none'
        }}
      >
        {getPlantVisual()}
      </motion.div>
    </motion.div>
  );
};
