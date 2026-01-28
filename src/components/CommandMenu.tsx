import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, User, Code, Mail, 
  Github, Linkedin, 
  Moon, Sun, Terminal, Gamepad2,
  Search, Keyboard, Bomb, ZapOff
} from 'lucide-react';
import { useCyberSounds } from '@/hooks/use-cyber-sounds';

export const CommandMenu = () => {
  const [open, setOpen] = useState(false);
  const { playClick } = useCyberSounds();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
        playClick();
      }
    };

    const handleOpenEvent = () => setOpen(true);

    document.addEventListener('keydown', down);
    window.addEventListener('open-command-menu', handleOpenEvent);
    
    return () => {
      document.removeEventListener('keydown', down);
      window.removeEventListener('open-command-menu', handleOpenEvent);
    };
  }, [playClick]);

  const runCommand = (command: () => void) => {
    setOpen(false);
    playClick();
    command();
  };

  const switchTheme = (theme: string) => {
    window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme } }));
  };

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
    else if (id === 'top') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-background border border-neon-cyan/30 rounded-xl shadow-[0_0_30px_rgba(6,182,212,0.15)] overflow-hidden"
          >
             <Command className="w-full bg-transparent">
               <div className="flex items-center border-b border-white/10 px-4">
                 <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                 <Command.Input 
                   placeholder="Type a command or search..."
                   className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                   autoFocus
                 />
                 <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    ESC
                  </kbd>
               </div>
               <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
                 <Command.Empty className="py-6 text-center text-sm text-muted-foreground">No results found.</Command.Empty>
                 
                 <Command.Group heading="Navigation" className="text-xs font-medium text-muted-foreground px-2 py-1.5">
                   <CommandItem onSelect={() => runCommand(() => scrollTo('top'))} icon={Home} text="Home" />
                   <CommandItem onSelect={() => runCommand(() => scrollTo('about'))} icon={User} text="About" />
                   <CommandItem onSelect={() => runCommand(() => scrollTo('projects'))} icon={Code} text="Projects" />
                   <CommandItem onSelect={() => runCommand(() => scrollTo('contact'))} icon={Mail} text="Contact" />
                 </Command.Group>

                 <Command.Group heading="Theme" className="text-xs font-medium text-muted-foreground px-2 py-1.5 mt-2">
                   <CommandItem onSelect={() => runCommand(() => switchTheme('dark'))} icon={Moon} text="Dark Mode" />
                   <CommandItem onSelect={() => runCommand(() => switchTheme('light'))} icon={Sun} text="Light Mode" />
                   <CommandItem onSelect={() => runCommand(() => switchTheme('matrix'))} icon={Terminal} text="Matrix Mode" />
                   <CommandItem onSelect={() => runCommand(() => switchTheme('secret'))} icon={Gamepad2} text="Secret Mode" />
                   <CommandItem onSelect={() => runCommand(() => switchTheme('simple'))} icon={ZapOff} text="Simple Mode" />
                 </Command.Group>

                 <Command.Group heading="Social" className="text-xs font-medium text-muted-foreground px-2 py-1.5 mt-2">
                   <CommandItem onSelect={() => runCommand(() => window.open('https://github.com/abhinavgupta104', '_blank'))} icon={Github} text="GitHub" />
                   <CommandItem onSelect={() => runCommand(() => window.open('https://www.linkedin.com/in/abhinav-gupta-9136aa382/', '_blank'))} icon={Linkedin} text="LinkedIn" />
                 </Command.Group>

                 <Command.Group heading="System" className="text-xs font-medium text-muted-foreground px-2 py-1.5 mt-2">
                   <CommandItem onSelect={() => runCommand(() => window.dispatchEvent(new Event('toggle-hacker-mode')))} icon={Keyboard} text="Hacker Mode" />
                 </Command.Group>

                 <Command.Group heading="Danger Zone" className="text-xs font-medium text-muted-foreground px-2 py-1.5 mt-2">
                   <CommandItem onSelect={() => runCommand(() => window.dispatchEvent(new Event('trigger-self-destruct')))} icon={Bomb} text="Self Destruct" />
                 </Command.Group>
               </Command.List>
             </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const CommandItem = ({ onSelect, icon: Icon, text }: { onSelect: () => void, icon: any, text: string }) => {
  return (
    <Command.Item 
      onSelect={onSelect}
      value={text}
      className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-white/10 aria-selected:text-neon-cyan data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors group"
    >
      <Icon className="mr-2 h-4 w-4 group-aria-selected:text-neon-cyan transition-colors" />
      <span>{text}</span>
    </Command.Item>
  );
}