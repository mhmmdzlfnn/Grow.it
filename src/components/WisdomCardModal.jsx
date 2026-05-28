import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Sparkles, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { generateWisdomCard } from '../utils/aiMock';

export const WisdomCardModal = ({ habits, wisdomCardsState, onClose }) => {
  const { history, todayCard, hasDrawnToday, drawCard, saveReflection } = wisdomCardsState;
  
  const [activeTab, setActiveTab] = useState('card'); // 'card' | 'history'
  const [selectedCardIdx, setSelectedCardIdx] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reflectionText, setReflectionText] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Sync today's reflection if already drawn
  useEffect(() => {
    if (todayCard) {
      setReflectionText(todayCard.reflection || '');
    }
  }, [todayCard]);

  // Card themes that blend with App themes using opacity mixing
  const elementStyles = {
    Bumi: {
      bg: 'linear-gradient(135deg, var(--card-bg) 0%, rgba(192, 154, 118, 0.15) 100%)',
      border: 'var(--border-color)',
      glow: 'rgba(192, 154, 118, 0.2)'
    },
    Air: {
      bg: 'linear-gradient(135deg, var(--card-bg) 0%, rgba(142, 197, 252, 0.2) 100%)',
      border: 'var(--border-color)',
      glow: 'rgba(142, 197, 252, 0.25)'
    },
    Angin: {
      bg: 'linear-gradient(135deg, var(--card-bg) 0%, rgba(141, 163, 153, 0.22) 100%)',
      border: 'var(--border-color)',
      glow: 'rgba(141, 163, 153, 0.2)'
    },
    Api: {
      bg: 'linear-gradient(135deg, var(--card-bg) 0%, rgba(245, 196, 163, 0.22) 100%)',
      border: 'var(--border-color)',
      glow: 'rgba(245, 196, 163, 0.2)'
    },
    Emas: {
      bg: 'linear-gradient(135deg, var(--card-bg) 0%, rgba(255, 208, 102, 0.25) 100%)',
      border: 'rgba(255, 208, 102, 0.4)',
      glow: 'rgba(255, 208, 102, 0.35)'
    }
  };

  const handleCardDraw = async (idx) => {
    if (hasDrawnToday || isLoading) return;
    setSelectedCardIdx(idx);
    setIsLoading(true);

    const elements = ['Bumi', 'Air', 'Angin', 'Api'];
    // 12% chance of Emas, 22% each for others
    const chosenElement = Math.random() < 0.12 ? 'Emas' : elements[Math.floor(Math.random() * elements.length)];

    try {
      const data = await generateWisdomCard(chosenElement, habits);
      drawCard(chosenElement, data);
    } catch (e) {
      console.error('Error drawing card:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveReflection = () => {
    saveReflection(reflectionText);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Card component for drawing
  const CardBack = ({ index }) => (
    <motion.div
      onClick={() => handleCardDraw(index)}
      whileTap={{ scale: 0.97 }}
      className="wisdom-card-back"
    >
      <div className="wisdom-card-inner-border">
        <div className="card-sparkle">✨</div>
        <div className="card-label">Pilih Kartu</div>
      </div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}
      >
        <motion.div
          initial={{ scale: 0.95, y: 15 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 15 }}
          className="glass-panel"
          style={{
            width: '100%',
            maxWidth: '520px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border-color)',
            background: 'var(--card-bg)',
            overflow: 'hidden'
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1.2rem',
              right: '1.2rem',
              color: 'var(--text-secondary)',
              background: 'rgba(0,0,0,0.05)',
              borderRadius: '50%',
              padding: '6px',
              display: 'flex',
              zIndex: 10,
              cursor: 'pointer'
            }}
          >
            <X size={16} strokeWidth={2.5} />
          </button>

          {/* Header & Tabs */}
          <div style={{ padding: '1.5rem 1.5rem 0 1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{
                background: 'linear-gradient(135deg, var(--accent-brown), var(--accent-green))',
                color: '#fff',
                borderRadius: '8px',
                padding: '6px',
                display: 'flex'
              }}>
                <Sparkles size={16} />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Pesan Alam
              </h2>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '-1px' }}>
              <button
                onClick={() => setActiveTab('card')}
                style={{
                  padding: '0.6rem 0.5rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: activeTab === 'card' ? 'var(--accent-brown)' : 'var(--text-secondary)',
                  borderBottom: activeTab === 'card' ? '2px solid var(--accent-brown)' : '2px solid transparent',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
              >
                Refleksi Harian
              </button>
              <button
                onClick={() => setActiveTab('history')}
                style={{
                  padding: '0.6rem 0.5rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: activeTab === 'history' ? 'var(--accent-brown)' : 'var(--text-secondary)',
                  borderBottom: activeTab === 'history' ? '2px solid var(--accent-brown)' : '2px solid transparent',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer'
                }}
              >
                <BookOpen size={14} />
                Riwayat Jurnal
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, minHeight: '340px' }}>
            {activeTab === 'card' ? (
              !hasDrawnToday ? (
                // DRAW SCREEN
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1.5rem', padding: '0.5rem 0' }}>
                  <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '340px', margin: 0 }}>
                    Tarik satu kartu harianmu hari ini untuk menerima wejangan dan menulis jurnal refleksi diri.
                  </p>
                  
                  {isLoading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', margin: '2rem 0' }}>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                        style={{ fontSize: '2.5rem' }}
                      >
                        ✨
                      </motion.div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                        Menyelaraskan kebijaksanaan alam...
                      </p>
                    </div>
                  ) : (
                    <div className="wisdom-card-deck">
                      <CardBack index={0} />
                      <CardBack index={1} />
                      <CardBack index={2} />
                    </div>
                  )}
                </div>
              ) : (
                // TODAY'S CARD SHOWN
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', perspective: 1000 }}>
                    <motion.div
                      initial={{ rotateY: 180, scale: 0.95 }}
                      animate={{ rotateY: 0, scale: 1 }}
                      transition={{ type: 'spring', damping: 15, stiffness: 100 }}
                      style={{
                        width: '100%',
                        maxWidth: '260px',
                        height: '170px',
                        background: elementStyles[todayCard.element]?.bg || 'var(--card-bg)',
                        border: `1.5px solid ${elementStyles[todayCard.element]?.border || 'var(--border-color)'}`,
                        borderRadius: '16px',
                        padding: '1rem',
                        boxShadow: `0 10px 20px ${elementStyles[todayCard.element]?.glow || 'rgba(0,0,0,0.05)'}`,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        position: 'relative'
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: '0.6rem',
                        right: '0.8rem',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        color: 'var(--text-secondary)',
                        opacity: 0.7,
                        letterSpacing: '1px'
                      }}>
                        PESAN ALAM
                      </div>

                      <div style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.08))' }}>
                        {todayCard.emoji}
                      </div>
                      
                      <div style={{
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)'
                      }}>
                        Elemen {todayCard.element}
                      </div>

                      <div style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '2px 10px',
                        borderRadius: '20px',
                        background: 'rgba(255,255,255,0.25)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)'
                      }}>
                        {new Date(todayCard.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    </motion.div>
                  </div>

                  <div style={{
                    padding: '1rem 1.2rem',
                    background: 'rgba(141, 163, 153, 0.06)',
                    borderRadius: '12px',
                    borderLeft: '4px solid var(--accent-green)',
                    fontStyle: 'italic',
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                    color: 'var(--text-primary)'
                  }}>
                    "{todayCard.wisdom}"
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <span>💡</span> {todayCard.prompt}
                    </label>
                    <textarea
                      value={reflectionText}
                      onChange={(e) => setReflectionText(e.target.value)}
                      placeholder="Bagikan refleksimu atau catat rasa syukurmu hari ini di sini..."
                      style={{
                        width: '100%',
                        height: '100px',
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)',
                        padding: '0.8rem',
                        fontSize: '0.85rem',
                        fontFamily: 'inherit',
                        background: 'rgba(255,255,255,0.15)',
                        color: 'var(--text-primary)',
                        resize: 'none',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.2rem' }}>
                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={handleSaveReflection}
                        style={{
                          background: isSaved ? 'var(--accent-green)' : 'var(--accent-brown)',
                          color: '#fff',
                          fontWeight: 600,
                          fontSize: '0.8rem',
                          padding: '0.5rem 1.2rem',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          boxShadow: 'var(--shadow-sm)',
                          cursor: 'pointer',
                          transition: 'background-color 0.3s'
                        }}
                      >
                        {isSaved ? <Check size={12} /> : null}
                        {isSaved ? 'Refleksi Disimpan!' : 'Simpan Refleksi'}
                      </motion.button>
                    </div>
                  </div>
                </div>
              )
            ) : (
              // HISTORY SCREEN
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {history.length === 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.5 }}>📖</div>
                    <p style={{ fontSize: '0.85rem' }}>Belum ada catatan jurnal.</p>
                    <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>Ayo tarik kartu harianmu!</p>
                  </div>
                ) : (
                  history.map((card) => (
                    <div
                      key={card.timestamp}
                      style={{
                        padding: '1rem',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.01)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontSize: '1.2rem' }}>{card.emoji}</span>
                          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                            Elemen {card.element}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                          {new Date(card.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      
                      <div style={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--text-secondary)', paddingLeft: '0.4rem', borderLeft: '2px solid var(--accent-green)' }}>
                        "{card.wisdom}"
                      </div>
                      
                      {card.reflection ? (
                        <div style={{
                          padding: '0.5rem 0.7rem',
                          background: 'rgba(192, 154, 118, 0.06)',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          color: 'var(--text-primary)'
                        }}>
                          <strong style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--accent-brown)', marginBottom: '2px' }}>
                            Catatan Jurnal:
                          </strong>
                          {card.reflection}
                        </div>
                      ) : (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', opacity: 0.6, fontStyle: 'italic', paddingLeft: '0.4rem' }}>
                          Tidak ada catatan ditulis.
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
