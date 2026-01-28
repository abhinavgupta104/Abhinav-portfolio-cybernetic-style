import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useCyberSounds } from '@/hooks/use-cyber-sounds';

const SOURCE_CODE = `import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// SYSTEM OVERRIDE PROTOCOL
// INITIATING KERNEL BYPASS...

const Matrix = () => {
  const [reality, setReality] = useState(false);
  
  useEffect(() => {
    const breach = async () => {
      await decrypt('AES-256');
      injectPayload(0xDEADBEEF);
    };
    breach();
  }, []);

  return (
    <div className="simulation">
      {reality ? <RedPill /> : <BluePill />}
    </div>
  );
};

function decrypt(algorithm) {
  return new Promise(resolve => {
    console.log(\`Decrypting using \${algorithm}...\`);
    setTimeout(resolve, 1000);
  });
}

// ACCESSING MAINFRAME DATA...
// DOWNLOADING SECURE FILES...
// [====================] 100%

class CyberDeck extends Hardware {
  constructor() {
    super();
    this.cpu = 'Neural Net Processor';
    this.ram = 'Infinite';
  }

  connect() {
    this.socket.open('wss://matrix.net');
  }
}

export default Matrix;
`.repeat(5);

const HackerTyper = () => {
  const [isActive, setIsActive] = useState(false);
  const [text, setText] = useState('');
  const indexRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { playType } = useCyberSounds();

  useEffect(() => {
    const handleToggle = () => setIsActive(prev => !prev);
    window.addEventListener('toggle-hacker-mode', handleToggle);
    return () => window.removeEventListener('toggle-hacker-mode', handleToggle);
  }, []);

  useEffect(() => {
    if (!isActive) {
      setText('');
      indexRef.current = 0;
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsActive(false);
        return;
      }
      
      e.preventDefault();
      playType();

      const charsToAdd = Math.floor(Math.random() * 4) + 2;
      const nextIndex = indexRef.current + charsToAdd;
      
      let chunk = SOURCE_CODE.substring(indexRef.current, nextIndex);
      if (nextIndex > SOURCE_CODE.length) {
        chunk += SOURCE_CODE.substring(0, nextIndex - SOURCE_CODE.length);
        indexRef.current = nextIndex - SOURCE_CODE.length;
      } else {
        indexRef.current = nextIndex;
      }
      
      setText(prev => prev + chunk);
      
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, playType]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black font-mono text-neon-green p-4 md:p-8 overflow-hidden cursor-text"
        >
          <div 
            ref={containerRef} 
            className="h-full w-full overflow-y-auto whitespace-pre-wrap break-all text-sm md:text-base leading-relaxed"
          >
            {text}
            <span className="animate-pulse inline-block w-3 h-5 bg-neon-green ml-1 align-middle"></span>
          </div>
          
          <button 
            onClick={() => setIsActive(false)}
            className="absolute top-4 right-4 text-neon-green/50 hover:text-neon-green transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="absolute bottom-4 right-4 text-xs text-neon-green/30 font-mono">
            PRESS ESC TO EXIT // TYPE TO HACK
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HackerTyper;