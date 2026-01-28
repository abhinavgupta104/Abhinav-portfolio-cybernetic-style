import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CyberPreloader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState('INITIALIZING SYSTEM...');

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 20);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress === 30) setText('LOADING ASSETS...');
    if (progress === 60) setText('ESTABLISHING CONNECTION...');
    if (progress === 90) setText('ACCESS GRANTED');
    if (progress === 100) setTimeout(onComplete, 500);
  }, [progress, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center font-mono text-neon-cyan"
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
      transition={{ duration: 0.8 }}
    >
      <div className="w-64 space-y-4">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{text}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-neon-cyan shadow-[0_0_10px_#00f3ff]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default CyberPreloader;