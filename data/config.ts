// ── 생일 설정 ──────────────────────────────────────
export const BIRTHDAY_NAME = '나미';
export const BIRTHDAY_DATE = new Date('2026-07-19T00:00:00+09:00');

// ── NPC 직원 설정 ───────────────────────────────────
export const NPC_NAME = '민준';       // 카운터 직원 이름 (지인으로 설정)
export const NPC_DIALOGUES = [
  `어서오세요! ${BIRTHDAY_NAME}의 생일 카페에 오신 걸 환영해요 ☕`,
  `오늘은 특별한 날이에요. ${BIRTHDAY_NAME}를 위해 준비한 공간이에요 🎂`,
  `💌 카운터에서 생일 초대장을 받아가세요!`,
  `굿즈 전시대에서 기념 굿즈도 구경해 보세요 🛍️`,
  `천천히 구경하고 가세요. 오늘 하루 행복하게 보내시길!`,
];

// ── 가챠 메시지 풀 ──────────────────────────────────
export const GACHA_MESSAGES = [
  { emoji: '⭐', title: '별처럼 빛나는 하루', message: '오늘도 내일도 네가 있는 곳이 빛나길 바랄게!' },
  { emoji: '🌸', title: '봄날 같은 사람',     message: '만나면 따뜻해지는 사람, 항상 곁에 있어줘서 고마워.' },
  { emoji: '🎯', title: '꿈을 향해!',         message: '올해도 네가 원하는 것들을 하나씩 이뤄가길 응원해.' },
  { emoji: '🍀', title: '행운의 네잎클로버',  message: '오늘부터 네 인생에 행운이 줄줄이 따라다닐 거야!' },
  { emoji: '🌙', title: '달빛처럼 포근하게',  message: '힘든 날엔 달처럼 조용히 곁에서 빛나줄게.' },
  { emoji: '🎁', title: '선물 같은 사람',     message: '네 존재 자체가 우리에게 선물이야. 생일 축하해!' },
  { emoji: '🌈', title: '일곱 빛깔 행복',     message: '365일 무지개 같은 하루가 이어지길 바랄게!' },
  { emoji: '🔥', title: '불꽃 에너지',        message: '올해는 더 강하고 멋있어질 너를 기대할게!' },
  { emoji: '💎', title: '다이아몬드 같은 너', message: '어떤 상황에서도 빛나는 네가 정말 멋있어.' },
  { emoji: '🦋', title: '새로운 시작',        message: '생일은 새로운 나로 날아오르는 날. 올해도 화이팅!' },
  { emoji: '🍰', title: '달콤한 한 해',       message: '올 한 해도 케이크처럼 달콤한 일들로 가득하길!' },
  { emoji: '🌟', title: '슈퍼스타',           message: '너는 이미 우리 모두의 최애야. 생일 축하해 💛' },
];

// ── 굿즈 전시대 ───────────────────────────────────────
export const GOODS_DISPLAY = [
  { id: 'goods1', name: '손가락 깨무는 몬치치', image: '/goods/goods_1.webp' },
  { id: 'goods2', name: '클래식 몬치치 (블루 캡)', image: '/goods/goods_2.webp' },
  { id: 'goods3', name: '클래식 몬치치 (레드 반다나)', image: '/goods/goods_3.webp' },
];

// ── 카페 메뉴 ───────────────────────────────────────
export const CAFE_MENU = [
  { category: '☕ 음료', items: [
    { name: '0719 블렌디드',     desc: '딸기·망고·생크림',    price: '7,500원' },
    { name: '생일 케이크 라떼',  desc: '바닐라·카라멜·크림',  price: '6,500원' },
    { name: '핑크 레모네이드',   desc: '딸기·레몬·탄산',      price: '5,500원' },
    { name: '따뜻한 초코',       desc: '벨기에 다크 초콜릿',  price: '5,000원' },
  ]},
  { category: '🍰 디저트', items: [
    { name: '생일 케이크 조각',  desc: '오늘의 특선 케이크',  price: '6,000원' },
    { name: '마카롱 세트 3종',   desc: '라즈베리·피스타치오·레몬', price: '5,500원' },
    { name: '크림 스콘',         desc: '클로티드크림 포함',   price: '4,500원' },
  ]},
];

// ── BGM 트랙 ────────────────────────────────────────
export const BGM_TRACKS = [
  { id: 'cafe',     label: 'Cafe-Jazz',     src: '/audio/bgm-cafe.mp3',     emoji: '🎷' },
  { id: 'birthday', label: 'Happy-Birthday',     src: '/audio/bgm-birthday.mp3', emoji: '🎂' },
  { id: 'chill',    label: 'Chill-Night',     src: '/audio/bgm-chill.mp3',    emoji: '🌙' },
];

// 평소 기본 BGM (BGM_TRACKS의 id 중 하나, null이면 자동재생 안 함)
export const DEFAULT_BGM_ID: string | null = 'cafe';

// 생일 당일(한국시간 기준)에는 이 트랙이 기본 BGM을 대체한다
export const BIRTHDAY_BGM_ID: string | null = 'birthday';

// ── 매년 반복되는 생일(월/일)을 다루기 위한 헬퍼 ─────────
// BIRTHDAY_DATE는 최초 기준일일 뿐, 아래 함수들은 '월/일'만 뽑아서
// 해마다 같은 날짜가 돌아오도록 계산한다. (생일이 지나면 자동으로 내년 생일로 넘어감)
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

function kstParts(d: Date) {
  const shifted = new Date(d.getTime() + KST_OFFSET_MS);
  return { year: shifted.getUTCFullYear(), month: shifted.getUTCMonth(), date: shifted.getUTCDate() };
}

function kstMidnight(year: number, month: number, date: number): Date {
  return new Date(Date.UTC(year, month, date, 0, 0, 0) - KST_OFFSET_MS);
}

const BIRTHDAY_MD = kstParts(BIRTHDAY_DATE); // 매년 반복되는 생일 월/일 (한국시간 기준)

// 오늘이 (연도와 무관하게) 생일 당일인지
export function isBirthdayToday(now: Date = new Date()): boolean {
  const n = kstParts(now);
  return n.month === BIRTHDAY_MD.month && n.date === BIRTHDAY_MD.date;
}

// 다가오는 생일 자정(한국시간): 올해 생일이 아직 안 지났으면 올해, 지났으면 내년
export function getNextBirthdayDate(now: Date = new Date()): Date {
  const n = kstParts(now);
  const thisYear = kstMidnight(n.year, BIRTHDAY_MD.month, BIRTHDAY_MD.date);
  if (thisYear.getTime() > now.getTime()) return thisYear;
  return kstMidnight(n.year + 1, BIRTHDAY_MD.month, BIRTHDAY_MD.date);
}

// 카페 입장 시 자동 재생될 기본 BGM id를 오늘 날짜 기준으로 계산
export function getDefaultBgmId(): string | null {
  return isBirthdayToday() ? BIRTHDAY_BGM_ID : DEFAULT_BGM_ID;
}
