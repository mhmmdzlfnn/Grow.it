import { Plus, Check, Droplets, Trash2, Headphones, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { playBloop, playSwoosh } from '../utils/soundfx';

export const HabitList = ({ habits, onComplete, onAdd, onRemove, onFocus }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('sakura');
  
  const handleAdd = (e) => {
    e.preventDefault();
    if (newTitle.trim()) {
      onAdd(newTitle.trim(), newType);
      setNewTitle('');
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '2rem' }}>
      <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
        <Droplets size={20} color="var(--accent-green)" />
        Siram Tanamanmu
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {habits.map(habit => (
          <motion.div 
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={habit.id} 
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem',
              background: habit.isCompletedToday ? 'rgba(141, 163, 153, 0.1)' : '#fff',
              borderRadius: '12px',
              border: '1px solid',
              borderColor: habit.hasWeeds ? '#e74c3c' : (habit.isCompletedToday ? 'var(--accent-green)' : 'var(--border-color)'),
              transition: 'all 0.3s ease'
            }}
          >
            <div>
              <div style={{ 
                fontWeight: 500,
                color: habit.isCompletedToday ? 'var(--text-secondary)' : (habit.hasWeeds ? '#e74c3c' : 'var(--text-primary)'),
                textDecoration: habit.isCompletedToday ? 'line-through' : 'none'
              }}>
                {habit.title}
                {habit.hasWeeds && <span style={{ fontSize: '0.75rem', marginLeft: '0.5rem', color: '#e74c3c', display: 'inline-flex', alignItems: 'center', gap: '2px' }}><AlertTriangle size={12}/> Bersihkan kebun!</span>}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Streak: {habit.history.length} hari
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button
                onClick={() => onRemove(habit.id)}
                style={{
                  color: 'var(--text-secondary)',
                  opacity: 0.5,
                  transition: 'all 0.2s',
                  padding: '4px',
                  display: 'flex',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.color = '#e74c3c'; }}
                onMouseOut={(e) => { e.currentTarget.style.opacity = 0.5; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                title="Hapus Tanaman"
              >
                <Trash2 size={18} />
              </button>
              
              <button
                onClick={() => { playSwoosh(); onFocus(habit); }}
                style={{
                  color: 'var(--text-secondary)',
                  opacity: 0.8,
                  transition: 'all 0.2s',
                  padding: '6px 10px',
                  display: 'flex',
                  background: 'rgba(141, 163, 153, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid transparent',
                  cursor: 'pointer',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 500
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--accent-green)'; e.currentTarget.style.color = 'var(--accent-green)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                title="Focus Mode"
              >
                <Headphones size={16} /> Focus
              </button>

              <button
                onClick={(e) => {
                  if (habit.hasWeeds) {
                    alert("Cabut rumput dan singkirkan hama di tanamanmu dulu sebelum menyiramnya!");
                    return;
                  }
                  playBloop();
                  
                  // Fire confetti relative to button position
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = (rect.left + rect.width / 2) / window.innerWidth;
                  const y = (rect.top + rect.height / 2) / window.innerHeight;
                  
                  confetti({
                    particleCount: 40,
                    spread: 60,
                    origin: { x, y },
                    colors: ['#8DA399', '#C09A76', '#fff'],
                    zIndex: 200
                  });
                  
                  onComplete(habit.id);
                }}
              disabled={habit.isCompletedToday}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: habit.isCompletedToday ? 'var(--accent-green)' : (habit.hasWeeds ? '#fff0f0' : 'transparent'),
                border: `2px solid ${habit.isCompletedToday ? 'var(--accent-green)' : (habit.hasWeeds ? '#e74c3c' : 'var(--border-color)')}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: habit.isCompletedToday ? 'default' : 'pointer',
                color: habit.hasWeeds ? '#e74c3c' : '#fff',
                transition: 'all 0.2s',
                boxShadow: habit.isCompletedToday ? 'none' : 'var(--shadow-sm)'
              }}
              onMouseOver={(e) => {
                if (!habit.isCompletedToday && !habit.hasWeeds) e.currentTarget.style.borderColor = 'var(--accent-green)';
              }}
              onMouseOut={(e) => {
                if (!habit.isCompletedToday && !habit.hasWeeds) e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              {habit.isCompletedToday && <Check size={18} strokeWidth={3} />}
              {habit.hasWeeds && !habit.isCompletedToday && <AlertTriangle size={18} strokeWidth={2} />}
            </button>
            </div>
          </motion.div>
        ))}
        {habits.length === 0 && (
          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)', padding: '1rem 0' }}>
            Belum ada kebiasaan yang ditanam.
          </p>
        )}
      </div>

      <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1.5rem', background: 'rgba(255,255,255,0.4)', padding: '1rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
          {[
            { id: 'sakura', icon: '🌸', label: 'Sakura' },
            { id: 'bambu', icon: '🎋', label: 'Bambu' },
            { id: 'kaktus', icon: '🌵', label: 'Kaktus' },
            { id: 'pohon', icon: '🌳', label: 'Pohon' }
          ].map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setNewType(t.id)}
              style={{
                padding: '0.5rem',
                borderRadius: '12px',
                border: `2px solid ${newType === t.id ? 'var(--accent-green)' : 'transparent'}`,
                background: newType === t.id ? 'rgba(141, 163, 153, 0.1)' : 'transparent',
                fontSize: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                opacity: newType === t.id ? 1 : 0.5,
                transform: newType === t.id ? 'scale(1.1)' : 'scale(1)'
              }}
              title={t.label}
            >
              {t.icon}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Tanam kebiasaan baru..."
          style={{
            flex: 1,
            padding: '0.8rem 1rem',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            background: 'rgba(255, 255, 255, 0.5)',
            outline: 'none',
            fontSize: '0.95rem'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--accent-brown)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
        />
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit" 
          style={{
            background: 'var(--accent-brown)',
            color: '#fff',
            padding: '0 1rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
            <Plus size={24} />
          </motion.button>
        </div>
      </form>
    </div>
  );
};
