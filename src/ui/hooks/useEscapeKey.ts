import { useEffect } from 'react';

/**
 * Custom hook to close modals or dialogs when the user presses the Escape key.
 * Adheres to Nielsen Heuristic #3 (User control and freedom) and WCAG keyboard access.
 */
export function useEscapeKey(isOpen: boolean, onEscape: () => void): void {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onEscape();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onEscape]);
}
