'use client';

import React, { useMemo } from 'react';
import { MAP_LAYOUT, MAP_COLS, MAP_ROWS, TILE_OBJECTS } from '@/data/mapLayout';
import { BIRTHDAY_DATE } from '@/data/config';
import type { Position } from '@/types';

const TILE_STYLES: Record<string, string> = {
  floor:       'bg-amber-50',
  floor_rug:   'bg-orange-100',
  wall:        'bg-stone-700',
  wall_top:    'bg-stone-600',
  counter:     'bg-amber-700',
  cake:        'bg-pink-200',
  frame:       'bg-yellow-200 border-2 border-amber-500',
  tree:        'bg-green-700',
  goods:       'bg-purple-100 border-2 border-purple-400',
  gacha:       'bg-red-100 border-2 border-red-400',
  billboard:   'bg-stone-900 border border-green-500',
  jukebox:     'bg-indigo-100 border-2 border-indigo-400',
  photobooth:  'bg-sky-100 border-2 border-sky-400',
  menu_board:  'bg-emerald-800',
  floor_party: 'bg-pink-50',
  letter_board:'bg-rose-300 border-2 border-rose-500',
  table:       'bg-amber-200 border-2 border-amber-400',
  plant:       'bg-green-100 border border-green-400',
  sofa:        'bg-rose-100 border-2 border-rose-300',
  door:        'bg-amber-300',
  empty:       'bg-transparent',
};

const OBJECT_TYPE_EMOJI: Record<string, string> = {
  frame:      '🖼',
  counter:    '☕',
  cake:       '🎂',
  tree:       '🌳',
  goods:      '🛍',
  gacha:      '🎰',
  billboard:  '',
  jukebox:    '🎵',
  photobooth: '📸',
  npc:          '🧑‍🍳',
  menu_board:   '📋',
  letter_board: '💌',
  door:         '🚪',
};

// 타일 타입으로 직접 렌더링되는 장식 이모지 (objectId 없는 순수 장식 타일)
const DECO_TILE_EMOJI: Record<string, string> = {
  table: '🫖',
  plant: '🪴',
  sofa:  '🛋',
};

const BILLBOARD_CENTER_X = 14;
const BILLBOARD_ROW      = 1;

function getDaysLeft(): number {
  const diff = BIRTHDAY_DATE.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

interface TileMapProps {
  playerPosition: Position;
  tileSize: number;
}

export function TileMap({ playerPosition, tileSize }: TileMapProps) {
  // position → emoji lookup (keyed by "x,y")
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
        display: 'grid',
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
          const isBillboardTile   = tile.type === 'billboard';
          const isBillboardCenter = isBillboardTile && x === BILLBOARD_CENTER_X && y === BILLBOARD_ROW;

          return (
            <div
              key={key}
              className={[
                TILE_STYLES[tile.type] ?? 'bg-gray-200',
                'flex items-center justify-center select-none overflow-hidden',
                tile.type !== 'billboard' ? 'border border-black/5' : '',
              ].join(' ')}
              style={{ width: tileSize, height: tileSize, fontSize: tileSize * 0.5 }}
            >
              {/* 전광판 중앙 인라인 카운트다운 */}
              {isBillboardCenter && tileSize >= 28 && (
                <div
                  className="text-green-400 font-pixel text-center leading-none"
                  style={{ fontSize: Math.max(6, tileSize * 0.22) }}
                >
                  {isBirthday ? '🎉HBD' : `D-${daysLeft}`}
                </div>
              )}

                  {/* 일반 오브젝트 이모지 (TILE_OBJECTS 등록된 것) */}
              {!isBillboardTile && emoji && !isPlayer && (
                <span style={{ lineHeight: 1 }}>{emoji}</span>
              )}

              {/* 장식 타일 이모지 (objectId 없는 순수 장식) */}
              {!isBillboardTile && !emoji && !isPlayer && DECO_TILE_EMOJI[tile.type] && (
                <span style={{ lineHeight: 1 }}>{DECO_TILE_EMOJI[tile.type]}</span>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
