import type { Tile, TileObject } from '@/types';

export const MAP_COLS = 20;
export const MAP_ROWS = 14;
export const TILE_SIZE = 48;

const W  = (id?: string): Tile => ({ type: 'wall',         walkable: false, objectId: id });
const F  = ():             Tile => ({ type: 'floor',        walkable: true  });
const R  = ():             Tile => ({ type: 'floor_rug',    walkable: true  });
const FP = ():             Tile => ({ type: 'floor_party',  walkable: true  });
const K  = (id?: string): Tile => ({ type: 'counter',      walkable: false, objectId: id });
const C  = (id?: string): Tile => ({ type: 'cake',         walkable: false, objectId: id });
const FR = (id?: string): Tile => ({ type: 'frame',        walkable: false, objectId: id });
const TR = (id?: string): Tile => ({ type: 'tree',         walkable: false, objectId: id });
const G  = (id?: string): Tile => ({ type: 'goods',        walkable: false, objectId: id });
const GA = (id?: string): Tile => ({ type: 'gacha',        walkable: false, objectId: id });
const BL = (id?: string): Tile => ({ type: 'billboard',    walkable: false, objectId: id });
const JK = (id?: string): Tile => ({ type: 'jukebox',      walkable: false, objectId: id });
const PB = (id?: string): Tile => ({ type: 'photobooth',   walkable: false, objectId: id });
const MB = (id?: string): Tile => ({ type: 'menu_board',   walkable: false, objectId: id });
const LB = (id?: string): Tile => ({ type: 'letter_board', walkable: false, objectId: id });
const TA = ():             Tile => ({ type: 'table',        walkable: false });
const PL = ():             Tile => ({ type: 'plant',        walkable: false });
const SF = ():             Tile => ({ type: 'sofa',         walkable: false });
const D  = ():             Tile => ({ type: 'door',         walkable: true  });

export const MAP_LAYOUT: Tile[][] = [
  // Row 0
  [W(), W(), W(), W(), W(), W(), W(), W(), W(), W(), W(), W(), W(), W(), W(), W(), W(), W(), W(), W()],
  // Row 1 — 액자(1,3,5,7,9) + 전광판(12-16)
  [W(), FR('frame-1'), W(), FR('frame-2'), W(), FR('frame-3'), W(), FR('frame-4'), W(), FR('frame-5'), W(), W(),
   BL('billboard'), BL('billboard'), BL('billboard'), BL('billboard'), BL('billboard'), W(), W(), W()],
  // Row 2
  [W(), F(), F(), F(), F(), F(), F(), F(), F(), F(), F(), F(), F(), F(), F(), F(), F(), F(), F(), W()],
  // Row 3 — 화분(1, 18)
  [W(), PL(), F(), R(), R(), R(), R(), R(), F(), F(), F(), F(), R(), R(), R(), R(), R(), F(), PL(), W()],
  // Row 4 — 케이크 / 굿즈 / 가챠
  [W(), F(), F(), R(), C('cake'), R(), R(), R(), F(), F(), F(), F(), R(), G('goods'), G('goods'), G('goods'), GA('gacha'), F(), F(), W()],
  // Row 5
  [W(), F(), F(), R(), R(), F(), R(), R(), F(), F(), F(), F(), R(), R(), R(), R(), R(), F(), F(), W()],
  // Row 6 — 화분(1) / 레터보드(12) / 주크박스(18)
  [W(), PL(), F(), F(), F(), F(), F(), F(), F(), F(), F(), F(), LB('letter'), F(), F(), F(), F(), F(), JK('jukebox'), W()],
  // Row 7 — 방명록 나무(1) / 파티 플로어(9-16) / 테이블(10)
  [W(), TR('tree'), F(), F(), F(), F(), F(), F(), F(), FP(), TA(), FP(), FP(), FP(), FP(), FP(), FP(), F(), F(), W()],
  // Row 8 — 소파(3-4) / 파티 플로어(9-16) / 테이블(13) / 포토부스(18)
  [W(), F(), F(), SF(), SF(), F(), F(), F(), F(), FP(), FP(), FP(), FP(), TA(), FP(), FP(), FP(), F(), PB('photobooth'), W()],
  // Row 9 — 파티 플로어(9-16) / 포토부스(18)
  [W(), F(), F(), F(), F(), F(), F(), F(), F(), FP(), FP(), FP(), FP(), FP(), FP(), FP(), FP(), F(), PB('photobooth'), W()],
  // Row 10 — 화분(18)
  [W(), F(), F(), F(), F(), F(), F(), F(), F(), F(), F(), F(), F(), F(), F(), F(), F(), F(), PL(), W()],
  // Row 11 — NPC(2) + 카운터 + 메뉴판(7)
  [W(), K(), K('npc'), K(), K(), K(), K(), MB('menu'), F(), F(), F(), F(), F(), F(), F(), F(), F(), F(), F(), W()],
  // Row 12
  [W(), F(), F(), F(), F(), F(), F(), F(), F(), F(), F(), F(), F(), F(), F(), F(), F(), F(), F(), W()],
  // Row 13 — 문(9-10)
  [W(), W(), W(), W(), W(), W(), W(), W(), W(), D(), D(), W(), W(), W(), W(), W(), W(), W(), W(), W()],
];

