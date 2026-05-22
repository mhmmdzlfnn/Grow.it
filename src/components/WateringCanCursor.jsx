import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export const WateringCanCursor = ({ active, isTilting, targetRect }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isTouch, setIsTouch] = useState(false);

  // Motion values for smooth trailing effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Spring configuration for cozy fluid movement
  const springConfig = { stiffness: 200, damping: 22, mass: 0.8 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    if (!active) {
      document.body.classList.remove('watering-mode-active');
      return;
    }

    document.body.classList.add('watering-mode-active');

    const handlePointerMove = (e) => {
      // Check if it's a touch device pointer
      if (e.pointerType === 'touch') {
        setIsTouch(true);
      } else {
        setIsTouch(false);
      }

      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.body.classList.remove('watering-mode-active');
    };
  }, [active]);

  // Update target coordinates using Framer Motion
  useEffect(() => {
    if (!active) return;

    if (isTilting && targetRect) {
      // Magnetic Docking: Lock to a perfect watering position relative to target plant card
      const dockX = targetRect.left + targetRect.width * 0.8;
      const dockY = targetRect.top - 20;
      x.set(dockX);
      y.set(dockY);
    } else {
      // Free following: Offset so the water spout aligns with pointer
      // Spout is top-left, so we place the can body to the right and slightly down
      x.set(mousePos.x - 15);
      y.set(mousePos.y - 35);
    }
  }, [mousePos, isTilting, targetRect, active, x, y]);

  if (!active) return null;

  return (
    <motion.div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        x: springX,
        y: springY,
        pointerEvents: 'none',
        zIndex: 9999,
        transformOrigin: '20% 30%', // Rotate around the spout/handle area
      }}
      animate={{
        rotate: isTilting ? -35 : 0,
        scale: isTilting ? 1.1 : 1,
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      <svg 
        width="80" 
        height="80" 
        viewBox="0 0 64 64" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: 'drop-shadow(0 6px 12px rgba(74, 64, 54, 0.25))',
          transform: 'scaleX(-1)' // Flip horizontally so spout faces left towards plant
        }}
      >
        {/* Cozy Watering Can SVG */}
        {/* Main Body */}
        <path 
          d="M18 42C18 32 24.5 24 34 24C43.5 24 50 32 50 42H18Z" 
          fill="var(--accent-brown)" 
          stroke="var(--text-primary)" 
          strokeWidth="3" 
          strokeLinejoin="round"
        />
        
        {/* Top Opening */}
        <ellipse 
          cx="34" 
          cy="24" 
          rx="8" 
          ry="3" 
          fill="#EAE3D9" 
          stroke="var(--text-primary)" 
          strokeWidth="2.5"
        />

        {/* Handle */}
        <path 
          d="M48 28C54 31 56 36 56 42" 
          stroke="var(--text-primary)" 
          strokeWidth="3.5" 
          strokeLinecap="round"
        />

        {/* Spout */}
        <path 
          d="M20 32L6 20L3 22.5L7 26.5L16 35" 
          fill="var(--accent-brown)" 
          stroke="var(--text-primary)" 
          strokeWidth="3" 
          strokeLinejoin="round"
        />

        {/* Rose (Sprinkler tip) */}
        <path 
          d="M1.5 17L5.5 22" 
          stroke="var(--text-primary)" 
          strokeWidth="4.5" 
          strokeLinecap="round"
        />

        {/* Highlight detail */}
        <path 
          d="M26 30C26 30 30 28 34 28" 
          stroke="rgba(255,255,255,0.4)" 
          strokeWidth="2" 
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
};
