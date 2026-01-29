import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, Volume2, VolumeX } from 'lucide-react';
import { useCyberSounds } from '@/hooks/use-cyber-sounds';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

interface KnowledgeEntry {
  keywords: string[];
  response: string;
  action?: () => void;
  topic?: string;
}

type UserIntent = 'recruiter' | 'student' | 'judge' | 'curious';

const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  {
    keywords: ['explain project', 'recruiter', '20 seconds', 'elevator pitch', 'summary', 'pitch', 'quick run'],
    response: ">> ELEVATOR_PITCH_LOADED\n\nProject: XShootSMS\nStack: Next.js, Python, AWS\nImpact: Engineered B2B SaaS for high-throughput SMS. Optimized delivery latency by 30%. Scalable architecture handling peak loads.",
    topic: 'projects-pitch'
  },
  {
    keywords: ['who', 'name', 'developer', 'author', 'abhinav', 'creator', 'bio', 'version'],
    response: "I am the v3.0 digital avatar of Abhinav Gupta (21). He is a software engineer transitioning from high-precision Frontend to AI & Backend systems. He identifies as an 'Introverted Leader'—leading through architectural competence.",
    topic: 'bio'
  },
  {
    keywords: ['skill', 'stack', 'tech', 'technology', 'language', 'python', 'react', 'cpp', 'nextjs', 'dsa'],
    response: "The Technical Arsenal: Python (AI/ML), C++ (High-Performance), and React.js (Pixel-Perfect UI). He focuses on Data Structures & Algorithms for optimization and uses Gemini Pro for AI augmentation.",
    topic: 'skills'
  },
  {
    keywords: ['skills', 'all skills', 'list skills', 'capabilities', 'competencies'],
    response: ">> TECHNICAL_ARSENAL_LOADED\n\n[CORE]\n• C++ (System/Logic)\n• Python (AI/Data)\n• TypeScript (Web)\n\n[FRONTEND]\n• React / Next.js\n• Tailwind / Framer Motion\n• Three.js / R3F\n\n[DATA]\n• NumPy / Pandas\n• Matplotlib / Seaborn",
    topic: 'skills-detailed'
  },
  {
    keywords: ['project', 'work', 'portfolio', 'build', 'app', 'acmax'],
    response: "He ships production-grade apps: XShootSMS (B2B Telecom), HouseKeys (PropTech), and Hyperlink (Resource Hub). Currently developing a Cryptography Tool and Acmax.shop Data Core.",
    action: () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }),
    topic: 'projects'
  },
  {
    keywords: ['xshootsms', 'xshoot', 'x shoot', 'xshoot project', 'sms', 'telecom', 'b2b', 'messaging'],
    response: "XShootSMS is a B2B SaaS telecommunications platform. Abhinav engineered the aggregation logic for bulk SMS delivery and built the analytics dashboard. It integrates with major telecom gateways.",
    action: () => window.open('https://xshootsms.com', '_blank'),
    topic: 'xshootsms'
  },
  {
    keywords: ['housekeys', 'house keys', 'premier', 'properties', 'real', 'estate', 'proptech'],
    response: "HouseKeys is a luxury PropTech interface. As Frontend Architect, Abhinav built a 'High-Trust' responsive UI using Next.js to optimize lead generation in the real estate market.",
    action: () => window.open('https://housekeys-premier-properties.vercel.app', '_blank'),
    topic: 'housekeys'
  },
  {
    keywords: ['hyperlink', 'hyper link', 'resource', 'aggregator', 'hub'],
    response: "Hyperlink is a digital resource aggregator that organizes web utilities into a single hub. It is deployed on the Vercel Edge Network for low-latency global access.",
    action: () => window.open('https://hyperlink-eta.vercel.app', '_blank'),
    topic: 'hyperlink'
  },
  {
    keywords: ['leadership', 'philosophy', 'mindset', 'psychology', 'style', 'ethic'],
    response: "The Architect Philosophy: Abhinav listens, analyzes, and executes. He values 'elegant' code over 'working' code and prefers 'Dark/Cinematic' aesthetics reflecting depth over superficiality.",
    topic: 'philosophy'
  },
  {
    keywords: ['education', 'college', 'school', 'diploma', 'polytechnic'],
    response: "He is a Diploma student in Information Technology at Ghaziabad Polytechnic, distinguishing himself by combining academic discipline with the rigor of shipping real-world software.",
    topic: 'education'
  },
  {
    keywords: ['contact', 'email', 'reach', 'hire', 'whatsapp', 'linkedin', 'github'],
    response: "You can connect via the terminal footer, LinkedIn, or email at ashagupta3232@gmail.com. Taking you to the contact zone.",
    action: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  },
  {
    keywords: ['easter eggs', 'secrets', 'hidden features', 'tricks', 'hacks', 'konami', 'game'],
    response: "[HIDDEN_PROTOCOLS_DETECTED]\n1. Konami Code / Type 'secret' -> Secret Theme\n2. Terminal 'destruct' -> System Crash\n3. Command Palette -> Hacker Mode\n4. Idle System -> Auto-activates Assistant",
    topic: 'easter-eggs'
  },
  {
    keywords: ['unlock', 'activate', 'run', 'execute', 'act', 'secret', 'mode'],
    response: "Overriding system protocols... Secret Mode Unlocked.",
    action: () => window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: 'secret' } }))
  },
  {
    keywords: ['simple mode', 'minimal', 'clean', 'no effects'],
    response: "Simple Mode strips away all animations and heavy effects for a clean, reading-focused experience. You can toggle it from the Command Palette or the Header.",
    action: () => window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: 'simple' } })),
    topic: 'simple-mode'
  },
  {
    keywords: ['matrix', 'mode', 'rain'],
    response: "Entering the Matrix...",
    action: () => window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: 'matrix' } }))
  },
  {
    keywords: ['light', 'mode', 'white'],
    response: "Switching to Light Mode. Warning: It might be bright.",
    action: () => window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: 'light' } }))
  },
  {
    keywords: ['dark', 'mode', 'black'],
    response: "Reverting to standard Dark Mode.",
    action: () => window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: 'dark' } }))
  },
  {
    keywords: ['website', 'site', 'features', 'capabilities', 'overview', 'portfolio', 'what is this'],
    response: ">> SYSTEM_ANALYSIS\n\nThis is a Cybernetic Portfolio designed for immersion.\n\n[FEATURES]\n• Neural Uplink (Voice Control)\n• Command Palette (Cmd+K)\n• Terminal CLI Footer\n• 3D Holographic Cards\n• 5 Themes (Dark, Light, Matrix, Secret, Simple)\n• Audio-Reactive UI",
    topic: 'website-features'
  },
  {
    keywords: ['site stack', 'website tech', 'how it works', 'built with', 'architecture'],
    response: "[ARCHITECTURAL_BLUEPRINT]\n• Core: React 18, TypeScript, Vite\n• Style: Tailwind CSS, Shadcn UI\n• Motion: Framer Motion, R3F (Three.js)\n• Audio: Web Audio API\n• Input: Web Speech API",
    topic: 'website-stack'
  },
  {
    keywords: ['help', 'assist', 'commands', 'menu'],
    response: "I can help you navigate, change themes, or answer questions. Opening the Command Menu now.",
    action: () => window.dispatchEvent(new CustomEvent('open-command-menu'))
  },
  {
    keywords: ['destruct', 'destroy', 'crash'],
    response: "WARNING: Initiating Self-Destruct sequence...",
    action: () => window.dispatchEvent(new Event('trigger-self-destruct'))
  },
  {
    keywords: ['home', 'top', 'start'],
    response: "Navigating to the top.",
    action: () => window.scrollTo({ top: 0, behavior: 'smooth' })
  },
  {
    keywords: ['about', 'bio', 'story'],
    response: "Scrolling to the About section.",
    action: () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
  },
  {
    keywords: ['hello', 'hi', 'hey', 'greetings'],
    response: "System Online. Greetings. How can I assist you in navigating Abhinav's digital space?"
  }
];

