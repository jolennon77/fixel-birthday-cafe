'use client';

import { create } from 'zustand';
import type { Direction, ModalType, ObjectType, Position, PlayerInfo, AmbientNpcConfig } from '@/types';
import { MAP_LAYOUT, TILE_OBJECTS, PLAYER_START, MAP_COLS, MAP_ROWS } from '@/data/mapLayout';
import { AMBIENT_NPC_CONFIGS } from '@/data/ambientNpcs';

interface NearbyObject {
  objectId: string;
  objectType: ObjectType;
  label: string;
}

interface CafeState {
  playerInfo: PlayerInfo | null;
  setPlayerInfo: (info: PlayerInfo) => void;

  position: Position;
  direction: Direction;
  isMoving: boolean;

  nearbyObject: NearbyObject | null;
  nearbyNpc: AmbientNpcConfig | null;
  activeBubbleNpcId: string | null; // 말풍선 표시 중인 NPC id
  activeModal: ModalType;

  candleBlown: boolean;
  currentBgmId: string | null;

  npcPositions: Record<string, Position>;

  move: (dir: Direction) => void;
  setMoving: (moving: boolean) => void;
  openModal: (modal: NonNullable<ModalType>) => void;
  closeModal: () => void;
  blowCandle: () => void;
  setCurrentBgm: (id: string | null) => void;
  triggerInteraction: () => void;
  closeBubble: () => void;
  syncNpcPosition: (id: string, pos: Position) => void;
  resetPosition: () => void;
}

function isWalkable(x: number, y: number): boolean {
  if (x < 0 || y < 0 || x >= MAP_COLS || y >= MAP_ROWS) return false;
  return MAP_LAYOUT[y][x].walkable;
}

function getNearbyObject(pos: Position): NearbyObject | null {
  for (const obj of TILE_OBJECTS) {
    const hit = obj.interactPositions.some(
      (ip) => ip.x === pos.x && ip.y === pos.y
    );
    if (hit) return { objectId: obj.id, objectType: obj.type, label: obj.label };
  }
  return null;
}

function getNearbyNpc(
  pos: Position,
  npcPositions: Record<string, Position>
): AmbientNpcConfig | null {
  for (const [id, npcPos] of Object.entries(npcPositions)) {
    const dx = Math.abs(npcPos.x - pos.x);
    const dy = Math.abs(npcPos.y - pos.y);
    if (dx + dy === 1) {
      return AMBIENT_NPC_CONFIGS.find((c) => c.id === id) ?? null;
    }
  }
  return null;
}

const MODAL_MAP: Record<string, NonNullable<ModalType>> = {
  frame:       'gallery',
  letter_tree: 'guestbook',
  photobooth:  'photobooth',
  jukebox:     'jukebox',
  cake:        'candle',
  goods:       'goods',
  gacha:       'gacha',
  billboard:   'billboard',
};

export const useCafeStore = create<CafeState>()((set, get) => ({
  playerInfo: null,
  setPlayerInfo: (info) => set({ playerInfo: info }),

  position: PLAYER_START,
  direction: 'down',
  isMoving: false,
  nearbyObject: getNearbyObject(PLAYER_START),
  nearbyNpc: null,
  activeBubbleNpcId: null,
  activeModal: null,
  candleBlown: false,
  currentBgmId: null,
  npcPositions: {},

  move: (dir: Direction) => {
    const { position, npcPositions } = get();
    const delta: Record<Direction, Position> = {
      up:    { x: 0,  y: -1 },
      down:  { x: 0,  y:  1 },
      left:  { x: -1, y:  0 },
      right: { x:  1, y:  0 },
    };
    const next = {
      x: position.x + delta[dir].x,
      y: position.y + delta[dir].y,
    };
    const npcBlocking = Object.values(npcPositions).some(
      (p) => p.x === next.x && p.y === next.y
    );
    if (!isWalkable(next.x, next.y) || npcBlocking) {
      set({ direction: dir });
      return;
    }
    set({
      position:     next,
      direction:    dir,
      isMoving:     true,
      nearbyObject: getNearbyObject(next),
      nearbyNpc:    getNearbyNpc(next, npcPositions),
      activeBubbleNpcId: null, // 이동하면 말풍선 닫기
    });
  },

  setMoving: (moving) => set({ isMoving: moving }),
  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),
  blowCandle: () => set({ candleBlown: true }),
  setCurrentBgm: (id) => set({ currentBgmId: id }),
  closeBubble: () => set({ activeBubbleNpcId: null }),

  triggerInteraction: () => {
    const { nearbyNpc, nearbyObject, activeBubbleNpcId, openModal } = get();
    // 말풍선이 열려있으면 닫기
    if (activeBubbleNpcId) {
      set({ activeBubbleNpcId: null });
      return;
    }
    // 방문객 NPC 말풍선
    if (nearbyNpc) {
      set({ activeBubbleNpcId: nearbyNpc.id });
      return;
    }
    if (nearbyObject) {
      const modal = MODAL_MAP[nearbyObject.objectType];
      if (modal) openModal(modal);
    }
  },

  syncNpcPosition: (id, pos) => {
    const prev = get().npcPositions;
    const next = { ...prev, [id]: pos };
    const nearbyNpc = getNearbyNpc(get().position, next);
    set({ npcPositions: next, nearbyNpc });
  },

  resetPosition: () =>
    set({ position: PLAYER_START, nearbyObject: getNearbyObject(PLAYER_START) }),
}));
