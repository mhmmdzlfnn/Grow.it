import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

export const AiZenMaster = ({ message, onClose }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            maxWidth: '350px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid var(--accent-brown)',
            borderRadius: '20px',
            padding: '1.5rem',
            boxShadow: '0 20px 25px -5px rgba(192, 154, 118, 0.2), 0 10px 10px -5px rgba(192, 154, 118, 0.1)',
            zIndex: 50
          }}
        >
          <button
            onClick={onClose}
            style={{ 
              position: 'absolute', 
              top: '12px', 
              right: '12px', 
              color: 'var(--text-secondary)',
              background: 'rgba(0,0,0,0.05)',
              borderRadius: '50%',
              padding: '4px',
              display: 'flex'
            }}
          >
            <X size={14} strokeWidth={3} />
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-brown)', marginBottom: '0.8rem', fontWeight: 600 }}>
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <Sparkles size={18} />
            </motion.div>
            <span>AI Zen Master</span>
          </div>
          
          <p style={{ fontSize: '0.95rem', fontStyle: 'italic', lineHeight: 1.6, color: 'var(--text-primary)' }}>
            "{message}"
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
