import { useEffect } from 'react';

export const useKeyboardShortcuts = (onSubmit, onRestart) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd/Ctrl + Enter -> submit
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (onSubmit) onSubmit();
      }
      // Cmd/Ctrl + Shift + N -> restart
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'n' || e.key === 'N')) {
        if (onRestart) onRestart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSubmit, onRestart]);
};
