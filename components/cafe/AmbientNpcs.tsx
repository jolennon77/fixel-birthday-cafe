'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAmbientNpcs } from '@/hooks/useAmbientNpcs';
import { useCafeStore } from '@/store/cafeStore';
import type { Direction } from '@/types';

const DIR_ROTATE: Record<Direction, number> = {
  up: 180, down: 0, left: -90, right: 90,
};

interface AmbientNpcsProps {
  tileSize: number;
}

export function AmbientNpcs({ tileSize }: AmbientNpcsProps) {
  const npcs              = useAmbientNpcs();
  const syncNpcPosition   = useCafeStore((s) => s.syncNpcPosition);
  const nearbyNpc         = useCafeStore((s) => s.nearbyNpc);
  const activeBubbleNpcId = useCafeStore((s) => s.activeBubbleNpcId);

  useEffect(() => {
    npcs.forEach((npc) => syncNpcPosition(npc.id, npc.position));
  }, [npcs, syncNpcPosition]);

  return (
    <>
      {npcs.map((npc) => {
        const isNearby     = nearbyNpc?.id === npc.id;
        const showBubble   = activeBubbleNpcId === npc.id;

        return (
          <motion.div
            key={npc.id}
            className="absolute flex flex-col items-center pointer-events-none z-10"
            style={{ width: tileSize, height: tileSize }}
            animate={{
              left: npc.position.x * tileSize,
              top:  npc.position.y * tileSize,
            }}
            transition={{ type: 'tween', duration: 0.4, ease: 'linear' }}
          >
            {/* 말풍선 */}
            <AnimatePresence>
              {showBubble && (
                <motion.div
                  key="bubble"
                  initial={{ opacity: 0, y: 4, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  className="absolute z-20 flex justify-center"
                  style={{ bottom: tileSize + 6, left: 0, width: '100%' }}
                >
                  <div
                    className="relative bg-white text-stone-800 rounded-xl shadow-lg border border-stone-200 font-medium whitespace-nowrap"
                    style={{
                      fontSize: Math.max(9, tileSize * 0.22),
                      padding: `${tileSize * 0.12}px ${tileSize * 0.25}px`,
                    }}
                  >
                    {npc.dialogue}
                    {/* 말풍선 꼬리 */}
                    <span
                      className="absolute left-1/2 -translate-x-1/2 w-0 h-0"
                      style={{
                        bottom: -6,
                        borderLeft: '6px solid transparent',
                        borderRight: '6px solid transparent',
                        borderTop: '6px solid white',
                        filter: 'drop-shadow(0 1px 0 rgb(214 211 209 / 0.8))',
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 왕관 (생일 당사자 전용) */}
            {npc.isBirthday && (
              <div
                className="absolute flex justify-center pointer-events-none"
                style={{ left: 0, width: '100%', top: tileSize * 0.02 }}
              >
                <motion.span
                  style={{ fontSize: tileSize * 0.32, lineHeight: 1 }}
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                >
                  👑
                </motion.span>
              </div>
            )}

            {/* 말 걸기 인디케이터 (말풍선 없을 때만) */}
            {isNearby && !showBubble && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap"
                style={{ fontSize: Math.max(8, tileSize * 0.2) }}
              >
                💬
              </motion.div>
            )}

            {/* 캐릭터 */}
            <motion.span
              style={{
                fontSize: tileSize * 0.62,
                lineHeight: 1,
                filter: npc.isBirthday
                  ? 'hue-rotate(310deg) saturate(3) brightness(1.15)'
                  : npc.gender === 'female'
                    ? 'hue-rotate(280deg) saturate(2)'
                    : undefined,
              }}
              animate={{ rotate: DIR_ROTATE[npc.direction] }}
              transition={{ duration: 0.15 }}
            >
              🐱
            </motion.span>

            {/* 이름 태그 */}
            {tileSize >= 36 && (
              <div
                className={[
                  'absolute -bottom-4 left-1/2 -translate-x-1/2',
                  'rounded-full px-1.5 whitespace-nowrap shadow-sm transition-colors font-semibold',
                  isNearby
                    ? 'bg-amber-300/90 text-stone-900'
                    : npc.isBirthday
                      ? 'bg-pink-300/90 text-stone-900'
                      : 'bg-white/80 text-stone-700',
                ].join(' ')}
                style={{ fontSize: Math.max(7, tileSize * 0.17) }}
              >
                {npc.name}
              </div>
            )}
          </motion.div>
        );
      })}
    </>
  );
}
