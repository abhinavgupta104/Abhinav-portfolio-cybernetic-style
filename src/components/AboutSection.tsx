import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect, useMemo } from 'react';
import { MapPin, GraduationCap, Calendar, Building2, ArrowUpRight, Download, RefreshCw, Globe, Mic, Command, Terminal, Box, Palette, Volume2, Sparkles, Bot, Code2 } from 'lucide-react';
import aboutFocus from '@/assets/about-focus.png';
import aboutPortrait from '@/assets/about-portrait.png';
import TechIcon from './TechIcon';
import { useCyberSounds } from '@/hooks/use-cyber-sounds';

// --- DATA: Story Chapters ---
const chapters = [
  {
    id: 1,
    title: 'The Foundation',
    subtitle: 'Logic',
    text: "It all started with the raw logic of C++. At Ghaziabad Polytechnic, I didn't just learn syntax; I learned how to think. Mastering Data Structures & Algorithms gave me the power to solve complex problems efficiently.",
    icons: ['cpp'],
  },
  {
    id: 2,
    title: 'The Architecture',
    subtitle: 'Web',
    text: "I wanted to build things people could touch. I expanded into Full Stack Development. From React frontends to scalable backends, I learned to turn code into products like Hyperlink and Acmax.",
    icons: ['react', 'nextjs'],
  },
  {
    id: 3,
    title: 'The Intelligence',
    subtitle: 'AI & Data',
    text: "Now, I am bridging the gap between Code and Cognition. Leveraging an advanced Python Data Stack, I analyze the world through data. This is the next frontier: moving from building apps to building intelligence.",
    icons: ['python', 'numpy', 'pandas', 'matplotlib', 'seaborn'],
  },
];

// --- DATA: Internships (Updated with Links) ---
const experiences = [
  {
    id: 1,
    company: 'OcioTechnology',
    role: 'Full Stack Developer Intern',
    period: 'Present',
    description: 'Building real-world web solutions and bridging the gap between complex backends and seamless user experiences.',
    link: 'https://ociotechnology.com/',
    variant: 'cyan'
  },
  {
    id: 2,
    company: 'Softpro India',
    role: 'Software Development Intern',
    period: 'Past',
    description: 'Gained foundational footing in professional software development practices and learned the discipline of shipping code.',
    link: 'https://www.softproindia.in/',
    variant: 'purple'
  }
];

const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6, // Reduced from 1
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const experienceVariants = {
  cyan: {
    color: 'text-neon-cyan',
    border: 'group-hover:border-neon-cyan/50',
    glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)]'
  },
  purple: {
    color: 'text-neon-purple',
    border: 'group-hover:border-neon-purple/50',
    glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]'
  }
};

const skills = [
  { name: 'Frontend Engineering', level: 92, color: 'bg-neon-cyan', text: 'text-neon-cyan' },
  { name: 'Backend Architecture', level: 85, color: 'bg-neon-purple', text: 'text-neon-purple' },
  { name: 'AI & Data Science', level: 78, color: 'bg-neon-green', text: 'text-neon-green' },
  { name: 'System Design', level: 88, color: 'bg-neon-cyan', text: 'text-neon-cyan' },
];

const quotes = [
  "Design is intelligence made visible.",
  "Code is poetry written for machines.",
  "Simplicity is the soul of efficiency.",
  "The best way to predict the future is to invent it."
];

