import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, MessageCircle, ArrowUp, Mail, Check } from 'lucide-react';
import MagneticButton from './MagneticButton';
import footerGlitch from '@/assets/footer-glitch.png';
import { useCyberSounds } from '@/hooks/use-cyber-sounds';

const socialLinks = [
  {
    id: 'github',
    icon: Github,
    label: 'GitHub',
    href: 'https://github.com/abhinavgupta104',
    variant: 'purple' as const
  },
  {
    id: 'linkedin',
    icon: Linkedin,
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/abhinav-gupta-9136aa382/',
    variant: 'cyan' as const
  },
  {
    id: 'whatsapp',
    icon: MessageCircle,
    label: 'WhatsApp',
    href: 'https://wa.me/917800966576',
    variant: 'green' as const
  }
];

const Typewriter = ({ text, start, onComplete, onType }: { text: string; start: boolean; onComplete?: () => void; onType?: () => void }) => {
  const [display, setDisplay] = useState('');
  const [completed, setCompleted] = useState(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!start) {
      setDisplay('');
      setCompleted(false);
      return;
    }
    if (completed) return;

    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplay(text.substring(0, i + 1));
        onType?.();
        i++;
      } else {
        clearInterval(timer);
        setCompleted(true);
        onCompleteRef.current?.();
      }
    }, 30);

    return () => clearInterval(timer);
  }, [start, text, completed]);

  return <span>{display}</span>;
};