export const TILE_OBJECTS: TileObject[] = [
  { id: 'frame-1', type: 'frame', position: { x: 1, y: 1 }, interactPositions: [{ x: 1, y: 2 }], label: '📷 사진 보기' },
  { id: 'frame-2', type: 'frame', position: { x: 3, y: 1 }, interactPositions: [{ x: 3, y: 2 }], label: '📷 사진 보기' },
  { id: 'frame-3', type: 'frame', position: { x: 5, y: 1 }, interactPositions: [{ x: 5, y: 2 }], label: '📷 사진 보기' },
  { id: 'frame-4', type: 'frame', position: { x: 7, y: 1 }, interactPositions: [{ x: 7, y: 2 }], label: '📷 사진 보기' },
  { id: 'frame-5', type: 'frame', position: { x: 9, y: 1 }, interactPositions: [{ x: 9, y: 2 }], label: '📷 사진 보기' },
  {
    id: 'billboard', type: 'billboard', position: { x: 14, y: 1 },
    interactPositions: [{ x: 12,y:2},{x:13,y:2},{x:14,y:2},{x:15,y:2},{x:16,y:2}],
    label: '📺 전광판 보기',
  },
  {
    id: 'cake', type: 'cake', position: { x: 4, y: 4 },
    interactPositions: [{ x: 3, y: 4 }, { x: 5, y: 4 }, { x: 4, y: 5 }],
    label: '🕯️ 소원 빌기',
  },
  {
    id: 'goods', type: 'goods', position: { x: 14, y: 4 },
    interactPositions: [{ x: 13, y: 5 }, { x: 14, y: 5 }, { x: 15, y: 5 }],
    label: '🛍️ 굿즈 보기',
  },
  {
    id: 'gacha', type: 'gacha', position: { x: 16, y: 4 },
    interactPositions: [{ x: 15, y: 4 }, { x: 16, y: 5 }],
    label: '🎰 캡슐 뽑기',
  },
  // 생일 레터 보드 — 파티존 입구
  {
    id: 'letter', type: 'letter_board', position: { x: 12, y: 6 },
    interactPositions: [
      { x: 11, y: 6 }, { x: 12, y: 7 }, { x: 13, y: 6 },
    ],
    label: '💌 생일 편지 보기',
  },
  {
    id: 'jukebox', type: 'jukebox', position: { x: 18, y: 6 },
    interactPositions: [{ x: 17, y: 6 }, { x: 18, y: 7 }],
    label: '🎵 음악 선택',
  },
  {
    id: 'tree', type: 'tree', position: { x: 1, y: 7 },
    interactPositions: [{ x: 2, y: 7 }],
    label: '🌳 방명록 나무',
  },
  {
    id: 'photobooth', type: 'photobooth', position: { x: 18, y: 8 },
    interactPositions: [{ x: 17, y: 8 }, { x: 17, y: 9 }],
    label: '📸 포토부스',
  },
  {
    id: 'npc', type: 'npc', position: { x: 2, y: 11 },
    interactPositions: [{ x: 2, y: 12 }],
    label: '💬 말 걸기',
  },
  {
    id: 'menu', type: 'menu_board', position: { x: 7, y: 11 },
    interactPositions: [{ x: 7, y: 12 }],
    label: '📋 메뉴 보기',
  },
  {
    id: 'counter', type: 'counter', position: { x: 4, y: 11 },
    interactPositions: [{ x: 3, y: 12 }, { x: 4, y: 12 }, { x: 5, y: 12 }],
    label: '💌 초대장 보기',
  },
];

export const PLAYER_START = { x: 9, y: 12 };
