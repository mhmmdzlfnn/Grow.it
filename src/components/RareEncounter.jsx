import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export const RareEncounter = ({ onCatch }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ y: 0, duration: 10 });

  useEffect(() => {
    // Cek peluang muncul tiap 20 detik
    const interval = setInterval(() => {
      if (!isVisible && Math.random() < 0.3) { // 30% chance buat demo biar lebih sering
        const duration = 8 + Math.random() * 5;
        setPosition({
          y: Math.random() * 80 + 10,
          duration: duration
        });
        setIsVisible(true);
        
        setTimeout(() => setIsVisible(false), duration * 1000);
      }
    }, 20000);

    // Muncul paksa sekali setelah 5 detik pertama (buat demo showcase ke juri)
    const initialTimeout = setTimeout(() => {
        setPosition({ y: 40, duration: 12 });
        setIsVisible(true);
        setTimeout(() => setIsVisible(false), 12000);
    }, 5000);

    return () => {
        clearInterval(interval);
        clearTimeout(initialTimeout);
    };
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: '-10vw', y: `${position.y}vh`, opacity: 0 }}
          animate={{ 
            x: '110vw', 
            y: [`${position.y}vh`, `${position.y - 15}vh`, `${position.y}vh`, `${position.y + 10}vh`, `${position.y}vh`], 
            opacity: [0, 1, 1, 1, 0] 
          }}
          exit={{ opacity: 0, scale: 2 }}
          transition={{ duration: position.duration, ease: 'linear' }}
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(false);
            onCatch();
          }}
          style={{
            position: 'fixed',
            zIndex: 50,
            fontSize: '2.5rem',
            cursor: 'crosshair',
            filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.8))'
          }}
          whileHover={{ scale: 1.5, rotate: 15 }}
          title="Tangkap kupu-kupu emas!"
        >
          🦋
        </motion.div>
      )}
    </AnimatePresence>
  );
};
