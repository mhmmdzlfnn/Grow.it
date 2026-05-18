import { Moon, Sun, Sunset, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

export const ThemeToggle = ({ theme, setTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (t) => {
    switch(t) {
      case 'day': return <Sun size={20} />;
      case 'evening': return <Sunset size={20} />;
      case 'night': return <Moon size={20} />;
      default: return <Sparkles size={20} />; // auto
    }
  };

  const options = [
    { id: 'auto', label: 'Auto (Time)' },
    { id: 'day', label: 'Pagi/Siang' },
    { id: 'evening', label: 'Senja' },
    { id: 'night', label: 'Malam' }
  ];

  return (
    <div style={{ position: 'relative' }} ref={menuRef}>
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '40px', height: '40px',
          borderRadius: '50%',
          background: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-primary)',
          boxShadow: 'var(--shadow-sm)',
          cursor: 'pointer'
        }}
        title="Ubah Tema"
      >
        <motion.div
          key={theme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {getIcon(theme)}
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            style={{
              position: 'absolute',
              top: '120%', right: 0,
              background: 'var(--card-bg)',
              backdropFilter: 'blur(12px)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '0.5rem',
              display: 'flex', flexDirection: 'column', gap: '0.2rem',
              boxShadow: 'var(--shadow-md)',
              zIndex: 100
            }}
          >
            {options.map(opt => (
              <button
                key={opt.id}
                onClick={() => { setTheme(opt.id); setIsOpen(false); }}
                style={{
                  padding: '0.6rem 1rem',
                  borderRadius: '8px',
                  background: theme === opt.id ? 'var(--accent-green)' : 'transparent',
                  color: theme === opt.id ? '#fff' : 'var(--text-primary)',
                  textAlign: 'left',
                  fontSize: '0.9rem',
                  whiteSpace: 'nowrap',
                  transition: 'background 0.2s',
                  fontWeight: theme === opt.id ? 600 : 400
                }}
                onMouseOver={(e) => {
                  if (theme !== opt.id) e.currentTarget.style.background = 'rgba(141, 163, 153, 0.1)';
                }}
                onMouseOut={(e) => {
                  if (theme !== opt.id) e.currentTarget.style.background = 'transparent';
                }}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