const detectIntent = (input: string): UserIntent => {
  const lower = input.toLowerCase();
  if (lower.includes('hir') || lower.includes('recruit') || lower.includes('job') || lower.includes('offer') || lower.includes('salary') || lower.includes('business')) return 'recruiter';
  if (lower.includes('learn') || lower.includes('study') || lower.includes('student') || lower.includes('begin') || lower.includes('how to') || lower.includes('guide')) return 'student';
  if (lower.includes('judge') || lower.includes('rate') || lower.includes('eval') || lower.includes('critique') || lower.includes('code') || lower.includes('arch') || lower.includes('review')) return 'judge';
  return 'curious';
};

const processQuery = (input: string, currentContext?: string, userName?: string | null): { text: string; action?: () => void; newContext?: string; intent: UserIntent; confidence: number; newUserName?: string } => {
  const lowerInput = input.toLowerCase();
  const intent = detectIntent(lowerInput);
  
  // Name detection
  const namePatterns = [
    /my name is ([a-zA-Z\s]+)/i,
    /call me ([a-zA-Z\s]+)/i,
    /^i am ([a-zA-Z\s]+)/i,
    /^im ([a-zA-Z\s]+)/i
  ];

  for (const pattern of namePatterns) {
    const match = input.match(pattern);
    if (match && match[1]) {
        const potentialName = match[1].trim();
        const commonRoles = ['recruiter', 'student', 'judge', 'developer', 'visitor', 'user', 'human', 'hiring', 'looking'];
        if (!commonRoles.includes(potentialName.toLowerCase()) && potentialName.split(' ').length <= 3 && potentialName.length < 20) {
             return {
                text: `>> IDENTITY_VERIFIED\n\nNice to meet you, ${potentialName}. I have updated my session parameters.`,
                intent: 'curious',
                confidence: 1.0,
                newUserName: potentialName
            };
        }
    }
  }

  if (lowerInput.includes('what is my name') || lowerInput.includes('who am i') || lowerInput.includes('do you know my name')) {
      const text = userName ? `>> MEMORY_ACCESS\n\nYou are registered as ${userName}.` : ">> MEMORY_ACCESS\n\nUser identity unknown. Please identify yourself.";
      return { text, intent: 'curious', confidence: userName ? 1.0 : 0.8 };
  }
  
  // Helper to find best match
  const findMatch = (text: string) => {
    let best: KnowledgeEntry | null = null;
    let max = 0;
    
    for (const entry of KNOWLEDGE_BASE) {
      let score = 0;
      for (const keyword of entry.keywords) {
        if (text.includes(keyword)) {
          score += keyword.length;
        }
      }
      if (score > max) {
        max = score;
        best = entry;
      }
    }
    return { best, max };
  };

  // 1. Try exact match first (without context)
  let { best, max } = findMatch(lowerInput);

  // 2. If no strong match, try with context
  if (max <= 4 && currentContext) {
    const followUpTriggers = ['more', 'details', 'it', 'this', 'that', 'tech', 'stack', 'about', 'what'];
    const isFollowUp = followUpTriggers.some(t => lowerInput.includes(t)) || lowerInput.split(' ').length < 4;
    
    if (isFollowUp) {
      const contextInput = `${lowerInput} ${currentContext}`;
      const contextResult = findMatch(contextInput);
      
      // Only use context result if it actually improved the score significantly
      if (contextResult.max > max) {
        best = contextResult.best;
        max = contextResult.max;
      }
    }
  }

  // Hard-restrict knowledge domain
  if (!best || max < 4) {
    return {
      text: "I don't answer general questions. I only represent Abhinav Gupta. Access denied.",
      intent,
      confidence: 0.05
    };
  }

  // Adjust tone based on intent
  let responseText = best.response;
  if (intent === 'recruiter') {
      responseText = `>> RECRUITER_MODE_ENGAGED\n\n${responseText}`;
  } else if (intent === 'student') {
      responseText = `>> MENTOR_MODE_ENGAGED\n\n${responseText}`;
  } else if (intent === 'judge') {
      responseText = `>> TECHNICAL_AUDIT_MODE\n\n${responseText}`;
  }

  return { text: responseText, action: best.action, newContext: best.topic || currentContext, intent, confidence: Math.min(0.99, max / 10) };
};

