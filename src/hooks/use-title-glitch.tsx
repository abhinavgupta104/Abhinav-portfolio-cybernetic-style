import { useEffect, useRef } from 'react';

export const useTitleGlitch = (awayTitle: string = "Signal Lost... ⚠️") => {
  const originalTitle = useRef(document.title);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = awayTitle;
      } else {
        document.title = originalTitle.current;
        // Optional: Glitch effect back to original
        setTimeout(() => { document.title = "R3conn3cting..."; }, 200);
        setTimeout(() => { document.title = originalTitle.current; }, 500);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.title = originalTitle.current;
    };
  }, [awayTitle]);
};