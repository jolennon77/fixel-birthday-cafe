import type { AmbientNpcConfig } from '@/types';

export const AMBIENT_NPC_CONFIGS: AmbientNpcConfig[] = [
  {
    id: 'visitor-1',
    name: '지아',
    gender: 'female',
    waypoints: [
      { x: 8, y: 7 },
      { x: 8, y: 8 },
      { x: 9, y: 8 },
      { x: 9, y: 7 },
    ],
    dialogue: '나미 사진 진짜 예쁘다~ 이 카페 분위기 완벽해! ✨',
  },
  {
    id: 'visitor-2',
    name: '현우',
    gender: 'male',
    waypoints: [
      { x: 11, y: 7 },
      { x: 12, y: 7 },
      { x: 12, y: 8 },
      { x: 11, y: 8 },
    ],
    dialogue: '생일카페 처음인데 분위기 대박... 굿즈 다 사고 싶다!',
  },
  {
    id: 'visitor-3',
    name: '소연',
    gender: 'female',
    waypoints: [
      { x: 15, y: 8 },
      { x: 16, y: 8 },
      { x: 16, y: 9 },
      { x: 15, y: 9 },
    ],
    dialogue: '나미 오늘 얼마나 행복할까~ 생각만 해도 기분 좋아 💛',
  },
];
