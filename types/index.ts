export type Direction = 'up' | 'down' | 'left' | 'right';

export type TileType =
  | 'floor'
  | 'blocked'
  | 'billboard'
  | 'frame'
  | 'letter_tree'
  | 'photobooth'
  | 'jukebox'
  | 'cake'
  | 'goods'
  | 'gacha'
  | 'easter'
  // legacy (이전 맵 호환)
  | 'floor_rug'
  | 'floor_party'
  | 'wall'
  | 'wall_top'
  | 'counter'
  | 'tree'
  | 'menu_board'
  | 'letter_board'
  | 'table'
  | 'plant'
  | 'sofa'
  | 'door'
  | 'empty';

export interface AmbientNpcConfig {
  id: string;
  name: string;
  gender: CharacterGender;
  waypoints: Position[];
  dialogue: string;
  isBirthday?: boolean;
}

export interface AmbientNpcState extends AmbientNpcConfig {
  position: Position;
  direction: Direction;
  waypointIdx: number;
}

export type ModalType =
  | 'gallery'
  | 'receipt'
  | 'guestbook'
  | 'candle'
  | 'goods'
  | 'billboard'
  | 'npc'
  | 'jukebox'
  | 'photobooth'
  | 'gacha'
  | 'menu'
  | 'letter'
  | null;

export type ObjectType =
  | 'frame'
  | 'letter_tree'
  | 'photobooth'
  | 'jukebox'
  | 'cake'
  | 'goods'
  | 'gacha'
  | 'billboard'
  | 'easter'
  // legacy
  | 'counter'
  | 'tree'
  | 'npc'
  | 'menu_board'
  | 'letter_board';

export type CharacterGender = 'male' | 'female';

export interface PlayerInfo {
  nickname: string;
  gender: CharacterGender;
}

export interface Position {
  x: number;
  y: number;
}

export interface TileObject {
  id: string;
  type: ObjectType;
  position: Position;
  interactPositions: Position[]; // tiles from which player can interact
  label: string;
}

export interface Tile {
  type: TileType;
  objectId?: string; // references TileObject.id
  walkable: boolean;
}

export interface GuestbookEntry {
  id: string;
  message: string;
  author?: string;
  color: string; // post-it color
  created_at: string;
}

export interface AudioTrack {
  id: string;
  src: string;
  loop?: boolean;
  volume?: number;
}
