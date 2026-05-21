'use client';

import type { Direction } from '@/types';

interface VirtualDpadProps {
  onMove: (dir: Direction) => void;
  onInteract: () => void;
  interactLabel?: string;
}

const BTN_BASE =
  'flex items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white active:bg-white/40 select-none touch-none';

export function VirtualDpad({ onMove, onInteract, interactLabel }: VirtualDpadProps) {
  const press = (dir: Direction) => (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    onMove(dir);
  };

  return (
    <div className="fixed bottom-6 left-0 right-0 flex items-end justify-between px-6 z-30 pointer-events-none">
      {/* D-pad */}
      <div className="pointer-events-auto grid grid-cols-3 grid-rows-3 gap-1 w-32 h-32">
        {/* Up */}
        <div />
        <button
          className={`${BTN_BASE} text-2xl`}
          onTouchStart={press('up')}
          onMouseDown={press('up')}
          aria-label="위"
        >
          ▲
        </button>
        <div />

        {/* Left / Right */}
        <button
          className={`${BTN_BASE} text-2xl`}
          onTouchStart={press('left')}
          onMouseDown={press('left')}
          aria-label="왼쪽"
        >
          ◀
        </button>
        <div className="flex items-center justify-center text-white/40 text-xs">
          MOVE
        </div>
        <button
          className={`${BTN_BASE} text-2xl`}
          onTouchStart={press('right')}
          onMouseDown={press('right')}
          aria-label="오른쪽"
        >
          ▶
        </button>

        {/* Down */}
        <div />
        <button
          className={`${BTN_BASE} text-2xl`}
          onTouchStart={press('down')}
          onMouseDown={press('down')}
          aria-label="아래"
        >
          ▼
        </button>
        <div />
      </div>

      {/* Interact button */}
      <div className="pointer-events-auto">
        <button
          className={`${BTN_BASE} w-16 h-16 text-sm font-bold flex-col gap-0.5 ${
            interactLabel ? 'bg-pink-400/60 border-pink-300' : 'opacity-40'
          }`}
          onTouchStart={(e) => { e.preventDefault(); onInteract(); }}
          onMouseDown={(e) => { e.preventDefault(); onInteract(); }}
          disabled={!interactLabel}
          aria-label="상호작용"
        >
          <span className="text-lg">E</span>
          <span className="text-[9px] leading-tight text-center px-1">
            {interactLabel ? '상호작용' : ''}
          </span>
        </button>
      </div>
    </div>
  );
}
