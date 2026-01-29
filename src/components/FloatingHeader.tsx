import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Terminal, Gamepad2, Search, ZapOff, Music } from 'lucide-react';
import { useCyberSounds } from '@/hooks/use-cyber-sounds';
import { useBackgroundMusic } from '@/hooks/use-background-music';
import { toast } from "sonner";

const navItems = [
  { name: '// Home', href: '#' },
  { name: '// About', href: '#about' },
  { name: '// Work', href: '#projects' },
  { name: '// Contact', href: '#contact' },
  { name: '// Resume', href: '/resume.pdf' },
];

const FloatingHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light' | 'matrix' | 'secret' | 'simple'>('dark');
  const { playClick } = useCyberSounds();
  const { isPlaying, toggleMusic, volume, setVolume } = useBackgroundMusic();

  // Listen for theme changes from other components (like Terminal)
  useEffect(() => {
    const handleThemeChange = (e: CustomEvent) => {
      if (e.detail?.theme) {
        setTheme(e.detail.theme);
        if (e.detail.theme === 'secret') {
          playClick();
          toast.success("SYSTEM OVERRIDE: Secret Theme Unlocked");
        }
      }
    };
    window.addEventListener('theme-change' as any, handleThemeChange);
    return () => window.removeEventListener('theme-change' as any, handleThemeChange);
  }, [playClick]);

  // Konami Code Easter Egg
  useEffect(() => {
    const konamiCode = ['s', 'e', 'c', 'r', 'e', 't'];
    let cursor = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === konamiCode[cursor]) {
        cursor++;
        if (cursor === konamiCode.length) {
          window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: 'secret' } }));
          cursor = 0;
        }
      } else {
        cursor = (e.key.toLowerCase() === konamiCode[0]) ? 1 : 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playClick]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | 'matrix' | 'secret' | null;
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'matrix', 'secret', 'simple');
    
    if (theme === 'matrix') {
      root.classList.add('dark', 'matrix');
    } else if (theme === 'secret') {
      root.classList.add('dark', 'secret');
    } else if (theme === 'simple') {
      root.classList.add('light', 'simple');
    } else if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.add('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const cycleTheme = () => {
    const modes: ('dark' | 'light' | 'matrix' | 'simple')[] = ['dark', 'light', 'matrix', 'simple'];
    setTheme(current => {
      if (current === 'secret') return 'dark';
      return modes[(modes.indexOf(current as any) + 1) % modes.length];
    });
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) return;
    e.preventDefault();
    setMobileMenuOpen(false);
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
    {/* Dynamic Theme Styles */}
    {theme === 'light' && (
      <style>{`
        :root {
          --background: 0 0% 100%;
          --foreground: 240 10% 3.9%;
          --card: 0 0% 100%;
          --card-foreground: 240 10% 3.9%;
          --popover: 0 0% 100%;
          --popover-foreground: 240 10% 3.9%;
          --primary: 240 5.9% 10%;
          --primary-foreground: 0 0% 98%;
          --secondary: 240 4.8% 95.9%;
          --secondary-foreground: 240 5.9% 10%;
          --muted: 240 4.8% 95.9%;
          --muted-foreground: 240 3.8% 46.1%;
          --accent: 240 4.8% 95.9%;
          --accent-foreground: 240 5.9% 10%;
          --destructive: 0 84.2% 60.2%;
          --destructive-foreground: 0 0% 98%;
          --border: 240 5.9% 90%;
          --input: 240 5.9% 90%;
          --ring: 240 10% 3.9%;
        }
      `}</style>
    )}
    {theme === 'matrix' && (
      <style>{`
        :root {
          --background: 0 0% 0%;
          --foreground: 120 100% 50%;
          --primary: 120 100% 50%;
          --muted-foreground: 120 80% 40%;
          --border: 120 50% 20%;
        }
        .matrix body {
          font-family: 'Courier New', monospace;
        }
      `}</style>
    )}
    {theme === 'secret' && (
      <style>{`
        :root {
          --background: 260 50% 5%;
          --foreground: 320 100% 60%;
          --primary: 320 100% 60%;
          --muted-foreground: 280 50% 60%;
          --border: 320 50% 20%;
          --neon-cyan: 320 100% 60%;
          --neon-purple: 50 100% 60%;
          --neon-green: 190 100% 60%;
        }
        .secret body {
          font-family: 'Courier New', monospace;
          background-image: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          background-size: 100% 2px, 3px 100%;
        }
      `}</style>
    )}
    {theme === 'simple' && (
      <style>{`
        :root {
          --background: 0 0% 100%;
          --foreground: 0 0% 10%;
          --card: 0 0% 100%;
          --card-foreground: 0 0% 10%;
          --primary: 0 0% 0%;
          --primary-foreground: 0 0% 100%;
          --muted: 0 0% 96%;
          --muted-foreground: 0 0% 40%;
          --border: 0 0% 90%;
          --neon-cyan: 220 100% 40%;
          --neon-purple: 270 100% 40%;
          --neon-green: 142 76% 36%;
        }
        .simple body {
          font-family: system-ui, -apple-system, sans-serif;
          background-image: none;
        }
        .simple * {
          animation: none !important;
          transition: none !important;
          text-shadow: none !important;
        }
        .simple .cyber-grid,
        .simple canvas,
        .simple .hero-image-mask {
          display: none !important;
        }
        .simple .project-card {
          transform: none !important;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
          border: 1px solid #e5e7eb !important;
        }
      `}</style>
    )}

    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-4 bg-background/80 backdrop-blur-md border-b border-border' : 'py-6 bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <a 
          href="#" 
          onClick={(e) => scrollToSection(e, '#')}
          className="font-display font-bold text-xl tracking-tighter text-foreground group"
        >
          <span className="text-neon-cyan group-hover:text-neon-purple transition-colors">AG</span>
          <span className="text-neon-purple group-hover:text-neon-cyan transition-colors">.DEV</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => scrollToSection(e, item.href)}
              target={item.href.startsWith('#') ? undefined : "_blank"}
              rel={item.href.startsWith('#') ? undefined : "noopener noreferrer"}
              className="text-sm font-mono text-muted-foreground hover:text-neon-cyan transition-colors"
            >
              {item.name}
            </a>
          ))}
          
          {/* Command Menu Trigger */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-command-menu'))}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-foreground group"
            aria-label="Open Command Menu"
          >
            <Search className="w-5 h-5 group-hover:text-neon-cyan transition-colors" />
          </button>

          {/* Music Control */}
          <div className="flex items-center gap-2 group/music">
            <AnimatePresence>
              {isPlaying && (
                <motion.input
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 80, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-neon-cyan"
                />
              )}
            </AnimatePresence>
            <button
              onClick={() => {
                toggleMusic();
                playClick();
              }}
              className={`p-2 rounded-full hover:bg-white/10 transition-colors ${isPlaying ? 'text-neon-cyan animate-pulse' : 'text-foreground'}`}
              aria-label="Toggle Music"
            >
              <Music className="w-5 h-5" />
            </button>
          </div>

          {/* Theme Toggle */}
          <button 
            onClick={cycleTheme}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-foreground"
            aria-label="Toggle theme"
          >
            {theme === 'dark' && <Moon className="w-5 h-5" />}
            {theme === 'light' && <Sun className="w-5 h-5" />}
            {theme === 'matrix' && <Terminal className="w-5 h-5 text-neon-green" />}
            {theme === 'secret' && <Gamepad2 className="w-5 h-5 text-neon-purple" />}
            {theme === 'simple' && <ZapOff className="w-5 h-5 text-foreground" />}
          </button>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <button 
            onClick={() => {
              toggleMusic();
              playClick();
            }}
            className={`p-2 ${isPlaying ? 'text-neon-cyan' : 'text-foreground'}`}
          >
            <Music className="w-5 h-5" />
          </button>
          <button onClick={cycleTheme} className="text-foreground p-2">
             {theme === 'dark' && <Moon className="w-5 h-5" />}
             {theme === 'light' && <Sun className="w-5 h-5" />}
             {theme === 'matrix' && <Terminal className="w-5 h-5" />}
             {theme === 'secret' && <Gamepad2 className="w-5 h-5" />}
             {theme === 'simple' && <ZapOff className="w-5 h-5" />}
          </button>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('open-command-menu'))}
            className="text-foreground p-2"
          >
            <Search className="w-5 h-5" />
          </button>
          <button 
            className="text-foreground p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/80 backdrop-blur-xl border-b border-border overflow-hidden"
          >
            <nav className="flex flex-col p-6 gap-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  target={item.href.startsWith('#') ? undefined : "_blank"}
                  rel={item.href.startsWith('#') ? undefined : "noopener noreferrer"}
                  className="block text-lg font-mono text-muted-foreground hover:text-neon-cyan transition-colors py-2"
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
    </>
  );
};

export default FloatingHeader;