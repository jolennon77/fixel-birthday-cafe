import type { AmbientNpcConfig } from '@/types';

export const AMBIENT_NPC_CONFIGS: AmbientNpcConfig[] = [
  {
    id: 'birthday-nami',
    name: '나미',
    gender: 'female',
    isBirthday: true,
    waypoints: [
      { x: 9, y: 10 },
      { x: 10, y: 10 },
    ],
    dialogue: '어머나, 이걸 다 준비해줬어?! 너무 감동이야 🥹💛 정말 고마워!',
  },
  {
    id: 'visitor-1',
    name: '지아',
    gender: 'female',
    waypoints: [
      { x: 7, y: 10 },
      { x: 7, y: 11 },
      { x: 9, y: 11 },
      { x: 9, y: 10 },
    ],
    dialogue: '나미 사진 진짜 예쁘다~ 이 카페 분위기 완벽해! ✨',
  },
  {
    id: 'visitor-2',
    name: '현우',
    gender: 'male',
    waypoints: [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 12, y: 11 },
      { x: 12, y: 10 },
    ],
    dialogue: '생일카페 처음인데 분위기 대박... 굿즈 다 사고 싶다!',
  },
  {
    id: 'visitor-3',
    name: '소연',
    gender: 'female',
    waypoints: [
      { x: 13, y: 10 },
      { x: 13, y: 11 },
      { x: 14, y: 11 },
      { x: 14, y: 10 },
    ],
    dialogue: '나미 오늘 얼마나 행복할까~ 생각만 해도 기분 좋아 💛',
  },
];
