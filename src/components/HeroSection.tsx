import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HackerText from './HackerText';
import WireframeGeometry from './WireframeGeometry';
import heroPortrait from '@/assets/hero-portrait.png';

const roles = ["Future AI Engineer", "Web Developer", "System Architect", "Data Analyst"];

const HeroSection = () => {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Grid */}
      <motion.div 
        className="absolute inset-0 cyber-grid"
        style={{ backgroundSize: '50px 50px' }}
        initial={{ opacity: 0.2, filter: "sepia(100%) hue-rotate(0deg) saturate(200%)" }}
        animate={{ 
          backgroundPosition: ["0px 0px", "50px 50px"],
          opacity: [0.2, 0.5, 0.2],
          filter: ["sepia(100%) hue-rotate(0deg) saturate(200%)", "sepia(100%) hue-rotate(180deg) saturate(200%)", "sepia(100%) hue-rotate(360deg) saturate(200%)"]
        }}
        transition={{ 
          backgroundPosition: {
            repeat: Infinity, 
            duration: 15, 
            ease: "linear" 
          },
          opacity: {
            repeat: Infinity,
            duration: 4,
            ease: "easeInOut"
          },
          filter: {
            repeat: Infinity,
            duration: 10,
            ease: "linear"
          }
        }}
      />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.p
                className="font-mono text-sm text-neon-cyan uppercase tracking-[0.3em]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                Welcome to my digital space
              </motion.p>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight text-foreground">
                <HackerText 
                  text="I don't stop when I'm tired," 
                  delay={1000}
                  className="block"
                />
                <HackerText 
                  text="I stop when I'm done." 
                  delay={3500}
                  className="block text-gradient-cyber"
                />
              </h1>
            </div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 3 }}
            >
              <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground">
                Abhinav Gupta
              </h2>
              <div className="h-6 overflow-hidden relative">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={roleIndex}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="font-mono text-muted-foreground absolute"
                  >
                    {roles[roleIndex]}.
                  </motion.p>
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 3.5 }}
            >
              <div className="h-px w-16 bg-gradient-to-r from-neon-cyan to-transparent" />
              <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                Scroll to explore
              </span>
            </motion.div>
          </motion.div>

          {/* Right - Photo + 3D */}
          <div className="relative h-[400px] md:h-[600px] lg:h-[700px] w-full mt-8 lg:mt-0">
            {/* 3D Wireframe Background */}
            <WireframeGeometry />
            
            {/* Hero Portrait */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center z-10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
            >
              <div className="relative">
                <img
                  src={heroPortrait}
                  alt="Abhinav Gupta"
                  className="w-[250px] md:w-[350px] lg:w-[400px] h-auto object-cover hero-image-mask"
                />
                {/* Glow effect behind image */}
                <div className="absolute inset-0 bg-gradient-to-b from-neon-cyan/20 to-transparent blur-3xl -z-10 transform scale-150" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer"
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ 
          opacity: { duration: 1, delay: 4 },
          y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <div className="w-6 h-10 border-2 border-neon-cyan/50 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-neon-cyan rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
