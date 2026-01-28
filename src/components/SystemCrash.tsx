import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useCyberSounds } from '@/hooks/use-cyber-sounds';

const SystemCrash = () => {
  const [isCrashed, setIsCrashed] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const { playAlarm, playType } = useCyberSounds();

  useEffect(() => {
    const handleDestruct = () => {
      setCountdown(5);
    };

    window.addEventListener('trigger-self-destruct', handleDestruct);
    return () => window.removeEventListener('trigger-self-destruct', handleDestruct);
  }, []);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      playAlarm();
      
      // Add random glitch sounds
      const noise = setInterval(() => {
        if (Math.random() > 0.5) playType();
      }, 100);

      const timer = setTimeout(() => setCountdown(prev => (prev !== null ? prev - 1 : null)), 1000);
      return () => { clearTimeout(timer); clearInterval(noise); };
    } else {
      setIsCrashed(true);
    }
  }, [countdown, playAlarm, playType]);

  const handleReboot = () => {
    window.location.reload();
  };

  return (
    <AnimatePresence>
      {(countdown !== null || isCrashed) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            x: !isCrashed ? [-20, 20, -10, 10, -30, 30, 0] : 0,
            y: !isCrashed ? [-10, 10, -5, 5, -20, 20, 0] : 0,
            filter: !isCrashed ? [
              "hue-rotate(0deg) contrast(100%)", 
              "hue-rotate(90deg) contrast(200%) invert(20%)", 
              "hue-rotate(0deg) contrast(100%)",
              "hue-rotate(-90deg) contrast(150%) blur(2px)",
              "hue-rotate(0deg) contrast(100%)"
            ] : "none",
            skewX: !isCrashed ? [0, 20, -20, 10, -10, 0] : 0,
          }}
          transition={{
            opacity: { duration: 0.2 },
            default: { repeat: !isCrashed ? Infinity : 0, duration: 0.15 }
          }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] bg-black font-mono flex flex-col items-center justify-center text-red-500 p-8 overflow-hidden"
        >
          {!isCrashed ? (
            <div className="text-center space-y-8 relative z-10">
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              >
                <AlertTriangle className="w-32 h-32 mx-auto text-red-600" />
              </motion.div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
                SELF DESTRUCT INITIATED
              </h1>
              <div className="text-9xl font-bold tabular-nums text-red-600">
                {countdown}
              </div>
              <p className="text-xl animate-pulse text-red-400">
                WARNING: SYSTEM INTEGRITY CRITICAL
              </p>
            </div>
          ) : (
            <div className="w-full max-w-4xl space-y-6 text-left font-mono text-sm md:text-base relative z-10">
              <div className="text-xl mb-8 bg-red-600 text-black p-2 inline-block font-bold">
                FATAL SYSTEM ERROR: 0xDEADBEEF
              </div>
              <div className="space-y-2 text-red-500/80">
                <p>{`> DETECTING_CRITICAL_FAILURE... [CONFIRMED]`}</p>
                <p>{`> KERNEL_PANIC_DETECTED_AT_ADDRESS_0x00000000`}</p>
                <p>{`> INITIATING_EMERGENCY_SHUTDOWN... [FAILED]`}</p>
                <p>{`> MEMORY_DUMP_INITIATED... [100%]`}</p>
                <p>{`> SYSTEM_HALTED`}</p>
                <p className="mt-4">
                  A problem has been detected and the system has been shut down to prevent damage to your computer.
                </p>
                <p>
                  DRIVER_IRQL_NOT_LESS_OR_EQUAL
                </p>
                <p className="mt-4">
                  If this is the first time you've seen this stop error screen, restart your computer.
                </p>
              </div>
              
              <button 
                onClick={handleReboot}
                className="mt-12 group flex items-center gap-2 px-6 py-3 border border-red-500 hover:bg-red-500 hover:text-black transition-all uppercase tracking-widest text-sm"
              >
                <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                <span>// MANUAL_SYSTEM_REBOOT</span>
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SystemCrash;