const VoiceVisualizer = () => (
  <div className="flex items-center gap-0.5 h-4 mx-2">
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={i}
        className="w-0.5 bg-neon-cyan rounded-full"
        initial={{ height: 4 }}
        animate={{
          height: [4, 12 + Math.random() * 10, 4],
        }}
        transition={{
          duration: 0.2 + Math.random() * 0.3,
          repeat: Infinity,
          repeatType: "mirror",
          delay: Math.random() * 0.2,
          ease: "easeInOut"
        }}
      />
    ))}
  </div>
);

const CyberAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', text: "System v3.0 Online. I am Abhinav's Digital Avatar. Ask me about his Architecture, Tech Stack, or Psychology." }
  ]);
  const [context, setContext] = useState<string>('');
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [systemStatus, setSystemStatus] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { playClick, playType } = useCyberSounds();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (!isOpen) {
      window.speechSynthesis.cancel();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isVoiceEnabled) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isVoiceEnabled]);

  const speak = (text: string) => {
    if (!isVoiceEnabled) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (!isTyping) return;
    const interval = setInterval(() => {
      if (Math.random() > 0.5) playType();
    }, 50);

    return () => clearInterval(interval);
  }, [isTyping, playType]);

  // Idle detection
  useEffect(() => {
    if (hasAutoOpened || isOpen) return;

    let idleTimer: NodeJS.Timeout;
    const IDLE_TIMEOUT = 15000; // 15 seconds

    const handleIdle = () => {
      setIsOpen(true);
      setHasAutoOpened(true);
      playClick();
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'assistant', 
        text: "System Idle Detected. Do you require assistance navigating the portfolio?" 
      }]);
    };

    const resetTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(handleIdle, IDLE_TIMEOUT);
    };

    const events = ['mousemove', 'keydown', 'scroll', 'click'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(idleTimer);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [hasAutoOpened, isOpen, playClick]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    playClick();
    setIsTyping(true);

    // Visible System Thinking Sequence
    setSystemStatus(">> ANALYZING_INTENT...");
    
    setTimeout(() => setSystemStatus(">> SCANNING_DATABASE..."), 600);
    setTimeout(() => setSystemStatus(">> CALCULATING_CONFIDENCE..."), 1200);

    setTimeout(() => {
      const { text, action, newContext, confidence, newUserName } = processQuery(userMsg.text, context, userName);
      
      setSystemStatus(`>> CONFIDENCE: ${Math.round(confidence * 100)}%`);

      if (newUserName) setUserName(newUserName);
      if (action) setTimeout(() => action(), 500);
      if (newContext) setContext(newContext);

      setTimeout(() => {
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', text }]);
        speak(text);
        setIsTyping(false);
        setSystemStatus(null);
        playType();
      }, 800);
    }, 1800);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 left-4 md:left-8 z-50 w-[calc(100vw-2rem)] md:w-96 h-[500px] max-h-[60vh] bg-black/90 backdrop-blur-xl border border-neon-cyan/30 rounded-2xl shadow-[0_0_40px_-10px_rgba(6,182,212,0.3)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-neon-cyan" />
                {isSpeaking ? (
                  <VoiceVisualizer />
                ) : (
                  <span className="font-mono text-sm font-bold text-neon-cyan">
                    {systemStatus || "AI_ASSISTANT v3.0"}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                  className="text-muted-foreground hover:text-neon-cyan transition-colors"
                  title={isVoiceEnabled ? "Mute Voice" : "Enable Voice"}
                >
                  {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-xl text-sm font-mono leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 rounded-tr-none'
                        : 'bg-white/10 text-foreground border border-white/10 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/10 p-3 rounded-xl rounded-tl-none border border-white/10 flex gap-1">
                    <span className="w-2 h-2 bg-neon-cyan/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-neon-cyan/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-neon-cyan/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-white/5">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about Abhinav..."
                  className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:border-neon-cyan/50 transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="p-2 bg-neon-cyan/20 text-neon-cyan rounded-lg border border-neon-cyan/30 hover:bg-neon-cyan/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        onClick={() => {
            setIsOpen(!isOpen);
            playClick();
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 left-4 md:left-8 z-50 w-16 h-16 flex items-center justify-center group"
      >
        {/* Rotating Outer Ring */}
        <motion.div 
            className="absolute inset-0 rounded-full border border-dashed border-neon-cyan/40"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Counter-Rotating Inner Ring */}
        <motion.div 
            className="absolute inset-1 rounded-full border border-dotted border-neon-purple/40"
            animate={{ rotate: -360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />

        {/* Core Button */}
        <div className="absolute inset-2 rounded-full bg-black/80 backdrop-blur-md border border-neon-cyan text-neon-cyan shadow-[0_0_15px_rgba(6,182,212,0.5)] flex items-center justify-center overflow-hidden group-hover:shadow-[0_0_25px_rgba(6,182,212,0.8)] transition-shadow duration-300">
          <div className="absolute inset-0 bg-gradient-to-tr from-neon-cyan/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Bot className="w-6 h-6 relative z-10 group-hover:scale-110 transition-transform duration-300" />
        </div>

        {/* Notification Dot */}
        <span className="absolute top-1 right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-neon-green border-2 border-black"></span>
        </span>
      </motion.button>
    </>
  );
};

export default CyberAssistant;