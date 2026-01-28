import { useState, useEffect, useCallback } from 'react';

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);
        const reco = new SpeechRecognition();
        reco.continuous = false;
        reco.interimResults = true;
        reco.lang = 'en-US';
        setRecognition(reco);
      }
    }
  }, []);

  const startListening = useCallback(() => {
    if (recognition) {
      try {
        setError(null);
        recognition.start();
        setIsListening(true);
        setTranscript('');
      } catch (e) {
        console.error("Speech recognition error:", e);
        setError('start-failed');
      }
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition]);

  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcriptValue = event.results[current][0].transcript;
      setTranscript(transcriptValue);
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      setError(event.error);
      setIsListening(false);
    };
  }, [recognition]);

  return { isListening, transcript, startListening, stopListening, isSupported, error };
};