const TerminalFooter = () => {
  const currentYear = new Date().getFullYear();
  const [time, setTime] = useState(new Date());
  const [sequenceStep, setSequenceStep] = useState(0);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{cmd: string, output: string}[]>([]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const { playType, playClick } = useCyberSounds();

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = input.trim().toLowerCase();
      let output = '';
      
      if (cmd === 'help') output = 'Available commands: help, clear, about, projects, home, secret, destruct';
      else if (cmd === 'clear') { setHistory([]); setInput(''); return; }
      else if (cmd === 'about') { document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); output = 'Navigating to /about...'; }
      else if (cmd === 'projects') { document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); output = 'Navigating to /projects...'; }
      else if (cmd === 'home') { window.scrollTo({ top: 0, behavior: 'smooth' }); output = 'Navigating to /home...'; }
      else if (cmd === 'secret') { 
        window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: 'secret' } }));
        output = 'Executing Override Protocol...'; 
      }
      else if (cmd === 'destruct') {
        window.dispatchEvent(new Event('trigger-self-destruct'));
        output = 'WARNING: SELF DESTRUCT SEQUENCE INITIATED...';
      }
      else if (cmd !== '') output = `Command not found: ${cmd}. Try 'help'.`;

      if (cmd) {
        setHistory(prev => [...prev, { cmd: input, output }]);
        setCmdHistory(prev => [...prev, input]);
        setHistoryIndex(-1);
      }
      setInput('');
      playClick();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const newIndex = historyIndex === -1 ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(cmdHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= cmdHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(cmdHistory[newIndex]);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const commands = ['help', 'clear', 'about', 'projects', 'home'];
      const match = commands.find(c => c.startsWith(input.toLowerCase()));
      if (match) setInput(match);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => 
    date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyEmail = async () => {
    const email = 'ashagupta3232@gmail.com';
    
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      } catch (err) {
        console.error('Clipboard API failed, trying fallback:', err);
      }
    }

    // Fallback for older browsers or non-secure contexts
    try {
      const textArea = document.createElement("textarea");
      textArea.value = email;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Fallback copy failed:', err);
    }
  };

  return (
    <footer className="relative py-20 md:py-32 overflow-hidden" id="contact">
      {/* Background image overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none select-none"
        style={{ backgroundImage: `url(${footerGlitch})` }}
      />
      
      {/* Terminal container */}
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
        onViewportEnter={() => setSequenceStep(1)} 
          onViewportLeave={() => setSequenceStep(0)}
          transition={{ duration: 0.8 }}
          className="terminal-container rounded-xl p-4 md:p-12 max-w-4xl mx-auto"
        >
          {/* Terminal header */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <div className="w-3 h-3 rounded-full bg-neon-cyan" />
            <div className="w-3 h-3 rounded-full bg-neon-green" />
            <span className="ml-4 font-mono text-sm text-muted-foreground">
              abhinav@portfolio <span className="text-neon-purple">[{formatTime(time)}]</span> ~ %
            </span>
          </div>

          {/* Terminal content */}
          <div className="space-y-6">
            <div className="font-mono text-sm md:text-base min-h-[24px]">
              <span className="text-neon-green">$</span>
              <span className="text-muted-foreground ml-2">
                <Typewriter 
                  text="cat about_me.txt" 
                  start={sequenceStep >= 1}
                  onComplete={() => setSequenceStep(prev => prev === 1 ? 2 : prev)}
                  onType={playType}
                />
              </span>
            </div>
            
            {sequenceStep >= 2 && (
              <div className="font-mono text-sm md:text-base text-foreground leading-relaxed whitespace-pre-line">
                <Typewriter 
                  text={"Building the future, one line of code at a time.\nOpen to opportunities and collaborations."}
                  start={sequenceStep >= 2}
                  onComplete={() => setTimeout(() => setSequenceStep(3), 800)}
                  onType={playType}
                />
              </div>
            )}

            {sequenceStep >= 3 && (
              <div className="font-mono text-sm md:text-base min-h-[24px]">
                <span className="text-neon-green">$</span>
                <span className="text-muted-foreground ml-2">
                  <Typewriter 
                    text="connect --social" 
                    start={sequenceStep >= 3}
                    onComplete={() => setSequenceStep(prev => prev === 3 ? 4 : prev)}
                    onType={playType}
                  />
                </span>
              </div>
            )}

            {/* Magnetic buttons */}
            {sequenceStep >= 4 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-wrap gap-4 pt-4"
              >
              {socialLinks.map((link) => (
                <MagneticButton 
                  key={link.id}
                  href={link.href} 
                  variant={link.variant}
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </MagneticButton>
              ))}
                <MagneticButton
                  variant="purple"
                  onClick={handleCopyEmail}
                >
                  {copied ? <Check className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                  <span>{copied ? 'Copied!' : 'Copy Email'}</span>
                </MagneticButton>
              </motion.div>
            )}

            {/* Interactive Terminal Input */}
            <div className="font-mono text-sm md:text-base mt-8 space-y-2">
              {history.map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex gap-2">
                    <span className="text-neon-green">$</span>
                    <span className="text-foreground">{item.cmd}</span>
                  </div>
                  {item.output && <div className="text-muted-foreground ml-4">{item.output}</div>}
                </div>
              ))}
              
              <div className="flex items-center gap-2" onClick={() => inputRef.current?.focus()}>
                <span className="text-neon-green">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleCommand}
                  className="bg-transparent border-none outline-none text-foreground flex-1 font-mono p-0 focus:ring-0"
                  placeholder="Type 'help'..."
                  autoComplete="off"
                />
              </div>
            </div>

            {/* System Status Bar */}
            <div className="mt-8 pt-4 border-t border-white/10 flex justify-between text-xs font-mono text-muted-foreground/50 select-none">
              <span>CPU: 12%</span>
              <span>MEM: 40%</span>
              <span className="text-neon-green">SYSTEM: ONLINE</span>
            </div>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-12 flex flex-col items-center gap-6"
        >
          {/* Scroll to Top Command */}
          <button 
            onClick={scrollToTop}
            className="group flex items-center gap-2 font-mono text-xs text-neon-cyan hover:text-neon-purple transition-colors"
          >
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
            <span>cd /top</span>
          </button>

          <p className="font-mono text-xs text-muted-foreground">
            © {currentYear} Abhinav Gupta. Crafted with passion and code.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default TerminalFooter;
