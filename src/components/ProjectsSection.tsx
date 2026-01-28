import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';

const projects = [
  {
    title: 'XShootSMS',
    label: 'Communication Utility',
    url: 'https://xshootsms.com',
    description: 'Engineered a B2B SaaS utility for high-throughput SMS delivery, featuring API integration and an analytics dashboard.',
  },
  {
    title: 'Premier Properties',
    label: 'Real Estate Discovery',
    url: 'https://housekeys-premier-properties.vercel.app',
    description: "Architected a high-trust, responsive UI for a luxury PropTech platform, focusing on lead generation and visual hierarchy.",
  },
  {
    title: 'Hyperlink',
    label: 'Digital Connection Hub',
    url: 'https://hyperlink-eta.vercel.app',
    description: 'Developed a low-latency resource aggregator deployed on the Vercel Edge Network to solve digital clutter.',
  },
];

const ProjectsSection = () => {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden" id="projects">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      {/* Background Enhancements */}
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 cyber-grid opacity-10" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neon-purple/50 to-transparent" />
      
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-purple/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Decorative Markers */}
        <div className="absolute top-0 left-6 text-[10px] font-mono text-neon-cyan/30 hidden md:block">
           // DEPLOYED_MODULES
        </div>
        <div className="absolute top-0 right-6 text-[10px] font-mono text-neon-purple/30 hidden md:block">
           [ STATUS: ACTIVE ]
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 md:mb-20 relative flex flex-col items-center text-center"
        >
          <div className="flex items-center gap-2 mb-4">
             <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" />
             <span className="font-mono text-sm text-neon-cyan uppercase tracking-[0.3em]">
               Featured Work
             </span>
             <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse" />
          </div>
          <h2 className="text-4xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-tight">
            Projects That <span className="text-neon-purple">Speak</span>
          </h2>
          <p className="mt-6 text-muted-foreground font-mono text-sm max-w-lg leading-relaxed">
             // A collection of high-performance applications engineered for impact.
             <br />
             // Hover to engage holographic interface.
          </p>
        </motion.div>

        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-12 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0 hide-scrollbar">
          {projects.map((project, index) => (
            <div key={project.title} className="min-w-[85vw] md:min-w-0 snap-center">
              <ProjectCard
                title={project.title}
                label={project.label}
                url={project.url}
                description={project.description}
                index={index}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
