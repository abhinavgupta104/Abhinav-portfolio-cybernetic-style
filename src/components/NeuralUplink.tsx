import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Activity } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { useCyberSounds } from '@/hooks/use-cyber-sounds';
import { toast } from 'sonner';

const NeuralUplink = () => {
  const { isListening, transcript, startListening, stopListening, isSupported, error } = useSpeechRecognition();
  const { playClick, playType } = useCyberSounds();
  const [commandStatus, setCommandStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  // Error handling
  useEffect(() => {
    if (error) {
      let errorMessage = 'An unknown error occurred.';
      if (error === 'not-allowed' || error === 'service-not-allowed') {
        errorMessage = 'Microphone access denied. Please enable it in your browser settings.';
      } else if (error === 'no-speech') {
        // Ignore no-speech error as it often happens on timeout
        return;
      }
      toast.error(`Uplink Failed: ${errorMessage}`);
    }
  }, [error]);

  const findCommandMatch = useCallback((cmd: string) => {
    if (cmd.includes('home') || cmd.includes('top') || cmd.includes('start')) return 'home';
    if (cmd.includes('about') || cmd.includes('story') || cmd.includes('skills') || cmd.includes('bio')) return 'about';
    if (cmd.includes('project') || cmd.includes('work') || cmd.includes('portfolio') || cmd.includes('build')) return 'projects';
    if (cmd.includes('contact') || cmd.includes('footer') || cmd.includes('email') || cmd.includes('social') || cmd.includes('hire')) return 'contact';
    
    if (cmd.includes('dark') || cmd.includes('night')) return 'dark';
    if (cmd.includes('light') || cmd.includes('day') || cmd.includes('white')) return 'light';
    if (cmd.includes('matrix') || cmd.includes('hack') || cmd.includes('terminal')) return 'matrix';
    if (cmd.includes('secret') || cmd.includes('hidden') || cmd.includes('game')) return 'secret';
    if (cmd.includes('simple') || cmd.includes('clean') || cmd.includes('minimal')) return 'simple';

    if (cmd.includes('destruct') || cmd.includes('destroy') || cmd.includes('crash')) return 'destruct';
    if (cmd.includes('command') || cmd.includes('menu') || cmd.includes('help') || cmd.includes('search')) return 'menu';
    
    return null;
  }, []);

  const executeCommand = useCallback((type: string) => {
    setCommandStatus('processing');

    if (type === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
    else if (type === 'about') document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    else if (type === 'projects') document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    else if (type === 'contact') document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    
    else if (type === 'dark') window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: 'dark' } }));
    else if (type === 'light') window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: 'light' } }));
    else if (type === 'matrix') window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: 'matrix' } }));
    else if (type === 'secret') window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: 'secret' } }));
    else if (type === 'simple') window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: 'simple' } }));

    else if (type === 'destruct') window.dispatchEvent(new Event('trigger-self-destruct'));
    else if (type === 'menu') window.dispatchEvent(new CustomEvent('open-command-menu'));

    playClick();
    setCommandStatus('success');
    toast.success(`Command Executed: ${type.toUpperCase()}`);
    setTimeout(() => setCommandStatus('idle'), 2000);
  }, [playClick]);

  // Real-time processing: Check for commands while listening
  useEffect(() => {
    if (isListening && transcript) {
      const cmd = transcript.toLowerCase();
      const match = findCommandMatch(cmd);
      if (match) {
        executeCommand(match);
        stopListening();
      }
    }
  }, [isListening, transcript, findCommandMatch, executeCommand, stopListening]);

  // Fallback: Check for unknown commands when listening stops
  useEffect(() => {
    if (!isListening && transcript) {
      const cmd = transcript.toLowerCase();
      const match = findCommandMatch(cmd);
      
      // Only show error if we didn't match anything (and thus didn't execute/stop early)
      if (!match && cmd.trim().length > 0) {
        setCommandStatus('error');
        toast.error(`Unknown Protocol: "${cmd}"`);
        setTimeout(() => setCommandStatus('idle'), 2000);
      }
    }
  }, [isListening, transcript, findCommandMatch]);

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
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          if (isListening) stopListening();
          else {
            startListening();
            playType();
          }
        }}
        className="relative w-24 h-24 flex items-center justify-center group outline-none"
      >
        {/* 1. Ambient Background Glow */}
        <div className={`absolute inset-0 rounded-full blur-2xl transition-all duration-500 ${
            isListening ? 'bg-neon-cyan/30 scale-100' : error ? 'bg-destructive/20 scale-100' : 'bg-neon-purple/10 scale-50 group-hover:scale-100'
        }`} />

        {/* 2. Outer HUD Ring (Static/Slow) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground" />
            <path d="M 50 2 A 48 48 0 0 1 98 50" fill="none" stroke="currentColor" strokeWidth="1" className={isListening ? "text-neon-cyan" : "text-neon-purple"} strokeDasharray="4 4" />
            <path d="M 50 98 A 48 48 0 0 1 2 50" fill="none" stroke="currentColor" strokeWidth="1" className={isListening ? "text-neon-cyan" : "text-neon-purple"} strokeDasharray="4 4" />
        </svg>

        {/* 3. Rotating Data Ring */}
        <motion.div 
            className="absolute inset-2"
            animate={{ rotate: 360 }}
            transition={{ duration: isListening ? 4 : 20, repeat: Infinity, ease: "linear" }}
        >
            <svg className="w-full h-full" viewBox="0 0 100 100">
                <defs>
                    <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={isListening ? "#06b6d4" : "#a855f7"} stopOpacity="1" />
                        <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="42" fill="none" stroke="url(#ringGradient)" strokeWidth="1.5" strokeDasharray="60 100" strokeLinecap="round" />
                {/* Small ticks */}
                <circle cx="50" cy="50" r="38" fill="none" stroke={isListening ? "#06b6d4" : "#a855f7"} strokeWidth="4" strokeDasharray="1 10" opacity="0.3" />
            </svg>
        </motion.div>

        {/* 4. Counter-Rotating Inner Ring */}
        <motion.div 
            className="absolute inset-4"
            animate={{ rotate: -360 }}
            transition={{ duration: isListening ? 5 : 15, repeat: Infinity, ease: "linear" }}
        >
            <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="32" fill="none" stroke={isListening ? "#22c55e" : "#06b6d4"} strokeWidth="1" strokeDasharray="20 40" opacity="0.5" />
            </svg>
        </motion.div>

        {/* 5. Core Button */}
        <div className={`
            relative w-16 h-16 rounded-full backdrop-blur-xl flex items-center justify-center overflow-hidden transition-all duration-300 z-10
            border-2 
            ${isListening 
                ? 'border-neon-cyan bg-neon-cyan/10 shadow-[0_0_20px_rgba(6,182,212,0.4)]' 
                : error
                ? 'border-destructive bg-destructive/10 shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                : 'border-white/10 bg-black/80 hover:border-neon-cyan/50'
            }
        `}>
            {/* Core Pulse Animation */}
            <motion.div
                className={`absolute inset-0 ${isListening ? 'bg-neon-cyan' : error ? 'bg-destructive' : 'bg-neon-purple'}`}
                animate={{ opacity: isListening ? [0.1, 0.3, 0.1] : [0.05, 0.1, 0.05] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Scanning Grid Effect (Active) */}
            {isListening && (
                <motion.div 
                    className="absolute inset-0 bg-[linear-gradient(transparent_2px,_#06b6d4_2px)] bg-[length:100%_4px]"
                    animate={{ backgroundPosition: ["0px 0px", "0px 16px"] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    style={{ opacity: 0.3 }}
                />
            )}
            
            {/* Icon */}
            <div className={`relative z-20 transition-all duration-300 ${isListening ? 'scale-110 text-neon-cyan' : error ? 'text-destructive' : 'text-muted-foreground group-hover:text-neon-cyan'}`}>
                {getIcon()}
            </div>
        </div>

        {/* 6. Status Text/Label (Floating) */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
             <span className={`text-[10px] font-mono uppercase tracking-[0.2em] transition-colors duration-300 ${isListening ? 'text-neon-cyan animate-pulse' : 'text-muted-foreground/40'}`}>
                {isListening ? 'System Listening' : error ? 'Uplink Offline' : 'Voice Uplink'}
             </span>
        </div>
      </motion.button>
    </div>
  );
};

export default NeuralUplink;