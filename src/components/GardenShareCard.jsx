import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { X, Download, Share2, Camera } from 'lucide-react';
import html2canvas from 'html2canvas';

// Standalone plant renderer (no animation — html2canvas can't capture CSS animations)
const StaticPlant = ({ type, stage, isWilted }) => {
  const getEmoji = () => {
    if (isWilted) return '🥀';
    if (type === 'bambu') return ['🌱','🎍','🎋','🎋'][stage] ?? '🎋';
    if (type === 'kaktus') return ['🌱','🌵','🌵','🌵'][stage] ?? '🌵';
    if (type === 'pohon') return ['🌱','🌿','🌳','🍎'][stage] ?? '🌳';
    return ['🌱','🌿','🪴','🌸'][stage] ?? '🌸';
  };
  const sizes = ['1.6rem','2.2rem','2.8rem','3.4rem'];
  return (
    <div style={{ fontSize: sizes[stage] ?? '2rem', lineHeight: 1, filter: isWilted ? 'saturate(0.2)' : 'none' }}>
      {getEmoji()}
    </div>
  );
};

// The actual card that gets screenshotted
const ShareCardCanvas = ({ habits, cardRef }) => {
  const today = new Date();
  const dateStr = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  const totalDays   = habits.reduce((s, h) => s + h.history.length, 0);
  const bestStreak  = Math.max(0, ...habits.map(h => h.consecutiveStreak ?? 0));
  const bloomCount  = habits.filter(h => h.stage === 3).length;
  const activeCount = habits.filter(h => !h.isWilted).length;

  return (
    <div
      ref={cardRef}
      style={{
        width: '420px',
        background: 'linear-gradient(145deg, #1a2e1a 0%, #0f1f0f 40%, #1a1a2e 100%)',
        borderRadius: '24px',
        padding: '32px',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Background glow blobs */}
      <div style={{ position:'absolute', top:'-60px', right:'-60px', width:'200px', height:'200px', borderRadius:'50%', background:'radial-gradient(circle, rgba(141,163,153,0.15) 0%, transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'-40px', left:'-40px', width:'160px', height:'160px', borderRadius:'50%', background:'radial-gradient(circle, rgba(192,154,118,0.12) 0%, transparent 70%)', pointerEvents:'none' }} />

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
          <div style={{ width:'36px', height:'36px', background:'linear-gradient(135deg, #8DA399, #6b8f7e)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem' }}>
            🌿
          </div>
          <div>
            <div style={{ fontWeight:700, fontSize:'1.1rem', letterSpacing:'-0.3px' }}>Grow.it</div>
            <div style={{ fontSize:'0.7rem', color:'rgba(255,255,255,0.45)', marginTop:'1px' }}>Taman Kebiasaanku</div>
          </div>
        </div>
        <div style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.4)', textAlign:'right' }}>
          {dateStr}
        </div>
      </div>

      {/* Plants grid */}
      <div style={{
        background:'rgba(255,255,255,0.04)',
        borderRadius:'16px',
        padding:'20px',
        marginBottom:'20px',
        border:'1px solid rgba(255,255,255,0.07)',
        minHeight:'120px',
      }}>
        {habits.length === 0 ? (
          <div style={{ textAlign:'center', color:'rgba(255,255,255,0.3)', fontSize:'0.85rem', padding:'20px 0' }}>
            Belum ada tanaman 🪨
          </div>
        ) : (
          <div style={{ display:'flex', flexWrap:'wrap', gap:'16px', justifyContent: habits.length <= 4 ? 'center' : 'flex-start', alignItems: 'flex-end' }}>
            {habits.slice(0, 9).map(habit => (
              <div key={habit.id} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'6px', minWidth:'60px' }}>
                {/* Fixed height container so all plants align to the same baseline */}
                <div style={{ height: '3.6rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                  <StaticPlant type={habit.type} stage={habit.stage} isWilted={habit.isWilted} />
                </div>
                <div style={{
                  fontSize:'0.62rem',
                  color:'rgba(255,255,255,0.55)',
                  textAlign:'center',
                  maxWidth:'72px',
                  wordBreak:'break-word',
                  lineHeight: 1.3,
                }}>
                  {habit.title}
                </div>
                {(habit.consecutiveStreak ?? 0) >= 3 && (
                  <div style={{ fontSize:'0.6rem', color:'#ff8c42', fontWeight:700 }}>
                    🔥{habit.consecutiveStreak}
                  </div>
                )}
              </div>
            ))}
            {habits.length > 9 && (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.75rem', color:'rgba(255,255,255,0.3)', minWidth:'60px' }}>
                +{habits.length - 9} lagi
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'10px', marginBottom:'20px' }}>
        {[
          { label:'Total Hari',  value: totalDays,   icon:'📅' },
          { label:'Best Streak', value: bestStreak,  icon:'🔥' },
          { label:'Bloom',       value: bloomCount,  icon:'🌸' },
          { label:'Aktif',       value: activeCount, icon:'💚' },
        ].map(stat => (
          <div key={stat.label} style={{
            background:'rgba(255,255,255,0.05)',
            borderRadius:'12px',
            padding:'10px 8px',
            textAlign:'center',
            border:'1px solid rgba(255,255,255,0.07)',
          }}>
            <div style={{ fontSize:'1rem', marginBottom:'3px' }}>{stat.icon}</div>
            <div style={{ fontSize:'1.1rem', fontWeight:700, color:'#fff' }}>{stat.value}</div>
            <div style={{ fontSize:'0.58rem', color:'rgba(255,255,255,0.4)', marginTop:'2px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quote */}
      <div style={{
        background:'rgba(141,163,153,0.1)',
        borderRadius:'12px',
        padding:'12px 16px',
        borderLeft:'3px solid rgba(141,163,153,0.5)',
        marginBottom:'20px',
      }}>
        <p style={{ fontSize:'0.78rem', fontStyle:'italic', color:'rgba(255,255,255,0.65)', margin:0, lineHeight:1.6 }}>
          "Pohon besar berawal dari satu biji kecil. Teruslah bertumbuh, satu hari dalam satu waktu."
        </p>
      </div>

      {/* Footer */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ fontSize:'0.65rem', color:'rgba(255,255,255,0.25)' }}>grow-it.app</div>
        <div style={{ display:'flex', gap:'4px' }}>
          {['🌱','🌿','🪴','🌸','🌳'].map((e, i) => (
            <span key={i} style={{ fontSize:'0.8rem', opacity: 0.4 + i * 0.12 }}>{e}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export const GardenShareCard = ({ habits, onClose }) => {
  const cardRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleCapture = async () => {
    if (!cardRef.current) return;
    setIsCapturing(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });
      const url = canvas.toDataURL('image/png');
      setPreviewUrl(url);
    } catch (e) {
      console.error('Capture failed', e);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleDownload = () => {
    if (!previewUrl) return;
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = `growit-garden-${new Date().toISOString().split('T')[0]}.png`;
    a.click();
  };

  const handleShare = async () => {
    if (!previewUrl) return;
    try {
      const blob = await (await fetch(previewUrl)).blob();
      const file = new File([blob], 'growit-garden.png', { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Taman Kebiasaanku — Grow.it' });
      } else {
        handleDownload();
      }
    } catch {
      handleDownload();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        style={{
          position: 'fixed', inset: 0, zIndex: 150,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem',
        }}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 40 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          style={{
            background: 'var(--card-bg, #fff)',
            borderRadius: '28px',
            padding: '1.5rem',
            maxWidth: '480px',
            width: '100%',
            boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
            position: 'relative',
          }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '16px', right: '16px',
              background: 'rgba(0,0,0,0.08)', border: 'none', borderRadius: '50%',
              width: '32px', height: '32px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)',
            }}
          >
            <X size={16} />
          </button>

          <h3 style={{ margin: '0 0 1.2rem', fontWeight: 700, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Camera size={20} color="var(--accent-green)" />
            Garden Share Card
          </h3>

          {/* Card preview */}
          <div style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '1.2rem', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
            {previewUrl ? (
              <img src={previewUrl} alt="Garden card preview" style={{ width: '100%', display: 'block', borderRadius: '16px' }} />
            ) : (
              <div style={{ transform: 'scale(0.95)', transformOrigin: 'top center' }}>
                <ShareCardCanvas habits={habits} cardRef={cardRef} />
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {!previewUrl ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleCapture}
                disabled={isCapturing}
                style={{
                  flex: 1, padding: '0.85rem', borderRadius: '14px',
                  background: 'linear-gradient(135deg, #8DA399, #6b8f7e)',
                  color: '#fff', fontWeight: 600, fontSize: '0.95rem',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  opacity: isCapturing ? 0.7 : 1,
                }}
              >
                <Camera size={18} />
                {isCapturing ? 'Memproses...' : 'Generate Kartu'}
              </motion.button>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setPreviewUrl(null)}
                  style={{
                    padding: '0.85rem 1rem', borderRadius: '14px',
                    background: 'rgba(0,0,0,0.06)', color: 'var(--text-secondary)',
                    fontWeight: 600, border: 'none', cursor: 'pointer',
                    fontSize: '0.85rem',
                  }}
                >
                  Ulang
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDownload}
                  style={{
                    flex: 1, padding: '0.85rem', borderRadius: '14px',
                    background: 'rgba(141,163,153,0.15)',
                    color: 'var(--accent-green, #8DA399)', fontWeight: 600,
                    border: '1px solid rgba(141,163,153,0.3)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    fontSize: '0.9rem',
                  }}
                >
                  <Download size={16} />
                  Simpan
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleShare}
                  style={{
                    flex: 1, padding: '0.85rem', borderRadius: '14px',
                    background: 'linear-gradient(135deg, #8DA399, #6b8f7e)',
                    color: '#fff', fontWeight: 600,
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    fontSize: '0.9rem',
                  }}
                >
                  <Share2 size={16} />
                  Share
                </motion.button>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
