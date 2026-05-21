'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCafeStore } from '@/store/cafeStore';
import type { CharacterGender } from '@/types';
import { BIRTHDAY_NAME } from '@/data/config';

const CHARACTERS: { gender: CharacterGender; emoji: string; label: string; color: string; bg: string }[] = [
  {
    gender: 'male',
    emoji: '🐱',
    label: '남자',
    color: 'border-sky-400 bg-sky-50',
    bg: 'from-sky-400 to-blue-500',
  },
  {
    gender: 'female',
    emoji: '🐱',
    label: '여자',
    color: 'border-pink-400 bg-pink-50',
    bg: 'from-pink-400 to-rose-500',
  },
];

export function EntranceScreen() {
  const setPlayerInfo = useCafeStore((s) => s.setPlayerInfo);
  const [selected, setSelected] = useState<CharacterGender | null>(null);
  const [nickname, setNickname] = useState('');
  const [entering, setEntering] = useState(false);

  const canEnter = selected !== null && nickname.trim().length > 0;

  const handleEnter = () => {
    if (!canEnter || entering) return;
    setEntering(true);
    setTimeout(() => {
      setPlayerInfo({ nickname: nickname.trim(), gender: selected! });
    }, 600);
  };

  return (
    <AnimatePresence>
      {!entering ? (
        <motion.div
          key="entrance"
          className="fixed inset-0 bg-stone-900 flex flex-col items-center justify-center p-6 z-50"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5 }}
        >
          {/* 타이틀 */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <p className="text-amber-400 text-xs font-pixel mb-2 tracking-widest">
              ☕ WELCOME TO
            </p>
            <h1 className="text-white text-2xl sm:text-3xl font-pixel leading-tight">
              0719<br />PIXEL CAFE
            </h1>
            <p className="text-stone-400 text-xs mt-3">
              {BIRTHDAY_NAME}의 생일 카페에 오신 걸 환영해요
            </p>
          </motion.div>

          {/* 캐릭터 선택 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="w-full max-w-sm mb-6"
          >
            <p className="text-stone-400 text-xs text-center mb-3">캐릭터 선택</p>
            <div className="flex gap-4 justify-center">
              {CHARACTERS.map((c) => (
                <button
                  key={c.gender}
                  onClick={() => setSelected(c.gender)}
                  className={[
                    'flex flex-col items-center gap-2 p-4 rounded-2xl border-2 w-28',
                    'transition-all duration-150',
                    selected === c.gender
                      ? c.color + ' scale-105 shadow-lg'
                      : 'border-stone-600 bg-stone-800 hover:border-stone-400',
                  ].join(' ')}
                >
                  <span
                    className="text-4xl"
                    style={
                      c.gender === 'female'
                        ? { filter: 'hue-rotate(280deg) saturate(2)' }
                        : undefined
                    }
                  >
                    {c.emoji}
                  </span>
                  <span className="text-xs text-stone-300 font-medium">{c.label}</span>
                  {selected === c.gender && (
                    <span className="text-[10px] text-stone-500">✓ 선택됨</span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          {/* 닉네임 입력 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="w-full max-w-sm mb-6"
          >
            <p className="text-stone-400 text-xs text-center mb-3">닉네임 입력</p>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value.slice(0, 10))}
              onKeyDown={(e) => e.key === 'Enter' && handleEnter()}
              placeholder="이름 또는 별명 (최대 10자)"
              className={[
                'w-full bg-stone-800 border rounded-xl px-4 py-3 text-white text-sm text-center',
                'placeholder:text-stone-500 outline-none transition-colors',
                nickname.trim()
                  ? 'border-amber-400 focus:border-amber-300'
                  : 'border-stone-600 focus:border-stone-400',
              ].join(' ')}
            />
          </motion.div>

          {/* 입장 버튼 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <button
              onClick={handleEnter}
              disabled={!canEnter}
              className={[
                'px-10 py-3 rounded-full text-sm font-bold transition-all duration-200',
                canEnter
                  ? 'bg-amber-400 text-stone-900 hover:bg-amber-300 active:scale-95 shadow-lg shadow-amber-400/30'
                  : 'bg-stone-700 text-stone-500 cursor-not-allowed',
              ].join(' ')}
            >
              카페 입장하기 ☕
            </button>
          </motion.div>

          <p className="text-stone-600 text-[10px] mt-6">
            방향키 또는 WASD로 이동 · E키로 상호작용
          </p>
        </motion.div>
      ) : (
        <motion.div
          key="loading"
          className="fixed inset-0 bg-stone-900 flex items-center justify-center z-50"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="text-amber-400 text-sm font-pixel">입장 중...</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
