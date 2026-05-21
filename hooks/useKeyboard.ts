'use client';

import { useEffect, useCallback } from 'react';
import type { Direction } from '@/types';

const KEY_DIR_MAP: Record<string, Direction> = {
  ArrowUp: 'up',    w: 'up',    W: 'up',
  ArrowDown: 'down', s: 'down',  S: 'down',
  ArrowLeft: 'left', a: 'left',  A: 'left',
  ArrowRight: 'right', d: 'right', D: 'right',
};

interface UseKeyboardOptions {
  onMove: (dir: Direction) => void;
  onInteract: () => void;
  disabled?: boolean;
}

export function useKeyboard({ onMove, onInteract, disabled }: UseKeyboardOptions) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (disabled) return;
      // Prevent page scroll on arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      const dir = KEY_DIR_MAP[e.key];
      if (dir) {
        onMove(dir);
        return;
      }
      if (e.key === 'e' || e.key === 'E' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        onInteract();
      }
    },
    [onMove, onInteract, disabled]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
