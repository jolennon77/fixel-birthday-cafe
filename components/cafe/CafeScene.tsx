'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useCafeStore } from '@/store/cafeStore';
import { useKeyboard } from '@/hooks/useKeyboard';
import { TileMap } from './TileMap';
import { Character } from './Character';
import { AmbientNpcs } from './AmbientNpcs';
import { VirtualDpad } from './VirtualDpad';
import { InteractionHint } from './InteractionHint';
import { PhotoGalleryModal } from '@/components/modals/PhotoGalleryModal';
import { GuestbookModal } from '@/components/modals/GuestbookModal';
import { CandleModal } from '@/components/modals/CandleModal';
import { GoodsModal } from '@/components/modals/GoodsModal';
import { BillboardModal } from '@/components/modals/BillboardModal';
import { JukeboxModal } from '@/components/modals/JukeboxModal';
import { GachaModal } from '@/components/modals/GachaModal';
import { PhotoBoothModal } from '@/components/modals/PhotoBoothModal';
import { MAP_COLS, MAP_ROWS, TILE_SIZE } from '@/data/mapLayout';

const MOBILE_BREAKPOINT = 768;

function useTileSize() {
  const [tileSize, setTileSize]       = useState(TILE_SIZE);
  const [isMobile, setIsMobile]       = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const calc = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const mobile    = Math.min(vw, vh) < MOBILE_BREAKPOINT;
      const landscape = vw > vh;
      setIsMobile(mobile);
      setIsLandscape(landscape);

      if (mobile) {
        const dpadReserve = landscape ? 16 : 160;
        const maxTileW = Math.floor((vw - 8) / MAP_COLS);
        const maxTileH = Math.floor((vh - dpadReserve) / MAP_ROWS);
        setTileSize(Math.max(24, Math.min(maxTileW, maxTileH)));
      } else {
        const maxTileW = Math.floor((vw * 0.9) / MAP_COLS);
        const maxTileH = Math.floor((vh * 0.9) / MAP_ROWS);
        setTileSize(Math.max(32, Math.min(TILE_SIZE, maxTileW, maxTileH)));
      }
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  return { tileSize, isMobile, isLandscape };
}

export function CafeScene() {
  const { position, direction, activeModal, move, triggerInteraction, playerInfo } =
    useCafeStore();
  const { tileSize, isMobile, isLandscape } = useTileSize();
  const viewportRef = useRef<HTMLDivElement>(null);

  useKeyboard({
    onMove: move,
    onInteract: triggerInteraction,
    disabled: activeModal !== null,
  });

  const scrollToPlayer = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const targetScrollLeft = position.x * tileSize - el.clientWidth / 2 + tileSize / 2;
    const targetScrollTop  = position.y * tileSize - el.clientHeight / 2 + tileSize / 2;
    el.scrollTo({
      left: Math.max(0, targetScrollLeft),
      top:  Math.max(0, targetScrollTop),
      behavior: 'smooth',
    });
  }, [position, tileSize]);

  useEffect(() => {
    scrollToPlayer();
  }, [scrollToPlayer]);

  const mapWidth  = MAP_COLS * tileSize;
  const mapHeight = MAP_ROWS * tileSize;

  return (
    <div className="relative w-screen h-screen bg-stone-900 overflow-hidden flex items-center justify-center">
      <div
        ref={viewportRef}
        className="relative overflow-hidden"
        style={{
          width: '100vw',
          height: isMobile && !isLandscape ? `calc(100vh - 160px)` : '100vh',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div
          className="relative"
          style={{ width: mapWidth, height: mapHeight, margin: '0 auto' }}
        >
          <TileMap tileSize={tileSize} />
          {/* <AmbientNpcs tileSize={tileSize} /> */}
          <Character
            position={position}
            direction={direction}
            tileSize={tileSize}
            gender={playerInfo?.gender ?? 'male'}
          />
        </div>
      </div>

      <InteractionHint />

      {isMobile && (
        <VirtualDpad
          onMove={move}
          onInteract={triggerInteraction}
          interactLabel={undefined}
        />
      )}

      <PhotoGalleryModal />
      <GuestbookModal />
      <CandleModal />
      <GoodsModal />
      <BillboardModal />
      <JukeboxModal />
      <GachaModal />
      <PhotoBoothModal />
    </div>
  );
}
