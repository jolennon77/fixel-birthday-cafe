'use client';

import { useState, useEffect } from 'react';
import type { AmbientNpcState, Direction, Position } from '@/types';
import { AMBIENT_NPC_CONFIGS } from '@/data/ambientNpcs';

function calcDirection(from: Position, to: Position): Direction {
  if (to.y < from.y) return 'up';
  if (to.y > from.y) return 'down';
  if (to.x < from.x) return 'left';
  return 'right';
}

const INITIAL_STATE: AmbientNpcState[] = AMBIENT_NPC_CONFIGS.map((cfg) => ({
  ...cfg,
  position:    cfg.waypoints[0],
  direction:   'down' as Direction,
  waypointIdx: 0,
}));

const MOVE_INTERVAL = 6000; // NPC 이동 간격 (ms) — 느리게 해서 말걸기 편하게
const OFFSETS       = [0, 2000, 4000]; // 각 NPC 출발 딜레이

export function useAmbientNpcs(): AmbientNpcState[] {
  const [npcs, setNpcs] = useState<AmbientNpcState[]>(INITIAL_STATE);

  useEffect(() => {
    const timeoutIds: ReturnType<typeof setTimeout>[] = [];
    const intervalIds: ReturnType<typeof setInterval>[] = [];

    AMBIENT_NPC_CONFIGS.forEach((_, i) => {
      const tId = setTimeout(() => {
        const iId = setInterval(() => {
          setNpcs((prev) =>
            prev.map((npc, idx) => {
              if (idx !== i) return npc;
              const nextIdx = (npc.waypointIdx + 1) % npc.waypoints.length;
              const nextPos  = npc.waypoints[nextIdx];
              return {
                ...npc,
                position:    nextPos,
                direction:   calcDirection(npc.position, nextPos),
                waypointIdx: nextIdx,
              };
            })
          );
        }, MOVE_INTERVAL);
        intervalIds.push(iId);
      }, OFFSETS[i] ?? 0);
      timeoutIds.push(tId);
    });

    return () => {
      timeoutIds.forEach(clearTimeout);
      intervalIds.forEach(clearInterval);
    };
  }, []);

  return npcs;
}
