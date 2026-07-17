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
  // 뷰포트 컨테이너의 실제 픽셀 크기. CSS `vh` 대신 JS로 측정한 값을 그대로
  // 인라인 스타일에 써서, tileSize 계산에 쓰인 값과 실제 렌더 크기가 항상 일치하게 한다.
  // (모바일 브라우저는 주소창 표시/숨김에 따라 CSS 100vh와 window.innerHeight가
  //  서로 달라질 수 있고, 그 오차가 스크롤 중심 계산에 그대로 반영돼 화면이
  //  타일 하나 정도 밀려 보이는 원인이었다.)
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  // 화면 전체(바깥 래퍼)도 CSS vw/vh 대신 JS로 측정한 값을 그대로 써서,
  // 바깥 래퍼(100vh)와 안쪽 뷰포트가 서로 다른 기준으로 어긋나는 일이 없게 한다.
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const calc = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const mobile    = Math.min(vw, vh) < MOBILE_BREAKPOINT;
      const landscape = vw > vh;
      setIsMobile(mobile);
      setIsLandscape(landscape);
      setScreenSize({ width: vw, height: vh });

      const dpadReserve = mobile ? (landscape ? 16 : 160) : 0;
      const availableH  = vh - dpadReserve;
      setViewport({ width: vw, height: availableH });

      if (mobile) {
        const maxTileW = Math.floor((vw - 8) / MAP_COLS);
        const maxTileH = Math.floor(availableH / MAP_ROWS);
        setTileSize(Math.max(24, Math.min(maxTileW, maxTileH)));
      } else {
        const maxTileW = Math.floor((vw * 0.9) / MAP_COLS);
        const maxTileH = Math.floor((availableH * 0.9) / MAP_ROWS);
        setTileSize(Math.max(32, Math.min(TILE_SIZE, maxTileW, maxTileH)));
      }
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  return { tileSize, isMobile, isLandscape, viewport, screenSize };
}

export function CafeScene() {
  const { position, direction, activeModal, move, triggerInteraction, playerInfo } =
    useCafeStore();
  const { tileSize, isMobile, viewport, screenSize } = useTileSize();
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
    <div
      className="relative bg-stone-900 overflow-hidden flex items-start justify-center"
      style={{
        width:  screenSize.width  ? `${screenSize.width}px`  : '100vw',
        height: screenSize.height ? `${screenSize.height}px` : '100vh',
      }}
    >
      <div
        ref={viewportRef}
        className="relative overflow-hidden"
        style={{
          width:  viewport.width  ? `${viewport.width}px`  : '100vw',
          height: viewport.height ? `${viewport.height}px` : '100vh',
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
