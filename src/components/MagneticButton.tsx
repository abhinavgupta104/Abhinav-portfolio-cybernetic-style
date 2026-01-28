import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useCyberSounds } from '@/hooks/use-cyber-sounds';

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant: 'purple' | 'cyan' | 'green';
  className?: string;
}

const MagneticButton = ({ children, href, onClick, variant, className = '' }: MagneticButtonProps) => {
  const buttonRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
  const { playHover, playClick } = useCyberSounds();

  const variantStyles = {
    purple: {
      border: 'border-neon-purple',
      text: 'text-neon-purple',
      glow: 'hsl(289 100% 50%)',
      shadow: '0 0 30px hsl(289 100% 50% / 0.5)',
    },
    cyan: {
      border: 'border-neon-cyan',
      text: 'text-neon-cyan',
      glow: 'hsl(185 100% 50%)',
      shadow: '0 0 30px hsl(185 100% 50% / 0.5)',
    },
    green: {
      border: 'border-neon-green',
      text: 'text-neon-green',
      glow: 'hsl(151 100% 50%)',
      shadow: '0 0 30px hsl(151 100% 50% / 0.5)',
    },
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * 0.3;
    const deltaY = (e.clientY - centerY) * 0.3;

    setPosition({ x: deltaX, y: deltaY });

    // Update glow position
    const glowX = ((e.clientX - rect.left) / rect.width) * 100;
    const glowY = ((e.clientY - rect.top) / rect.height) * 100;
    setGlowPosition({ x: glowX, y: glowY });
    playHover();
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setGlowPosition({ x: 50, y: 50 });
  };

  const styles = variantStyles[variant];
  const Component = href ? motion.a : motion.button;

  return (
    <Component
      ref={buttonRef as any}
      href={href}
      onClick={() => {
        onClick?.();
        playClick();
      }}
      {...(href ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`relative overflow-hidden px-8 py-4 border-2 rounded-lg font-mono text-sm uppercase tracking-wider ${styles.border} ${styles.text} ${className}`}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ boxShadow: styles.shadow }}
      style={{
        background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, ${styles.glow}20 0%, transparent 50%)`,
      }}
    >
      <span className="relative z-10 flex items-center gap-3">
        {children}
      </span>
    </Component>
  );
};

export default MagneticButton;
