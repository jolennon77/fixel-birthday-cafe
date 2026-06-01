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
    // 오브젝트마다 position, interactPositions, label 직접 작성
];

export const PLAYER_START = { x: 8, y: 7 };