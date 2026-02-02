import { useState, useRef, useCallback, useEffect } from 'react';

export const useBackgroundMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.3);
  const [mode, setMode] = useState<'file' | 'synth'>('file');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Synth refs (Fallback)
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  useEffect(() => {
    // CHANGED: Updated to use .mp3 extension
    const audio = new Audio('/background-music.mp3');
    audio.loop = true;
    audio.volume = volume;
    
    const handleError = () => {
      console.warn("Audio file failed to load. Switching to synth fallback.");
      setMode('synth');
    };

    audio.addEventListener('error', handleError);
    audioRef.current = audio;

    return () => {
      audio.removeEventListener('error', handleError);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // Initialize Synth (Fallback)
  const initSynth = useCallback(() => {
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioContextRef.current = new AudioContextClass();
        const gainNode = audioContextRef.current.createGain();
        gainNode.gain.value = volume * 0.1;
        gainNode.connect(audioContextRef.current.destination);
        gainNodeRef.current = gainNode;
      }
    }
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
  }, [volume]);

  const startSynth = useCallback(() => {
    initSynth();
    if (!audioContextRef.current || !gainNodeRef.current) return;

    oscillatorsRef.current.forEach(o => { try { o.stop(); } catch(e){} });
    oscillatorsRef.current = [];

    const configs = [
      { freq: 55, type: 'sawtooth' as OscillatorType },
      { freq: 55.5, type: 'sawtooth' as OscillatorType },
      { freq: 110, type: 'sine' as OscillatorType },
    ];

    configs.forEach(config => {
      if (!audioContextRef.current || !gainNodeRef.current) return;
      const osc = audioContextRef.current.createOscillator();
      osc.type = config.type;
      osc.frequency.setValueAtTime(config.freq, audioContextRef.current.currentTime);
      const filter = audioContextRef.current.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400;
      osc.connect(filter);
      filter.connect(gainNodeRef.current);
      osc.start();
      oscillatorsRef.current.push(osc);
    });
  }, [initSynth]);

  const stopSynth = useCallback(() => {
    oscillatorsRef.current.forEach(o => { try { o.stop(); } catch(e){} });
    oscillatorsRef.current = [];
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(newVolume * 0.1, audioContextRef.current.currentTime, 0.1);
    }
  }, []);

  const toggleMusic = useCallback(() => {
    if (isPlaying) {
      if (mode === 'file' && audioRef.current) audioRef.current.pause();
      else stopSynth();
      setIsPlaying(false);
    } else {
      if (mode === 'file' && audioRef.current) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            setMode('synth');
            startSynth();
            setIsPlaying(true);
          });
      } else {
        startSynth();
        setIsPlaying(true);
      }
    }
  }, [isPlaying, mode, startSynth, stopSynth]);

  return { isPlaying, toggleMusic, volume, setVolume };
};