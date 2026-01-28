import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  label: string;
  url: string;
  description: string;
  index: number;
}

const ProjectCard = ({ title, label, url, description, index }: ProjectCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const rotateXValue = ((e.clientY - centerY) / (rect.height / 2)) * -10;
    const rotateYValue = ((e.clientX - centerX) / (rect.width / 2)) * 10;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative group cursor-pointer"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Holographic Projection Base (Glow underneath) */}
      <div className="absolute -inset-4 bg-gradient-to-t from-neon-cyan/20 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10 rounded-[100%]" />

      <div 
        className="relative min-h-[400px] h-auto bg-card/90 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Holographic Scanline */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-cyan/5 to-transparent pointer-events-none z-0"
          animate={{ top: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 to-neon-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 cyber-grid opacity-20 group-hover:opacity-30 transition-opacity duration-500" />

        {/* Content with Z-lift */}
        <div className="relative z-10 h-full flex flex-col justify-between p-8" style={{ transform: 'translateZ(30px)' }}>
          <div>
            <span className="font-mono text-xs text-neon-cyan uppercase tracking-widest">
              {label}
            </span>
            <h3 className="mt-4 text-3xl md:text-5xl font-display font-bold text-foreground group-hover:text-gradient-cyber transition-all duration-300">
              {title}
            </h3>
            <p className="mt-4 font-mono text-sm text-muted-foreground leading-relaxed max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 transition-all duration-700 ease-in-out">
              {description}
            </p>
          </div>

          <motion.a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black/50 border-2 border-neon-cyan text-neon-cyan rounded-lg font-mono text-sm uppercase tracking-wider w-fit backdrop-blur-md"
            whileHover={{ 
              boxShadow: '0 0 30px hsl(185 100% 50% / 0.5)',
              backgroundColor: 'hsl(185 100% 50% / 0.1)',
              scale: 1.05
            }}
            whileTap={{ scale: 0.98 }}
          >
            <span>View Live</span>
            <ExternalLink className="w-4 h-4" />
          </motion.a>
        </div>

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-neon-cyan/50 rounded-tl-2xl transition-all duration-500 group-hover:w-16 group-hover:h-16 group-hover:border-neon-cyan" />
        <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-neon-purple/50 rounded-br-2xl transition-all duration-500 group-hover:w-16 group-hover:h-16 group-hover:border-neon-purple" />
      </div>
    </motion.div>
  );
};

export default ProjectCard;
