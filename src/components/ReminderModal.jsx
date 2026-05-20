import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, BellOff, Clock, Trash2, BellRing } from 'lucide-react';
import { useState } from 'react';

const QUICK_TIMES = [
  { label: 'Pagi', time: '07:00', emoji: '🌅' },
  { label: 'Siang', time: '12:00', emoji: '☀️' },
  { label: 'Sore', time: '16:00', emoji: '🌤️' },
  { label: 'Malam', time: '20:00', emoji: '🌙' },
];

export const ReminderModal = ({ habit, reminder, permission, onRequestPermission, onSave, onRemove, onClose }) => {
  const [time, setTime] = useState(reminder?.time ?? '08:00');
  const [requesting, setRequesting] = useState(false);

  const handleRequestPermission = async () => {
    setRequesting(true);
    await onRequestPermission();
    setRequesting(false);
  };

  const handleSave = () => {
    onSave(habit.id, time, true);
    onClose();
  };

  const handleRemove = () => {
    onRemove(habit.id);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        style={{
          position: 'fixed', inset: 0, zIndex: 160,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem',
        }}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 30 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          style={{
            background: 'var(--card-bg, #fff)',
            borderRadius: '24px',
            padding: '1.75rem',
            maxWidth: '380px',
            width: '100%',
            boxShadow: '0 32px 64px rgba(0,0,0,0.3)',
            position: 'relative',
          }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '16px', right: '16px',
              background: 'rgba(0,0,0,0.07)', border: 'none', borderRadius: '50%',
              width: '30px', height: '30px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)',
            }}
          >
            <X size={15} />
          </button>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(141,163,153,0.2), rgba(141,163,153,0.1))',
              border: '1px solid rgba(141,163,153,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <BellRing size={20} color="var(--accent-green)" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                Set Pengingat
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '1px' }}>
                {habit.title}
              </div>
            </div>
          </div>

          {/* Permission warning */}
          {permission !== 'granted' && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'rgba(230, 126, 34, 0.1)',
                border: '1px solid rgba(230, 126, 34, 0.3)',
                borderRadius: '12px',
                padding: '0.85rem 1rem',
                marginBottom: '1.25rem',
                fontSize: '0.82rem',
                color: '#e67e22',
                lineHeight: 1.5,
              }}
            >
              {permission === 'denied' ? (
                <>
                  🚫 Notifikasi diblokir browser. Aktifkan di pengaturan browser kamu untuk menggunakan fitur ini.
                </>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <span>🔔 Izinkan notifikasi untuk menerima pengingat.</span>
                  <button
                    onClick={handleRequestPermission}
                    disabled={requesting}
                    style={{
                      background: '#e67e22', color: '#fff', border: 'none',
                      borderRadius: '8px', padding: '0.4rem 0.8rem',
                      fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                      whiteSpace: 'nowrap', flexShrink: 0,
                    }}
                  >
                    {requesting ? '...' : 'Izinkan'}
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Quick time presets */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Pilih Waktu Cepat
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
              {QUICK_TIMES.map(qt => (
                <button
                  key={qt.time}
                  onClick={() => setTime(qt.time)}
                  style={{
                    padding: '0.6rem 0.4rem',
                    borderRadius: '12px',
                    border: `2px solid ${time === qt.time ? 'var(--accent-green)' : 'var(--border-color)'}`,
                    background: time === qt.time ? 'rgba(141,163,153,0.12)' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>{qt.emoji}</span>
                  <span style={{ fontSize: '0.65rem', fontWeight: 600, color: time === qt.time ? 'var(--accent-green)' : 'var(--text-secondary)' }}>
                    {qt.label}
                  </span>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', opacity: 0.7 }}>
                    {qt.time}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom time input */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Atau Atur Manual
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              background: 'rgba(141,163,153,0.08)',
              border: '1px solid var(--border-color)',
              borderRadius: '14px', padding: '0.75rem 1rem',
            }}>
              <Clock size={18} color="var(--accent-green)" />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                style={{
                  flex: 1, border: 'none', background: 'transparent',
                  fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)',
                  outline: 'none', cursor: 'pointer',
                  fontFamily: 'monospace',
                }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            {reminder && (
              <button
                onClick={handleRemove}
                style={{
                  padding: '0.8rem', borderRadius: '12px',
                  background: 'rgba(231,76,60,0.08)',
                  border: '1px solid rgba(231,76,60,0.2)',
                  color: '#e74c3c', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                title="Hapus pengingat"
              >
                <Trash2 size={16} />
              </button>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              disabled={permission === 'denied'}
              style={{
                flex: 1, padding: '0.85rem', borderRadius: '14px',
                background: permission === 'denied'
                  ? 'rgba(0,0,0,0.1)'
                  : 'linear-gradient(135deg, #8DA399, #6b8f7e)',
                color: permission === 'denied' ? 'var(--text-secondary)' : '#fff',
                fontWeight: 600, fontSize: '0.95rem',
                border: 'none', cursor: permission === 'denied' ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              }}
            >
              <Bell size={16} />
              Simpan Pengingat
            </motion.button>
          </div>

          {permission === 'granted' && (
            <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.75rem', opacity: 0.7 }}>
              Notifikasi akan muncul setiap hari pukul {time} jika habit belum diselesaikan.
            </p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
