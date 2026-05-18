import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const Fireflies = () => {
  const [fireflies, setFireflies] = useState([]);

  useEffect(() => {
    // Generate random fireflies coordinates
    const newFireflies = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 4 + Math.random() * 6,
      delay: Math.random() * 5
    }));
    setFireflies(newFireflies);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      pointerEvents: 'none',
      zIndex: 0,
      overflow: 'hidden'
    }}>
      {fireflies.map(f => (
        <motion.div
          key={f.id}
          initial={{ opacity: 0, x: `${f.x}vw`, y: `${f.y}vh` }}
          animate={{
            opacity: [0, 0.6, 0.9, 0],
            x: [`${f.x}vw`, `${f.x + (Math.random() * 10 - 5)}vw`, `${f.x + (Math.random() * 20 - 10)}vw`],
            y: [`${f.y}vh`, `${f.y - 10}vh`, `${f.y - 20}vh`]
          }}
          transition={{
            duration: f.duration,
            repeat: Infinity,
            delay: f.delay,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            width: '3px',
            height: '3px',
            background: '#FEF08A',
            borderRadius: '50%',
            boxShadow: '0 0 8px 2px rgba(254, 240, 138, 0.6)'
          }}
        />
      ))}
    </div>
  );
};
