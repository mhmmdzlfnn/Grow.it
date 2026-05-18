import { Plant } from './Plant';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

const PlantCard = ({ habit, onClearWeeds }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
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
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
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
          cursor: "pointer",
          padding: "1rem",
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: '20px',
        }}
        whileHover={{ scale: 1.05 }}
      >
        <div style={{ transform: "translateZ(30px)", position: 'relative' }}>
          <Plant stage={habit.stage} isWilted={habit.isWilted} type={habit.type} />
          
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
          {habit.hasWeeds ? 'Bersihkan!' : habit.title}
        </div>
      </motion.div>
    </motion.div>
  );
};

export const Garden = ({ habits, onClearWeeds }) => {
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
        <PlantCard key={habit.id} habit={habit} onClearWeeds={onClearWeeds} />
      ))}
    </div>
  );
};
