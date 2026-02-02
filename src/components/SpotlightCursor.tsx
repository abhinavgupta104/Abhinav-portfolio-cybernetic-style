import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useCyberSounds } from '@/hooks/use-cyber-sounds';
import { useIsMobile } from '@/hooks/use-mobile';

const SpotlightCursor = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);
  const hoveredElementRef = useRef<HTMLElement | null>(null);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; tx: number; ty: number; color: string }[]>([]);
  const [hoveredRect, setHoveredRect] = useState<{ left: number; top: number; width: number; height: number } | null>(null);
  const { playHover } = useCyberSounds();
  const isMobile = useIsMobile();

  // Smooth spring for the large ambient glow
  const springConfigLarge = { damping: 30, stiffness: 300, mass: 0.5 };
  const largeX = useSpring(mouseX, springConfigLarge);
  const largeY = useSpring(mouseY, springConfigLarge);

  // Faster spring for the focused core
  const springConfigSmall = { damping: 20, stiffness: 1200, mass: 0.1 };
  const smallX = useSpring(mouseX, springConfigSmall);
  const smallY = useSpring(mouseY, springConfigSmall);

  // Center the cursor by offsetting by radius
  const largeXPos = useTransform(largeX, (x) => x - 400);
  const largeYPos = useTransform(largeY, (y) => y - 400);
  const smallXPos = useTransform(smallX, (x) => x - 100);
  const smallYPos = useTransform(smallY, (y) => y - 100);

  useEffect(() => {
    if (isHovering) {
      playHover();
    }
  }, [isHovering, playHover]);

  // Trail pruning for automatic fade
  useEffect(() => {
    const interval = setInterval(() => {
      setTrail(prev => {
        const now = Date.now();
        return prev.filter(p => now - p.id < 600);
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let lastTrailTime = 0;

    const updateMousePosition = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      
      let targetX = e.clientX;
      let targetY = e.clientY;

      // Strong Magnetic Effect - FIXED: Added null check
      if (hoveredElementRef.current && hoveredElementRef.current.getBoundingClientRect) {
        const rect = hoveredElementRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Pull strongly towards center (0.1 factor)
        targetX = centerX + (e.clientX - centerX) * 0.1;
        targetY = centerY + (e.clientY - centerY) * 0.1;
      }

      mouseX.set(targetX);
      mouseY.set(targetY);

      const now = Date.now();
      if (now - lastTrailTime > 25) {
        setTrail(prev => [{ x: targetX, y: targetY, id: now }, ...prev.slice(0, 29)]);
        lastTrailTime = now;
      }
    };

    const updateHoverState = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const clickable = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.closest('.cursor-pointer');
      
      // FIXED: Added proper type checking and null safety
      if (clickable && clickable instanceof HTMLElement) {
        setIsHovering(true);
        if (hoveredElementRef.current !== clickable) {
          hoveredElementRef.current = clickable;
          // FIXED: Added try-catch for getBoundingClientRect
          try {
            const rect = clickable.getBoundingClientRect();
            setHoveredRect({ left: rect.left, top: rect.top, width: rect.width, height: rect.height });
          } catch (error) {
            console.warn('Failed to get bounding rect:', error);
            setHoveredRect(null);
          }
        }
      } else {
        setIsHovering(false);
        hoveredElementRef.current = null;
        setHoveredRect(null);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', updateHoverState);
    
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', updateHoverState);
    };
  }, [mouseX, mouseY, isVisible]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const count = 8; // Number of particles per click
      const newParticles = [];
      const now = Date.now();
      
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = 30 + Math.random() * 50; // Random speed
        newParticles.push({
          id: now + i,
          x: e.clientX,
          y: e.clientY,
          tx: e.clientX + Math.cos(angle) * velocity,
          ty: e.clientY + Math.sin(angle) * velocity,
          color: isHovering ? 'hsl(var(--neon-purple))' : 'hsl(var(--neon-cyan))'
        });
      }

      setParticles(prev => [...prev, ...newParticles]);

      // Cleanup particles after animation
      setTimeout(() => {
        setParticles(prev => {
          const expirationThreshold = Date.now() - 1000;
          return prev.filter(p => p.id > expirationThreshold);
        });
      }, 1000);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [isHovering]);

  if (!isVisible || isMobile) return null;

  return (
    <>
      {/* Magnetic Ripple Effect */}
      <AnimatePresence>
        {isHovering && hoveredRect && (
          <motion.div
            key={`${hoveredRect.left}-${hoveredRect.top}`}
            initial={{ opacity: 0.5, scale: 1 }}
            animate={{ opacity: 0, scale: 1.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="pointer-events-none fixed z-40 rounded-lg border-2"
            style={{
              left: hoveredRect.left,
              top: hoveredRect.top,
              width: hoveredRect.width,
              height: hoveredRect.height,
              borderColor: 'hsl(var(--neon-purple))'
            }}
          />
        )}
      </AnimatePresence>

      {/* Click Particles */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: p.x, y: p.y, scale: 1, opacity: 1 }}
            animate={{ x: p.tx, y: p.ty, scale: 0, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="pointer-events-none fixed top-0 left-0 z-50 h-1.5 w-1.5 rounded-full shadow-[0_0_10px_currentColor]"
            style={{ backgroundColor: p.color }}
          />
        ))}
      </AnimatePresence>

      {/* Fading Trail Lines */}
      <svg className="pointer-events-none fixed inset-0 z-10 h-full w-full">
        <defs>
          <filter id="glow-line" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {trail.map((point, index) => {
          const nextPoint = trail[index + 1];
          if (!nextPoint) return null;

          const age = Date.now() - point.id;
          const opacity = Math.max(0, 1 - age / 600) * 0.6;

          return (
            <line
              key={point.id}
              x1={point.x}
              y1={point.y}
              x2={nextPoint.x}
              y2={nextPoint.y}
              stroke={isHovering ? 'hsl(var(--neon-purple))' : 'hsl(var(--neon-cyan))'}
              strokeWidth="3"
              strokeOpacity={opacity}
              strokeLinecap="round"
              filter="url(#glow-line)"
            />
          );
        })}
      </svg>

      {/* Large Ambient Glow */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-20 h-[800px] w-[800px] rounded-full"
        animate={{
          scale: isHovering ? 1.2 : 1,
        }}
        transition={{ duration: 0.3 }}
        style={{ 
          x: largeXPos, 
          y: largeYPos,
          background: isHovering 
            ? 'radial-gradient(circle, hsl(var(--neon-purple) / 0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, hsl(var(--neon-cyan) / 0.08) 0%, transparent 70%)',
          filter: 'blur(50px)'
        }}
      />
      
      {/* Focused Core Glow */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-30 h-[200px] w-[200px] rounded-full"
        animate={{
          scale: isHovering ? 1.35 : 1,
        }}
        transition={{ duration: 0.3 }}
        style={{ 
          x: smallXPos, 
          y: smallYPos,
          background: isHovering
            ? 'radial-gradient(circle, hsl(var(--neon-purple) / 0.3) 0%, transparent 70%)'
            : 'radial-gradient(circle, hsl(var(--neon-cyan) / 0.15) 0%, transparent 70%)',
          filter: 'blur(20px)'
        }}
      />
    </>
  );
};

export default SpotlightCursor;