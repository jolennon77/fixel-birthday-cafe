'use client';

import { motion } from 'framer-motion';
import type { Direction, Position, CharacterGender } from '@/types';

const DIR_ROTATE: Record<Direction, number> = {
  up: 180, down: 0, left: -90, right: 90,
};

interface CharacterProps {
  position: Position;
  direction: Direction;
  tileSize: number;
  gender: CharacterGender;
}

export function Character({ position, direction, tileSize, gender }: CharacterProps) {
  return (
    <motion.div
      className="absolute flex items-center justify-center pointer-events-none z-10"
      style={{ width: tileSize, height: tileSize }}
      animate={{
        left: position.x * tileSize,
        top:  position.y * tileSize,
      }}
      transition={{ type: 'tween', duration: 0.12, ease: 'linear' }}
    >
      <motion.span
        style={{
          fontSize: tileSize * 0.7,
          lineHeight: 1,
          display: 'block',
          // 여자 캐릭터: 분홍 색조
          filter: gender === 'female' ? 'hue-rotate(280deg) saturate(2)' : undefined,
        }}
        animate={{ rotate: DIR_ROTATE[direction] }}
        transition={{ duration: 0.1 }}
      >
        🐱
      </motion.span>
    </motion.div>
  );
}