const AboutSection = () => {
  const experienceRef = useRef<HTMLDivElement>(null);
  const isExperienceInView = useInView(experienceRef, { 
    margin: "-20% 0px -20% 0px",
    once: false
  });
  const [showPortrait, setShowPortrait] = useState(false);
  const [quote, setQuote] = useState(quotes[0]);
  const [isQuoteVisible, setIsQuoteVisible] = useState(true);
  const { playClick } = useCyberSounds();
  
  const imageRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    setRotateX(((e.clientY - centerY) / (rect.height / 2)) * -10);
    setRotateY(((e.clientX - centerX) / (rect.width / 2)) * 10);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, [isExperienceInView]);

  const handleRefreshQuote = () => {
    setIsQuoteVisible(false);
    setTimeout(() => {
      let newQuote;
      do {
        newQuote = quotes[Math.floor(Math.random() * quotes.length)];
      } while (newQuote === quote && quotes.length > 1);
      setQuote(newQuote);
      setIsQuoteVisible(true);
    }, 300);
  };

  return (
    <section className="relative min-h-screen py-20 md:py-32" id="about">
      {/* Background Ambience */}
      <div className="absolute inset-0 cyber-grid opacity-[0.03] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 lg:gap-24 items-start">
          
          {/* LEFT COLUMN: Sticky Identity */}
          <div className="lg:sticky lg:top-32 h-fit space-y-12">
            
            {/* Intro Header */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "circOut" }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-[1px] w-12 bg-neon-purple" />
                <span className="font-mono text-xs text-neon-purple uppercase tracking-[0.3em]">
                  Profile
                </span>
              </div>
              <h2 className="text-5xl md:text-6xl font-display font-extrabold text-foreground tracking-tight leading-[1.1]">
                 The Human <br />
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground to-foreground/50">Behind The Code.</span>
              </h2>
              <div className="mt-8 space-y-6 text-lg font-body font-light text-muted-foreground leading-relaxed max-w-md">
                <p>
                  I am <strong className="text-foreground font-medium">Abhinav Gupta</strong>. A 21-year-old developer operating at the intersection of academic discipline and real-world engineering.
                </p>
                <p>
                  While others see code as syntax, I see it as architecture. My journey began with the raw logic of C++ and evolved into building scalable, high-performance web applications. Now, I am bridging the gap between traditional software engineering and the cognitive power of AI.
                </p>
              </div>

              {/* Quote */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 2.5, duration: 0.8 }}
                className="mt-8 group"
              >
                <div className="flex items-start gap-4">
                  <motion.p 
                    animate={{ opacity: isQuoteVisible ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-3xl md:text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-green leading-tight drop-shadow-sm"
                  >
                    "{quote}"
                  </motion.p>
                  <button 
                    onClick={handleRefreshQuote}
                    className="mt-2 p-2 rounded-full hover:bg-white/10 text-muted-foreground hover:text-neon-cyan transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Refresh Quote"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            </motion.div>

            {/* Photo with Premium Masking */}
            <motion.div
              ref={imageRef}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative w-full max-w-sm group cursor-pointer"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={() => {
                setShowPortrait(!showPortrait);
                playClick();
              }}
              style={{ perspective: 1000 }}
            >
              <motion.div
                animate={{ rotateX, rotateY }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="absolute -inset-1 bg-gradient-to-b from-neon-cyan/20 to-neon-purple/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-700" />
                <div className="relative border border-white/10 p-2 rounded-2xl bg-black/40 backdrop-blur-sm overflow-hidden">
                  <div className="relative w-full aspect-[4/5]">
                    {/* Base Image - Default (Portrait) */}
                    <motion.img
                      src={aboutPortrait}
                      alt="Abhinav Gupta Portrait"
                      className="absolute inset-0 w-full h-full object-cover rounded-xl"
                      animate={{ opacity: showPortrait ? 0 : 1 }}
                      transition={{ duration: 0.7 }}
                      style={{ 
                        maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)', 
                        WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                      }}
                    />
                    {/* Focus Image - Fades in on click */}
                    <motion.img
                      src={aboutFocus}
                      alt="Abhinav Gupta Focus"
                      className="absolute inset-0 w-full h-full object-cover rounded-xl"
                      animate={{ opacity: showPortrait ? 1 : 0 }}
                      transition={{ duration: 0.7 }}
                      style={{ 
                        maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)', 
                        WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                      }}
                    />

                    {/* Swap Hint */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 pointer-events-none">
                      <span className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white/70 uppercase tracking-wider whitespace-nowrap">
                        Click to Swap
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Primary Toolkit */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h3 className="font-mono text-xs text-muted-foreground uppercase tracking-[0.2em] mb-4">
                Primary Toolkit
              </h3>
              <div className="flex flex-wrap gap-4">
                <TechIcon name="cpp" delay={0} />
                <TechIcon name="react" delay={0.1} />
                <TechIcon name="python" delay={0.2} />
              </div>
            </motion.div>

            {/* Stats Grid - Glassmorphism */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.4, duration: 0.6 }}
               className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: MapPin, label: "Base", value: "Ghaziabad, IN", color: "text-neon-cyan" },
                { icon: GraduationCap, label: "Education", value: "IT Diploma", color: "text-neon-purple" },
                { icon: Calendar, label: "Age", value: "21 Years", color: "text-neon-green" },
                { icon: Building2, label: "Status", value: "Student", color: "text-neon-cyan" }
              ].map((stat, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-foreground/[0.03] border border-foreground/[0.05] hover:bg-foreground/[0.08] transition-colors duration-300">
                   <stat.icon className={`w-5 h-5 ${stat.color}`} />
                   <div>
                     <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider opacity-70">{stat.label}</div>
                     <div className="text-sm font-display font-medium text-foreground">{stat.value}</div>
                   </div>
                </div>
              ))}
            </motion.div>

            {/* Resume Download Button */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="pt-2"
            >
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan font-mono text-sm uppercase tracking-wider hover:bg-neon-cyan/20 transition-all duration-300 group"
              >
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                <span>View Resume</span>
              </a>
            </motion.div>

            {/* Live Status Log */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="p-4 rounded-xl bg-foreground/[0.02] border border-foreground/[0.05] font-mono text-xs"
            >
              <div className="flex items-center gap-2 mb-3 text-neon-green">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green"></span>
                </span>
                <span className="uppercase tracking-wider">System Status</span>
              </div>
              <div className="space-y-2 text-muted-foreground">
                <p><span className="text-neon-purple">root@abhinav:~$</span> learning rust</p>
                <p><span className="text-neon-purple">root@abhinav:~$</span> reading "Clean Arch"</p>
                <p><span className="text-neon-purple">root@abhinav:~$</span> optimizing neural_net</p>
              </div>
            </motion.div>

            {/* About Website */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.0, duration: 0.6 }}
              className="p-4 rounded-xl bg-foreground/[0.02] border border-foreground/[0.05] space-y-4"
            >
              <div className="flex items-center gap-2 text-neon-cyan">
                <Globe className="w-4 h-4" />
                <span className="font-mono text-xs uppercase tracking-wider">System Architecture</span>
              </div>
              
              <p className="text-xs text-muted-foreground leading-relaxed font-mono">
                A next-gen portfolio architected by Abhinav Gupta. Built with React & Three.js, featuring AI integration and immersive cybernetic interfaces.
              </p>

              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 text-xs text-muted-foreground/80 font-mono">
                  <Mic className="w-3.5 h-3.5 text-neon-purple" />
                  <span>Neural Voice Uplink</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground/80 font-mono">
                  <Bot className="w-3.5 h-3.5 text-neon-cyan" />
                  <span>AI Assistant (v3.0)</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground/80 font-mono">
                  <Command className="w-3.5 h-3.5 text-neon-green" />
                  <span>Command Palette (Cmd+K)</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground/80 font-mono">
                  <Terminal className="w-3.5 h-3.5 text-neon-cyan" />
                  <span>Interactive Terminal CLI</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground/80 font-mono">
                  <Box className="w-3.5 h-3.5 text-neon-purple" />
                  <span>3D Holographic Projection</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground/80 font-mono">
                  <Palette className="w-3.5 h-3.5 text-neon-green" />
                  <span>5+ Adaptive Themes</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground/80 font-mono">
                  <Volume2 className="w-3.5 h-3.5 text-neon-cyan" />
                  <span>Audio-Reactive UI</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground/80 font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-neon-purple" />
                  <span>Hidden Easter Eggs</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground/80 font-mono">
                  <Code2 className="w-3.5 h-3.5 text-neon-green" />
                  <span>Built by Abhinav Gupta</span>
                </div>
              </div>
            </motion.div>

          </div>

          {/* RIGHT COLUMN: Narrative & Experience */}
          <div className="pt-12 lg:pt-0 pb-20 lg:pb-32">
            
            {/* Story Chapters */}
            <div className="space-y-24 md:space-y-40 mb-24 md:mb-48">
              {chapters.map((chapter, chapterIndex) => (
                <ChapterBlock
                  key={chapter.id}
                  chapter={chapter}
                  index={chapterIndex}
                />
              ))}
            </div>

            {/* EXPERIENCE SECTION */}
            <motion.div
              ref={experienceRef}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative pl-4 md:pl-8 border-l border-foreground/10"
            >
               <div className="absolute -left-[9px] md:-left-[37px] top-2 w-4 h-4 rounded-full bg-neon-purple shadow-[0_0_15px_#bd00ff] z-10" />
               <h3 className="text-3xl font-display font-bold text-foreground mb-12 tracking-tight">
                 Professional <span className="text-neon-purple">Experience</span>
               </h3>

               <div className="space-y-6">
                 {experiences.map((exp, index) => {
                   const styles = experienceVariants[exp.variant as keyof typeof experienceVariants];
                   
                   return (
                    <motion.a
                     href={exp.link}
                     target="_blank"
                     rel="noopener noreferrer"
                     key={exp.id}
                     initial={{ x: 30, opacity: 0 }}
                     whileInView={{ x: 0, opacity: 1 }}
                     viewport={{ once: true }}
                     transition={{ delay: index * 0.1, duration: 0.5 }}
                     className={`group relative block p-8 rounded-2xl bg-foreground/[0.02] border border-foreground/[0.05] hover:bg-foreground/[0.04] transition-all duration-500 ${styles.border} ${styles.glow}`}
                   >
                     {/* Hover Arrow */}
                     <div className="absolute top-6 right-6 opacity-0 -translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <ArrowUpRight className={`w-6 h-6 ${styles.color}`} />
                     </div>

                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                       <div>
                         <h4 className={`text-2xl font-bold font-display ${styles.color}`}>
                           {exp.company}
                         </h4>
                         <p className="text-sm font-mono text-muted-foreground mt-1">{exp.role}</p>
                       </div>
                       <span className="self-start text-xs font-mono py-1.5 px-3 rounded-full bg-foreground/5 border border-foreground/10 text-foreground/70">
                         {exp.period}
                       </span>
                     </div>
                     <p className="text-muted-foreground font-body text-base leading-relaxed max-w-xl group-hover:text-foreground/80 transition-colors">
                       {exp.description}
                     </p>
                   </motion.a>
                   );
                 })}
               </div>
            </motion.div>

            {/* SKILLS SECTION */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-24 relative pl-4 md:pl-8 border-l border-foreground/10"
            >
              <div className="absolute -left-[9px] md:-left-[37px] top-2 w-4 h-4 rounded-full bg-neon-green shadow-[0_0_15px_#22c55e] z-10" />
              <h3 className="text-3xl font-display font-bold text-foreground mb-12 tracking-tight">
                System <span className="text-neon-green">Capabilities</span>
              </h3>

              <div className="space-y-8">
                {skills.map((skill, index) => (
                  <SkillBar key={skill.name} skill={skill} index={index} />
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
};

interface ChapterProps {
  chapter: typeof chapters[0];
  index: number;
}

const ChapterBlock = ({ chapter, index }: ChapterProps) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-20% 0px -20% 0px' }}
      className="relative pl-4 md:pl-8 border-l border-foreground/10"
    >
      {/* Big Number Background */}
      <motion.div
        custom={0}
        variants={textVariants}
        className="absolute -left-2 md:-left-[4rem] -top-8 font-display text-6xl md:text-9xl font-bold text-foreground/[0.02] select-none z-0"
        style={{ willChange: 'auto' }}
        aria-hidden="true"
      >
        0{chapter.id}
      </motion.div>

      {/* Connection Dot */}
      <div className="absolute -left-[9px] md:-left-[37px] top-2 w-4 h-4 rounded-full bg-black border border-neon-cyan/50 shadow-[0_0_10px_rgba(6,182,212,0.3)] z-10" />

      <motion.div custom={1} variants={textVariants} className="mb-6 relative z-10">
        <span className="font-mono text-xs text-neon-cyan uppercase tracking-[0.3em]">
          Phase 0{chapter.id}
        </span>
        <h3 className="mt-2 text-4xl font-display font-bold text-foreground">
          {chapter.title} <span className="text-neon-purple/70 font-light block lg:inline text-2xl lg:ml-2">// {chapter.subtitle}</span>
        </h3>
      </motion.div>

      <motion.p
        custom={2}
        variants={textVariants}
        className="text-lg font-body font-light text-muted-foreground leading-relaxed max-w-xl"
      >
        {chapter.text}
      </motion.p>

      <motion.div
        custom={3}
        variants={textVariants}
        className="mt-8 flex flex-wrap gap-4"
      >
        {chapter.icons.map((icon, iconIndex) => (
          <TechIcon key={icon} name={icon} delay={iconIndex * 0.08} />
        ))}
      </motion.div>
    </motion.div>
  );
};

const SkillBar = ({ skill, index }: { skill: typeof skills[0], index: number }) => (
  <motion.div 
    className="space-y-2 group cursor-pointer"
    whileHover="hover"
  >
    <div className="flex justify-between text-sm font-mono">
      <span className="text-muted-foreground group-hover:text-foreground transition-colors">{skill.name}</span>
      <span className={`${skill.text}`}>{skill.level}%</span>
    </div>
    <div className="h-2 bg-foreground/5 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${skill.level}%` }}
        variants={{
          hover: { width: `${Math.min(skill.level + 10, 100)}%`, filter: "brightness(1.5)", transition: { duration: 0.3, ease: "easeOut" } }
        }}
        transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
        className={`h-full ${skill.color} shadow-[0_0_10px_currentColor] relative`}
      >
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50" />
      </motion.div>
    </div>
  </motion.div>
);

export default AboutSection;