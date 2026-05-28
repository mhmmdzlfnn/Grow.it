import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';
import { parseVoiceCommand } from '../utils/aiMock';

export const PetCompanion = ({ habits = [], onCompleteHabit }) => {
  const [isAwake, setIsAwake] = useState(false);
  const [message, setMessage] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  
  // Voice Command States
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  // Keep references to current props to avoid resetting effect
  const habitsRef = useRef(habits);
  const onCompleteRef = useRef(onCompleteHabit);
  const silenceTimeoutRef = useRef(null);

  useEffect(() => {
    habitsRef.current = habits;
    onCompleteRef.current = onCompleteHabit;
  }, [habits, onCompleteHabit]);

  const idleMessages = [
    "Zzz...",
    "Nyaman sekali di sini...",
    "Mengeong dalam mimpi...",
    "Tamanmu semakin indah...",
    "Jangan lupa istirahat ya...",
    "Purrr..."
  ];

  const awakeMessages = [
    "Meow! Semangat berkebunnya! 💖",
    "Ada yang bisa kubantu? 🐾",
    "Tanamanmu tumbuh subur! 🌿",
    "Purr... Kamu hebat hari ini!",
    "Aku suka melihatmu fokus! ✨"
  ];

  // Initialize Speech Recognition once
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.lang = 'id-ID';
    rec.continuous = true;
    rec.interimResults = true;
    
    rec.onstart = () => {
      setIsListening(true);
      setIsAwake(true);
      setMessage('Mochi mendengarkan... (Sebut nama habit)');
    };
    
    rec.onresult = async (event) => {
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);

      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      
      setMessage(`Mendengarkan: "${transcript}"...`);

      // 1.8 seconds of silence to finalize
      silenceTimeoutRef.current = setTimeout(async () => {
        rec.stop();
        setIsListening(false);
        setMessage(`Memproses: "${transcript}"...`);
        try {
          const aiResponse = await parseVoiceCommand(transcript, habitsRef.current);
          setMessage(aiResponse.response);
          if (aiResponse.action === 'complete' && aiResponse.habitId && onCompleteRef.current) {
            onCompleteRef.current(aiResponse.habitId);
          }
        } catch (err) {
          console.error("Error parsing voice command:", err);
          setMessage("Mochi bingung. Coba ulangi lagi ya! 🐾");
        }
        setTimeout(() => {
          setIsAwake(false);
          setMessage('');
        }, 5000);
      }, 1800);
    };

    rec.onerror = (e) => {
      console.warn('Speech recognition error:', e);
      setIsListening(false);
      setMessage("Mochi tidak mendengar apa-apa. Coba lagi ya!");
      setTimeout(() => {
        setIsAwake(false);
        setMessage('');
      }, 3000);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    setRecognition(rec);

    return () => {
      rec.abort();
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    };
  }, []);

  // Random idle thoughts
  useEffect(() => {
    if (isAwake || isListening) return;
    
    const interval = setInterval(() => {
      if (Math.random() < 0.35) {
        const msg = idleMessages[Math.floor(Math.random() * idleMessages.length)];
        setMessage(msg);
        setTimeout(() => setMessage(''), 4500);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [isAwake, isListening]);

  const handleInteraction = () => {
    if (isListening) return;
    setIsAwake(true);
    const msg = awakeMessages[Math.floor(Math.random() * awakeMessages.length)];
    setMessage(msg);
    setTimeout(() => {
      setIsAwake(false);
      setMessage('');
    }, 6000);
  };

  const toggleMic = (e) => {
    e.stopPropagation();
    if (!recognition) {
      setIsAwake(true);
      setMessage('Browser ini tidak mendukung Voice Command. Gunakan Chrome/Edge.');
      setTimeout(() => {
        setIsAwake(false);
        setMessage('');
      }, 4000);
      return;
    }
    
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      left: '1.5rem',
      zIndex: 50,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '0.8rem',
      pointerEvents: 'none'
    }}>
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            style={{
              background: 'var(--card-bg)',
              padding: '0.6rem 1rem',
              borderRadius: '16px 16px 16px 4px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-md)',
              fontSize: '0.82rem',
              color: 'var(--text-primary)',
              fontWeight: 600,
              maxWidth: '220px',
              pointerEvents: 'auto',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)'
            }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', pointerEvents: 'auto' }}>
        <motion.div
          onClick={handleInteraction}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={
            isAwake 
              ? { y: [0, -10, 0], transition: { duration: 0.5, ease: "easeOut" } } 
              : { y: [0, -4, 0], transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" } }
          }
          style={{
            width: '52px', height: '52px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.02) 100%)',
            backgroundColor: 'var(--card-bg)',
            backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            border: isListening ? '2px solid #e74c3c' : '1.5px solid var(--border-color)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.8rem',
            boxShadow: isListening ? '0 0 15px rgba(231, 76, 60, 0.4)' : 'var(--shadow-sm)',
            cursor: 'pointer', userSelect: 'none',
            filter: isAwake ? 'drop-shadow(0 0 12px rgba(192, 154, 118, 0.4))' : 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
          }}
        >
          <div style={{ position: 'relative', display: 'flex' }}>
            {!isAwake && !isHovered && (
              <motion.div
                animate={{ opacity: [0, 1, 0], y: [-5, -20], x: [0, 8, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{
                  position: 'absolute', top: '-15px', right: '-12px',
                  fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-secondary)'
                }}
              >
                z
              </motion.div>
            )}
            {isAwake ? '😻' : (isHovered ? '😸' : '🐱')}
          </div>
        </motion.div>

        {/* Microphone Button */}
        <motion.button
          onClick={toggleMic}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            width: '38px', height: '38px', borderRadius: '50%',
            background: isListening ? '#e74c3c' : 'var(--card-bg)',
            border: '1.5px solid var(--border-color)',
            color: isListening ? '#fff' : 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', boxShadow: 'var(--shadow-sm)',
            backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            transition: 'background-color 0.3s, color 0.3s'
          }}
          title="Ngobrol sama Mochi"
        >
          {isListening ? <Mic size={16} /> : <MicOff size={16} />}
        </motion.button>
      </div>
    </div>
  );
};
