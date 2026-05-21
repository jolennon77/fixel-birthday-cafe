'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCafeStore } from '@/store/cafeStore';
import { Modal } from '@/components/ui/Modal';

const TAG_COLORS = [
  'bg-yellow-200 border-yellow-400',
  'bg-pink-200 border-pink-400',
  'bg-green-200 border-green-400',
  'bg-blue-200 border-blue-400',
  'bg-purple-200 border-purple-400',
  'bg-orange-200 border-orange-400',
];

const INITIAL_MESSAGES = [
  { id: '1', message: '생일 축하해! 항상 행복하길 🎉', author: '토리',   gender: 'female' as const, color: TAG_COLORS[0] },
  { id: '2', message: '올해도 좋은 일만 가득하길!',    author: '민준',   gender: 'male'   as const, color: TAG_COLORS[2] },
  { id: '3', message: '오래오래 건강하게 지내~',        author: '하나',   gender: 'female' as const, color: TAG_COLORS[1] },
  { id: '4', message: '네가 있어서 세상이 더 예뻐 🌸', author: '지유',   gender: 'female' as const, color: TAG_COLORS[4] },
  { id: '5', message: '최애야 생일 축하해 💛',          author: '서준',   gender: 'male'   as const, color: TAG_COLORS[3] },
];

function Tag({ message, author, gender, color, delay = 0 }: {
  message: string;
  author: string;
  gender: 'male' | 'female';
  color: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 260, damping: 20 }}
      className={`${color} border rounded-lg px-2.5 py-2 shadow-sm max-w-[140px]`}
    >
      {/* 리본 구멍 */}
      <div className="flex justify-center mb-1">
        <div className="w-2 h-2 rounded-full bg-white/60 border border-current opacity-50" />
      </div>
      <p className="text-xs leading-tight mb-1.5">{message}</p>
      <div className="flex items-center gap-1">
        <span
          className="text-sm"
          style={gender === 'female' ? { filter: 'hue-rotate(280deg) saturate(2)' } : undefined}
        >
          🐱
        </span>
        <span className="text-[10px] text-gray-600">{author}</span>
      </div>
    </motion.div>
  );
}

export function GuestbookModal() {
  const activeModal = useCafeStore((s) => s.activeModal);
  const playerInfo  = useCafeStore((s) => s.playerInfo);

  const [messages, setMessages]   = useState(INITIAL_MESSAGES);
  const [input, setInput]         = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!input.trim() || !playerInfo) return;
    const newMsg = {
      id: Date.now().toString(),
      message: input.trim(),
      author: playerInfo.nickname,
      gender: playerInfo.gender,
      color: TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)],
    };
    setMessages((prev) => [newMsg, ...prev]);
    setInput('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <Modal isOpen={activeModal === 'guestbook'} maxWidth="max-w-md">
      <div className="bg-gradient-to-b from-sky-50 to-green-50 rounded-2xl overflow-hidden">
        {/* 하늘 + 나무 일러스트 */}
        <div className="relative pt-4 pb-2 px-4 text-center">
          <p className="text-xs text-stone-400 mb-1">🌤 방명록 나무</p>

          {/* 나무 */}
          <div className="relative inline-block">
            {/* 나뭇잎 */}
            <div className="text-5xl leading-none">🌳</div>

            {/* 태그들 — 나무 주변에 흩어지게 */}
            <div className="absolute inset-0 pointer-events-none">
              <motion.div
                className="absolute -top-2 -left-14"
                animate={{ rotate: [-2, 2, -2] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              >
                <span className="text-xs bg-yellow-200 border border-yellow-400 rounded px-1.5 py-0.5 shadow-sm">
                  {messages[0]?.author} 🎀
                </span>
              </motion.div>
              <motion.div
                className="absolute -top-2 -right-14"
                animate={{ rotate: [2, -2, 2] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
              >
                <span className="text-xs bg-pink-200 border border-pink-400 rounded px-1.5 py-0.5 shadow-sm">
                  {messages[1]?.author} 🎀
                </span>
              </motion.div>
            </div>
          </div>

          <p className="text-xs text-stone-500 mt-1">
            메시지 {messages.length}개가 달려있어요
          </p>
        </div>

        {/* 태그 목록 */}
        <div className="px-4 pb-2 max-h-44 overflow-y-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            <AnimatePresence>
              {messages.map((m, i) => (
                <Tag key={m.id} {...m} delay={i < 6 ? i * 0.05 : 0} />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* 입력 */}
        <div className="px-4 pb-4 pt-2 border-t border-green-100 bg-white/50">
          {submitted ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm font-bold py-2"
            >
              🎀 나무에 달렸어요!
            </motion.p>
          ) : (
            <div className="space-y-2">
              {playerInfo && (
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span
                    style={playerInfo.gender === 'female' ? { filter: 'hue-rotate(280deg) saturate(2)' } : undefined}
                  >
                    🐱
                  </span>
                  <span className="font-medium text-gray-700">{playerInfo.nickname}</span>
                  <span>의 이름으로 달립니다</span>
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value.slice(0, 30))}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="축하 메시지 (30자)"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-green-400 bg-white"
                />
                <button
                  onClick={handleSubmit}
                  disabled={!input.trim()}
                  className="px-3 py-2 bg-green-500 text-white rounded-lg text-xs font-bold disabled:opacity-40 active:scale-95 hover:bg-green-400 transition-all"
                >
                  달기 🎀
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
