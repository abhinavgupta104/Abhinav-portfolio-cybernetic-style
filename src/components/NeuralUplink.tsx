import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Activity } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { useCyberSounds } from '@/hooks/use-cyber-sounds';
import { toast } from 'sonner';

const NeuralUplink = () => {
  const { isListening, transcript, startListening, stopListening, isSupported, error } = useSpeechRecognition();
  const { playClick, playType } = useCyberSounds();
  const [commandStatus, setCommandStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  // Command Processing Logic
  useEffect(() => {
    if (!isListening && transcript) {
      processCommand(transcript.toLowerCase());
    }
  }, [isListening, transcript]);

  // Error handling
  useEffect(() => {
    if (error) {
      let errorMessage = 'An unknown error occurred.';
      if (error === 'not-allowed' || error === 'service-not-allowed') {
        errorMessage = 'Microphone access denied. Please enable it in your browser settings.';
      } else if (error === 'no-speech') {
        errorMessage = 'No speech detected. Please try again.';
      }
      toast.error(`Uplink Failed: ${errorMessage}`);
    }
  }, [error]);

  const processCommand = (cmd: string) => {
    setCommandStatus('processing');
    let matched = false;

    // Navigation
    if (cmd.includes('home') || cmd.includes('top')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      matched = true;
    } else if (cmd.includes('about')) {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
      matched = true;
    } else if (cmd.includes('project') || cmd.includes('work')) {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
      matched = true;
    } else if (cmd.includes('contact') || cmd.includes('footer')) {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      matched = true;
    }
    
    // Themes
    else if (cmd.includes('dark mode')) {
      window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: 'dark' } }));
      matched = true;
    } else if (cmd.includes('light mode')) {
      window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: 'light' } }));
      matched = true;
    } else if (cmd.includes('matrix')) {
      window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: 'matrix' } }));
      matched = true;
    } else if (cmd.includes('secret')) {
      window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: 'secret' } }));
      matched = true;
    }

    // System
    else if (cmd.includes('destruct') || cmd.includes('destroy')) {
      window.dispatchEvent(new Event('trigger-self-destruct'));
      matched = true;
    } else if (cmd.includes('command') || cmd.includes('menu')) {
      window.dispatchEvent(new CustomEvent('open-command-menu'));
      matched = true;
    }

    if (matched) {
      setCommandStatus('success');
      playClick();
      toast.success(`Command Executed: "${cmd}"`);
    } else {
      setCommandStatus('error');
      toast.error(`Unknown Protocol: "${cmd}"`);
    }

    setTimeout(() => setCommandStatus('idle'), 2000);
  };

  if (!isSupported) return null;

  const getIcon = () => {
    if (error) return <MicOff className="w-6 h-6 text-destructive" />;
    if (isListening) return <Activity className="w-6 h-6 animate-pulse" />;
    return <Mic className="w-6 h-6" />;
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
      {/* Transcript Display */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-black/80 backdrop-blur-md border border-neon-cyan/30 px-4 py-2 rounded-lg text-neon-cyan font-mono text-sm"
          >
            {transcript || "Listening..."}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Activation Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          if (isListening) stopListening();
          else {
            startListening();
            playType();
          }
        }}
        className={`
          relative w-14 h-14 rounded-full flex items-center justify-center
          border-2 transition-all duration-300 shadow-lg backdrop-blur-sm
          ${isListening 
            ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan shadow-[0_0_30px_rgba(6,182,212,0.5)]' 
            : error
            ? 'bg-destructive/20 border-destructive text-destructive'
            : 'bg-black/50 border-white/10 text-muted-foreground hover:border-neon-cyan/50 hover:text-neon-cyan'
          }
        `}
      >
        {getIcon()}

        {/* Ripple Effect when listening */}
        {isListening && (
          <>
            <span className="absolute inset-0 rounded-full border border-neon-cyan/50 animate-ping" />
            <span className="absolute -inset-2 rounded-full border border-neon-cyan/20 animate-pulse" />
          </>
        )}
      </motion.button>

      {/* Label */}
      <div className="absolute -bottom-6 right-0 w-full text-center">
        <span className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest">
          Neural Uplink
        </span>
      </div>
    </div>
  );
};

export default NeuralUplink;