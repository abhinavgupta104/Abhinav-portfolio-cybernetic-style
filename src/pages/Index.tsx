import { useState, useEffect } from 'react';
import { useScroll, useSpring, motion, AnimatePresence } from 'framer-motion';
import SpotlightCursor from '@/components/SpotlightCursor';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ProjectsSection from '@/components/ProjectsSection';
import TerminalFooter from '@/components/TerminalFooter';
import FloatingHeader from '@/components/FloatingHeader';
import MatrixRain from '@/components/MatrixRain';
import CyberPreloader from '@/components/CyberPreloader';
import { CommandMenu } from '@/components/CommandMenu';
import { useTitleGlitch } from '@/hooks/use-title-glitch';
import HackerTyper from '@/components/HackerTyper';
import SystemCrash from '@/components/SystemCrash';
import NeuralUplink from '@/components/NeuralUplink';
import CyberAssistant from '@/components/CyberAssistant';

const Index = () => {
  const [loading, setLoading] = useState(true);
  useTitleGlitch("SYSTEM PAUSED // ⚠️");
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    console.log(
      "%c SYSTEM BREACH DETECTED %c \n\nWelcome to the console, fellow developer. \nLooking for bugs? Or just curious? \n\nType 'help()' to see available commands.",
      "color: #00f3ff; font-size: 20px; font-weight: bold; background: #000; padding: 10px; border-radius: 5px;",
      "color: #bd00ff; font-size: 14px;"
    );
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <AnimatePresence>
        {loading && <CyberPreloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <CommandMenu />
      <HackerTyper />
      <SystemCrash />
      <NeuralUplink />
      <CyberAssistant />
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-neon-cyan origin-left z-[60]"
        style={{ scaleX }}
      />
      <MatrixRain />
      <FloatingHeader />
      <SpotlightCursor />
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <TerminalFooter />
    </div>
  );
};

export default Index;
