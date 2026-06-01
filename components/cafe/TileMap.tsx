'use client';

import React, { useMemo } from 'react';
import { MAP_LAYOUT, MAP_COLS, MAP_ROWS, TILE_OBJECTS } from '@/data/mapLayout';
import { BIRTHDAY_DATE } from '@/data/config';
import type { Position } from '@/types';

const OBJECT_TYPE_EMOJI: Record<string, string> = {
  frame:       '🖼',
  letter_tree: '🌸',
  photobooth:  '📸',
  jukebox:     '🎵',
  cake:        '🎂',
  goods:       '🛍',
  gacha:       '🎰',
  billboard:   '',
  easter:      '✨',
};

function getDaysLeft(): number {
  const diff = BIRTHDAY_DATE.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

// 맵에서 billboard 타일 중앙 위치를 동적으로 계산
function findBillboardCenter(): { x: number; y: number } | null {
  const tiles: { x: number; y: number }[] = [];
  for (let y = 0; y < MAP_ROWS; y++) {
    for (let x = 0; x < MAP_COLS; x++) {
      if (MAP_LAYOUT[y][x].type === 'billboard') tiles.push({ x, y });
    }
  }
  if (tiles.length === 0) return null;
  return tiles[Math.floor(tiles.length / 2)];
}

const BILLBOARD_CENTER = findBillboardCenter();

interface TileMapProps {
  playerPosition: Position;
  tileSize: number;
}

export function TileMap({ playerPosition, tileSize }: TileMapProps) {
  const objectEmoji = useMemo(() => {
    const map: Record<string, string> = {};
    for (const obj of TILE_OBJECTS) {
      const key = `${obj.position.x},${obj.position.y}`;
      map[key] = OBJECT_TYPE_EMOJI[obj.type] ?? '';
    }
    return map;
  }, []);

  const isBirthday = Date.now() >= BIRTHDAY_DATE.getTime();
  const daysLeft   = getDaysLeft();

  return (
    <div
      className="relative"
      style={{
        backgroundImage:    'url(/cafe-bg.png)',
        backgroundSize:     '100% 100%',
        backgroundRepeat:   'no-repeat',
        imageRendering:     'pixelated',
        display:            'grid',
        gridTemplateColumns: `repeat(${MAP_COLS}, ${tileSize}px)`,
        gridTemplateRows:    `repeat(${MAP_ROWS}, ${tileSize}px)`,
        width:  MAP_COLS * tileSize,
        height: MAP_ROWS * tileSize,
      }}
    >
      {MAP_LAYOUT.map((row, y) =>
        row.map((tile, x) => {
          const key      = `${x},${y}`;
          const emoji    = objectEmoji[key];
          const isPlayer = playerPosition.x === x && playerPosition.y === y;
          const isBillboardCenter =
            BILLBOARD_CENTER?.x === x && BILLBOARD_CENTER?.y === y;

          return (
            <div
              key={key}
              className="relative flex items-center justify-center select-none overflow-hidden"
              style={{ width: tileSize, height: tileSize, fontSize: tileSize * 0.5 }}
            >
              {/* D-day 카운트다운 — 전광판 중앙 타일에 오버레이 */}
              {isBillboardCenter && tileSize >= 28 && (
                <div
                  className="text-green-400 font-pixel text-center leading-none pointer-events-none"
                  style={{ fontSize: Math.max(6, tileSize * 0.22) }}
                >
                  {isBirthday ? '🎉HBD' : `D-${daysLeft}`}
                </div>
              )}

              {/* 오브젝트 이모지 (TILE_OBJECTS 등록 후 표시) */}
              {!isBillboardCenter && emoji && !isPlayer && (
                <span className="pointer-events-none" style={{ lineHeight: 1 }}>
                  {emoji}
                </span>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
