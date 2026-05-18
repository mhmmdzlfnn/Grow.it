import { Plant } from './Plant';
import { motion } from 'framer-motion';

export const Garden = ({ habits }) => {
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
      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
      gap: '2rem',
      padding: '2rem',
      minHeight: '300px'
    }}>
      {habits.map((habit) => (
        <motion.div 
          key={habit.id}
          layout
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}
        >
          <Plant stage={habit.stage} isWilted={habit.isWilted} type={habit.type} />
          <div style={{
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
            textOverflow: 'ellipsis'
          }}>
            {habit.title}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
