'use client';

import React from 'react';
import { MAP_LAYOUT, MAP_COLS, MAP_ROWS } from '@/data/mapLayout';

interface TileMapProps {
  tileSize: number;
}

export function TileMap({ tileSize }: TileMapProps) {
  return (
    <div
      className="relative"
      style={{
        backgroundImage:     'url(/cafe-bg.webp)',
        backgroundSize:      '100% 100%',
        backgroundRepeat:    'no-repeat',
        imageRendering:      'pixelated',
        display:             'grid',
        gridTemplateColumns: `repeat(${MAP_COLS}, ${tileSize}px)`,
        gridTemplateRows:    `repeat(${MAP_ROWS}, ${tileSize}px)`,
        width:  MAP_COLS * tileSize,
        height: MAP_ROWS * tileSize,
      }}
    >
      {MAP_LAYOUT.map((row, y) =>
        row.map((_, x) => (
          <div key={`${x},${y}`} style={{ width: tileSize, height: tileSize }} />
        ))
      )}
    </div>
  );
}
