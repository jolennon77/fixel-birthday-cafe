// ──────────────────────────────────────────────────────────
// 맵 에디터에서 자동 생성 — 오브젝트 TILE_OBJECTS는 직접 작성
// ──────────────────────────────────────────────────────────
import type { Tile, TileObject } from '@/types';

export const MAP_COLS = 16;
export const MAP_ROWS = 12;
export const TILE_SIZE = 48;

const F  = ():             Tile => ({ type: 'floor',        walkable: true  });
const X  = ():             Tile => ({ type: 'blocked',      walkable: false });
const BL = (id?: string): Tile => ({ type: 'billboard',    walkable: false, objectId: id });
const FR = (id?: string): Tile => ({ type: 'frame',        walkable: false, objectId: id });
const LT = (id?: string): Tile => ({ type: 'letter_tree',  walkable: false, objectId: id });
const PB = (id?: string): Tile => ({ type: 'photobooth',   walkable: false, objectId: id });
const JK = (id?: string): Tile => ({ type: 'jukebox',      walkable: false, objectId: id });
const CK = (id?: string): Tile => ({ type: 'cake',         walkable: false, objectId: id });
const GD = (id?: string): Tile => ({ type: 'goods',        walkable: false, objectId: id });
const GA = (id?: string): Tile => ({ type: 'gacha',        walkable: false, objectId: id });
const E  = (id?: string): Tile => ({ type: 'easter',       walkable: true,  objectId: id });

export const MAP_LAYOUT: Tile[][] = [
    [X(), X(), X(), X(), X(), X(), X(), X(), X(), X(), X(), X(), X(), X(), X(), X()],  // Row 0
    [X(), X(), X(), X(), X(), X(), BL('billboard'), BL('billboard'), BL('billboard'), BL('billboard'), FR('frame-1'), FR('frame-2'), FR('frame-3'), FR('frame-4'), FR('frame-5'), X()],  // Row 1
    [X(), X(), X(), X(), X(), X(), BL('billboard'), BL('billboard'), BL('billboard'), BL('billboard'), FR('frame-6'), FR('frame-7'), FR('frame-8'), FR('frame-9'), FR('frame-10'), X()],  // Row 2
    [X(), X(), X(), X(), X(), X(), F(), F(), F(), F(), F(), F(), F(), F(), F(), X()],  // Row 3
    [X(), LT('letter-tree'), LT('letter-tree'), LT('letter-tree'), F(), F(), F(), F(), F(), F(), F(), F(), PB('photobooth'), PB('photobooth'), PB('photobooth'), X()],  // Row 4
    [X(), LT('letter-tree'), LT('letter-tree'), LT('letter-tree'), F(), F(), X(), X(), F(), F(), F(), F(), PB('photobooth'), PB('photobooth'), PB('photobooth'), X()],  // Row 5
    [X(), LT('letter-tree'), LT('letter-tree'), LT('letter-tree'), F(), F(), X(), X(), F(), F(), F(), F(), PB('photobooth'), PB('photobooth'), JK('jukebox'), X()],  // Row 6
    [X(), F(), F(), F(), F(), F(), X(), X(), F(), F(), F(), F(), F(), F(), JK('jukebox'), X()],  // Row 7
    [X(), X(), X(), X(), X(), F(), F(), F(), F(), F(), F(), GD('goods'), GD('goods'), F(), GA('gacha'), X()],  // Row 8
    [X(), X(), F(), F(), F(), F(), F(), CK('cake'), CK('cake'), F(), F(), GD('goods'), GD('goods'), F(), GA('gacha'), X()],  // Row 9
    [X(), X(), X(), X(), F(), F(), F(), CK('cake'), CK('cake'), F(), F(), F(), F(), F(), F(), X()],  // Row 10
    [X(), X(), X(), X(), X(), X(), X(), X(), X(), X(), X(), X(), X(), X(), X(), X()],  // Row 11
];

export const TILE_OBJECTS: TileObject[] = [
  {
    id: 'billboard',
    type: 'billboard',
    position: { x: 7, y: 1 },
    interactPositions: [
      { x: 6, y: 3 }, { x: 7, y: 3 }, { x: 8, y: 3 }, { x: 9, y: 3 },
    ],
    label: 'D-day 전광판',
  },
  {
    id: 'frame',
    type: 'frame',
    position: { x: 12, y: 1 },
    interactPositions: [
      { x: 10, y: 3 }, { x: 11, y: 3 }, { x: 12, y: 3 }, { x: 13, y: 3 }, { x: 14, y: 3 },
    ],
    label: '사진 갤러리',
  },
  {
    id: 'letter-tree',
    type: 'letter_tree',
    position: { x: 2, y: 5 },
    interactPositions: [
      { x: 4, y: 4 }, { x: 4, y: 5 }, { x: 4, y: 6 },
    ],
    label: '방명록 나무',
  },
  {
    id: 'photobooth',
    type: 'photobooth',
    position: { x: 13, y: 5 },
    interactPositions: [
      { x: 11, y: 4 }, { x: 11, y: 5 }, { x: 11, y: 6 },
      { x: 12, y: 7 },
    ],
    label: '포토부스',
  },
  {
    id: 'jukebox',
    type: 'jukebox',
    position: { x: 14, y: 6 },
    interactPositions: [
      { x: 13, y: 7 },
    ],
    label: '주크박스',
  },
  {
    id: 'cake',
    type: 'cake',
    position: { x: 7, y: 9 },
    interactPositions: [
      { x: 7, y: 8 }, { x: 8, y: 8 },
      { x: 6, y: 9 }, { x: 6, y: 10 },
      { x: 9, y: 9 }, { x: 9, y: 10 },
    ],
    label: '생일 케이크',
  },
  {
    id: 'goods',
    type: 'goods',
    position: { x: 11, y: 8 },
    interactPositions: [
      { x: 11, y: 7 }, { x: 12, y: 7 },
      { x: 10, y: 8 }, { x: 10, y: 9 },
      { x: 11, y: 10 }, { x: 12, y: 10 },
    ],
    label: '굿즈 매대',
  },
  {
    id: 'gacha',
    type: 'gacha',
    position: { x: 14, y: 8 },
    interactPositions: [
      { x: 13, y: 8 }, { x: 13, y: 9 },
      { x: 14, y: 10 },
    ],
    label: '캡슐 뽑기',
  },
];

export const PLAYER_START = { x: 8, y: 7 };