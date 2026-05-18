import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Fireflies } from './Fireflies';

const SunRays = () => {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.05, 0.15, 0.05], rotate: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: 8 + i * 2, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            top: '-20%',
            left: `${15 + i * 25}%`,
            width: '15vw',
            height: '150%',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)',
            transformOrigin: 'top center',
            filter: 'blur(30px)',
            transform: 'rotate(-25deg)'
          }}
        />
      ))}
    </div>
  );
};

const FallingLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  
  useEffect(() => {
    const newLeaves = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 10
    }));
    setLeaves(newLeaves);
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          initial={{ y: -50, x: `${leaf.x}vw`, rotate: 0, opacity: 0 }}
          animate={{ y: '100vh', x: `${leaf.x + 20}vw`, rotate: 360, opacity: [0, 0.6, 0] }}
          transition={{ repeat: Infinity, duration: leaf.duration, delay: leaf.delay, ease: "linear" }}
          style={{
            position: 'absolute',
            width: '12px',
            height: '12px',
            background: 'var(--accent-brown)',
            borderRadius: '12px 0px 12px 0px', // Leaf shape
            opacity: 0.6
          }}
        />
      ))}
    </div>
  );
};

export const WeatherEffects = ({ theme }) => {
  if (theme === 'day') return <SunRays />;
  if (theme === 'evening') return <FallingLeaves />;
  if (theme === 'night') return <Fireflies />;
  return null;
};
