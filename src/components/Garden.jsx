import { Plant } from './Plant';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { startWateringSound, stopWateringSound, playBloop } from '../utils/soundfx';

const PlantCard = ({ habit, onClearWeeds, wateringHabitId, onWateringComplete, onWateringStateChange }) => {
  const cardRef = useRef(null);
  const isTarget = wateringHabitId === habit.id;
  const [wateringProgress, setWateringProgress] = useState(0);
  const [isWateringActive, setIsWateringActive] = useState(false);
  const [droplets, setDroplets] = useState([]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    if (isTarget) return; // Disable parallax during watering mode
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    if (isTarget) {
      setIsWateringActive(false);
    }
  };

  const handlePointerEnter = () => {
    if (isTarget) {
      setIsWateringActive(true);
    }
  };

  const handlePointerDown = (e) => {
    if (isTarget) {
      // Direct click/tap support
      setIsWateringActive(true);
    }
  };

  // Water droplets generation
  useEffect(() => {
    if (!isWateringActive) {
      setDroplets([]);
      return;
    }
    const interval = setInterval(() => {
      setDroplets(prev => [
        ...prev.slice(-12),
        { id: Math.random(), x: Math.random() * 20 - 10 }
      ]);
    }, 60);
    return () => clearInterval(interval);
  }, [isWateringActive]);

  // Watering progress & sound physics
  useEffect(() => {
    let interval = null;
    if (isWateringActive && wateringProgress < 100) {
      startWateringSound();
      if (cardRef.current) {
        onWateringStateChange(true, cardRef.current.getBoundingClientRect());
      }
      interval = setInterval(() => {
        setWateringProgress(prev => {
          const next = prev + 2.5; // ~1.2s to fully water
          if (next >= 100) {
            clearInterval(interval);
            return 100;
          }
          return next;
        });
      }, 30);
    } else {
      stopWateringSound();
      if (isTarget) {
        onWateringStateChange(false, null);
      }
      // Slowly dry up if watering is interrupted
      if (wateringProgress > 0 && wateringProgress < 100) {
        interval = setInterval(() => {
          setWateringProgress(prev => Math.max(0, prev - 4));
        }, 45);
      }
    }
    return () => clearInterval(interval);
  }, [isWateringActive, isTarget, wateringProgress]);

  // Handle completion trigger
  useEffect(() => {
    if (wateringProgress >= 100) {
      playBloop();
      
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const xCoord = (rect.left + rect.width / 2) / window.innerWidth;
        const yCoord = (rect.top + rect.height / 2) / window.innerHeight;
        
        confetti({
          particleCount: 50,
          spread: 80,
          origin: { x: xCoord, y: yCoord },
          colors: ['#8DA399', '#C09A76', '#fff', '#8ec5fc'],
          zIndex: 1000
        });
      }
      
      stopWateringSound();
      onWateringStateChange(false, null);
      setIsWateringActive(false);
      onWateringComplete(habit.id);
      setWateringProgress(0);
    }
  }, [wateringProgress]);

  return (
    <motion.div 
      ref={cardRef}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      onPointerEnter={handlePointerEnter}
      onPointerDown={handlePointerDown}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        perspective: 800,
        position: 'relative'
      }}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          cursor: isTarget ? "none" : "pointer",
          padding: "1.2rem",
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          background: isTarget ? 'rgba(141, 163, 153, 0.1)' : 'rgba(255,255,255,0.02)',
          borderRadius: '20px',
          border: isTarget ? '2px dashed var(--accent-green)' : '2px solid transparent',
          boxShadow: isTarget ? '0 0 15px rgba(141, 163, 153, 0.3)' : 'none',
          transition: 'background-color 0.3s, border-color 0.3s, box-shadow 0.3s'
        }}
        whileHover={{ scale: isTarget ? 1.02 : 1.05 }}
      >
        <div style={{ transform: "translateZ(30px)", position: 'relative' }}>
          <Plant 
            stage={habit.stage} 
            isWilted={habit.isWilted} 
            type={habit.type} 
            isWet={habit.isCompletedToday}
            wateringProgress={wateringProgress}
          />
          
          {/* Water droplets particles */}
          <AnimatePresence>
            {isWateringActive && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
                {droplets.map(drop => (
                  <motion.div
                    key={drop.id}
                    initial={{ x: 35 + drop.x, y: -25, opacity: 0.8, scale: 0.8 }}
                    animate={{ x: -10 + drop.x, y: 70, opacity: 0, scale: 0.4 }}
                    transition={{ duration: 0.5, ease: 'easeIn' }}
                    style={{
                      position: 'absolute',
                      width: '5px',
                      height: '8px',
                      background: '#8ec5fc',
                      borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                    }}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Circular Progress Ring */}
          {wateringProgress > 0 && (
            <svg 
              width="120" 
              height="120" 
              style={{ 
                position: 'absolute', 
                top: '0px', 
                left: '50%', 
                transform: 'translateX(-50%) rotate(-90deg)', 
                pointerEvents: 'none', 
                zIndex: 1 
              }}
            >
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="rgba(141, 163, 153, 0.15)"
                strokeWidth="4"
                fill="transparent"
              />
              <motion.circle
                cx="60"
                cy="60"
                r="50"
                stroke="var(--accent-green)"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 50}
                strokeDashoffset={2 * Math.PI * 50 * (1 - wateringProgress / 100)}
                strokeLinecap="round"
                transition={{ ease: 'easeOut', duration: 0.05 }}
              />
            </svg>
          )}
          
          <AnimatePresence>
            {habit.hasWeeds && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0, opacity: 0, y: 20 }}
                  onClick={(e) => { e.stopPropagation(); onClearWeeds(habit.id); }}
                  style={{
                    position: 'absolute',
                    bottom: '0px',
                    left: '-15px',
                    fontSize: '1.5rem',
                    cursor: 'grab',
                    zIndex: 10,
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                  }}
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  title="Cabut rumput liar!"
                >
                  🌿
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0, opacity: 0, x: 20 }}
                  onClick={(e) => { e.stopPropagation(); onClearWeeds(habit.id); }}
                  style={{
                    position: 'absolute',
                    bottom: '5px',
                    right: '-10px',
                    fontSize: '1.2rem',
                    cursor: 'grab',
                    zIndex: 10,
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                  }}
                  whileHover={{ scale: 1.2, rotate: -15 }}
                  title="Singkirkan hama!"
                >
                  🐛
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
        <div style={{
          transform: "translateZ(40px)",
          fontSize: '0.8rem',
          fontWeight: 500,
          background: 'var(--card-bg)',
          padding: '4px 12px',
          borderRadius: '20px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
          textAlign: 'center',
          maxWidth: '120px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          marginTop: '1rem',
          color: habit.hasWeeds ? '#e74c3c' : 'inherit'
        }}>
          {habit.hasWeeds ? 'Bersihkan!' : (isTarget ? 'Siram Aku! 💧' : habit.title)}
        </div>
        {habit.consecutiveStreak >= 3 && !habit.hasWeeds && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              transform: "translateZ(50px)",
              marginTop: '4px',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: habit.consecutiveStreak >= 7 ? '#e67e22' : '#f0a500',
              display: 'flex',
              alignItems: 'center',
              gap: '2px'
            }}
          >
            🔥 {habit.consecutiveStreak} hari
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export const Garden = ({ habits, onClearWeeds, wateringHabitId, onWateringComplete, onWateringStateChange }) => {
  if (habits.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', flexDirection: 'column', color: 'var(--text-secondary)' }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center' }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🪨</div>
          <p>Tamanmu masih kosong.</p>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Mulai tanam kebiasaan baik pertamamu di bawah.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
      gap: '1.5rem',
      padding: '2rem',
      minHeight: '300px'
    }}>
      {habits.map((habit) => (
        <PlantCard 
          key={habit.id} 
          habit={habit} 
          onClearWeeds={onClearWeeds} 
          wateringHabitId={wateringHabitId}
          onWateringComplete={onWateringComplete}
          onWateringStateChange={onWateringStateChange}
        />
      ))}
    </div>
  );
};
