import { motion } from 'framer-motion';

export const StreakHeatmap = ({ habits }) => {
  // Generate last 35 days (5 weeks of 7 days)
  const today = new Date();
  const days = [];
  
  for (let i = 34; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }

  // Count completions per day
  const completionsPerDay = {};
  days.forEach(day => {
    completionsPerDay[day] = 0;
  });

  let maxCompletions = 1; // prevent divide by zero
  
  habits.forEach(habit => {
    habit.history.forEach(date => {
      if (completionsPerDay[date] !== undefined) {
        completionsPerDay[date]++;
        if (completionsPerDay[date] > maxCompletions) {
          maxCompletions = completionsPerDay[date];
        }
      }
    });
  });

  const getIntensityColor = (count) => {
    if (count === 0) return 'rgba(141, 163, 153, 0.1)'; // Empty
    const intensity = Math.min(1, count / 3); // Max intensity at 3 completions
    // We blend between empty and accent green
    return `rgba(141, 163, 153, ${0.3 + intensity * 0.7})`;
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '2rem' }}>
      <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
        Konsistensi Kebiasaan
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '8px',
        maxWidth: '100%'
      }}>
        {days.map((day, index) => {
          const count = completionsPerDay[day];
          return (
            <motion.div
              key={day}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.01 }}
              title={`${day}: ${count} kebiasaan diselesaikan`}
              style={{
                aspectRatio: '1 / 1',
                borderRadius: '6px',
                background: getIntensityColor(count),
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            />
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '1rem', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
        <span>Sedikit</span>
        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(141, 163, 153, 0.1)' }}></div>
        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(141, 163, 153, 0.6)' }}></div>
        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'rgba(141, 163, 153, 1)' }}></div>
        <span>Banyak</span>
      </div>
    </div>
  );
};
