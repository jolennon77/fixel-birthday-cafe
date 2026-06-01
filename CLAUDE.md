@AGENTS.md

# 나미 생일카페 프로젝트

친구 나미(생일 2026-07-19)를 위한 가상 생일카페 웹페이지.
2D 탑다운 RPG 스타일 타일맵 인터랙티브 경험.

## 커스터마이징 진입점

모든 텍스트 콘텐츠는 `data/config.ts` 한 곳에서 관리한다:
- 이름, 생일 날짜, NPC 이름, NPC 대사, 굿즈 목록, 메뉴판, BGM 트랙, 가챠 메시지

맵 구조 변경은 `data/mapLayout.ts`, NPC 대사/위치는 `data/ambientNpcs.ts`.

## 구현된 기능 (오브젝트 → 모달)

| 오브젝트 | 위치 | 모달 | 내용 |
|---|---|---|---|
| frame | (17,1)(18,1)(19,1) — 3개 | gallery | 사진 갤러리 |
| counter | (3,1) | receipt | 영수증 스타일 축하 카드 |
| tree | (2,7) | guestbook | 방명록 (리본 달기) |
| cake | (4,4) | candle | 마이크로 촛불 불기 (Web Audio) |
| goods | (13-15,4) | goods | 가상 굿즈 구경 |
| billboard | (12-16,1) | billboard | D-day 카운트다운 |
| npc (counter staff) | (0,1) | npc | 카운터 직원 민준 대사 |
| jukebox | (17,6) | jukebox | BGM 선택 플레이어 |
| photobooth | (17,8-9) | photobooth | 포토카드 생성 + PNG 다운로드 |
| gacha | (16,4) | gacha | 랜덤 포춘 메시지 |
| menu_board | (7,11) | menu | 카페 메뉴판 |
| letter_board | (12,6) | letter | 생일 편지 + 양쪽 confetti |
| visitor NPCs (3명) | 파티존 | **말풍선** | 모달 아님 — NPC 머리 위 말풍선 |

## NPC 시스템

**방문객 NPC 3명** (지아, 현우, 소연): `data/ambientNpcs.ts`
- 각 NPC는 `dialogue: string` (1줄 단일 대사). `dialogues: string[]` 아님 — 변경하지 말 것.
- 이동: 6초 간격 4-waypoint 순환 (`hooks/useAmbientNpcs.ts`)
- 충돌: `cafeStore.ts`의 `move()`에서 `npcPositions` 체크 → 플레이어가 NPC 타일로 이동 불가
- 상호작용: E키 → `activeBubbleNpcId` 세팅 → `AmbientNpcs.tsx`에서 NPC 위에 말풍선 렌더링
- 근접 감지: Manhattan distance === 1 (4방향 인접)

## 알려진 기술 주의사항

**Framer Motion transform 충돌**
NPC 말풍선처럼 `motion.div`에 `animate={{ y, scale }}`을 쓰면서 동시에
`style={{ transform: 'translateX(-50%)' }}`을 쓰면 Framer Motion이 transform을 덮어써 위치가 틀어진다.
→ 해결: `style={{ left: 0, width: '100%' }}` + `className="flex justify-center"` 로 centering.

**NPC 위치 동기화**
`AmbientNpcs.tsx` → `syncNpcPosition()` → `cafeStore.npcPositions` 순으로 동기화.
스토어의 `nearbyNpc`는 `move()`와 `syncNpcPosition()` 양쪽에서 재계산된다.

## 맵 레이아웃

- 크기: 20열 × 14행, 기본 타일 48px
- `PLAYER_START = { x:6, y:6 }`
- 맵 크기: 16×12 (기존 20×14에서 좌우 2칸씩 + 하단 2행 축소)
- 벽: 상단만 2타일 (row 0-1). 좌우 하단 오픈
- 카운터: row 1 x=0-4, 전광판: x=9-13, 액자 2개: x=14-15
- 파티존 (floor_party): x=7-14, y=10-11 (테이블: (8,10), (11,11))
- 중앙 우측 파티존 (floor_party): x=9-16, y=7-9 — visitor NPC들이 이 구역에서 배회

## 모바일 대응

- `useTileSize` hook: 768px 미만에서 타일 크기 동적 계산
- `VirtualDpad` 컴포넌트: 모바일 전용 방향키
- 카메라: `scrollToPlayer()` smooth scroll

## 스프라이트 교체 계획

현재 모든 캐릭터/오브젝트는 이모지 + CSS로 표현.
나중에 도트 이미지로 교체할 위치:
- 캐릭터: `components/cafe/Character.tsx`
- NPC: `components/cafe/AmbientNpcs.tsx`의 🐱 emoji span
- 타일 오브젝트: `components/cafe/TileMap.tsx`의 `OBJECT_TYPE_EMOJI`, `DECO_TILE_EMOJI`
- 교체 시 `pixel-crisp` 클래스 (image-rendering: pixelated) 적용

## TODO (미구현 / 개선 여지)

- BGM 파일: `/public/audio/`에 실제 mp3 파일 추가 필요
- 사진 갤러리: `/public/photos/`에 실제 이미지 추가 필요
- 도트 스프라이트 이미지 교체
