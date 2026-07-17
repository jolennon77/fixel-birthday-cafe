'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import type { Direction, Position, CharacterGender } from '@/types';

const SPRITE_H = 64;
const WALK_FRAMES = [1, 2] as const;
const STOP_DELAY_MS = 200;

function getSpriteSrc(gender: CharacterGender, direction: Direction, frame: number): string {
  if (frame === 0) return `/sprites/${gender}_${direction}.png`;
  return `/sprites/${gender}_${direction}_${frame}.png`;
}

interface CharacterProps {
  position: Position;
  direction: Direction;
  tileSize: number;
  gender: CharacterGender;
}

export function Character({ position, direction, tileSize, gender }: CharacterProps) {
  const [walking, setWalking] = useState(false);
  const [cycleIdx, setCycleIdx] = useState(0);
  const stopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 한 칸 이동마다 다음 발로 전진 — cycleIdx는 리셋하지 않음
  useEffect(() => {
    setCycleIdx(i => (i + 1) % WALK_FRAMES.length);
    setWalking(true);
    if (stopTimer.current) clearTimeout(stopTimer.current);
    stopTimer.current = setTimeout(() => setWalking(false), STOP_DELAY_MS);
    return () => { if (stopTimer.current) clearTimeout(stopTimer.current); };
  }, [position.x, position.y]);

  const frame = walking ? WALK_FRAMES[cycleIdx] : 0;

  return (
    <motion.div
      className="absolute flex items-end justify-center pointer-events-none z-10"
      style={{ width: tileSize, height: tileSize }}
      animate={{
        left: position.x * tileSize,
        top:  position.y * tileSize,
      }}
      transition={{ type: 'tween', duration: 0.12, ease: 'linear' }}
    >
      <Image
        src={getSpriteSrc(gender, direction, frame)}
        alt="character"
        width={tileSize}
        height={SPRITE_H}
        style={{
          imageRendering: 'pixelated',
        }}
        priority
        unoptimized
      />
    </motion.div>
  );
}
