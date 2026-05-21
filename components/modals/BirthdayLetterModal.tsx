'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useCafeStore } from '@/store/cafeStore';
import { Modal } from '@/components/ui/Modal';
import { BIRTHDAY_NAME, NPC_NAME } from '@/data/config';

function fireConfetti() {
  const end = Date.now() + 2200;
  const colors = ['#fbbf24', '#f472b6', '#34d399', '#60a5fa', '#a78bfa'];

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}

export function BirthdayLetterModal() {
  const activeModal = useCafeStore((s) => s.activeModal);

  useEffect(() => {
    if (activeModal === 'letter') {
      setTimeout(fireConfetti, 400);
    }
  }, [activeModal]);

  return (
    <Modal isOpen={activeModal === 'letter'} maxWidth="max-w-sm">
      <div className="bg-gradient-to-b from-amber-50 to-pink-50 rounded-2xl overflow-hidden">
        {/* 헤더 */}
        <div className="text-center pt-6 pb-2 px-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
            className="text-4xl mb-2"
          >
            💌
          </motion.div>
          <h2 className="font-bold text-base text-stone-800">
            {BIRTHDAY_NAME}에게
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">from. {NPC_NAME}</p>
        </div>

        {/* 편지 본문 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="px-6 py-4 space-y-3 text-sm text-stone-700 leading-relaxed"
        >
          <p>
            {BIRTHDAY_NAME}야, 생일 축하해. 🎂
          </p>
          <p>
            네가 웃을 때 주변이 다 환해지는 거 알아?
            그 웃음이 얼마나 많은 사람들한테 힘이 되는지
            너는 아마 모를 거야.
          </p>
          <p>
            올해도 네가 원하는 것들을 하나씩 이뤄가길,
            그리고 행복한 날들이 365일 내내 이어지길
            진심으로 바랄게.
          </p>
          <p>
            항상 네 곁에서 응원하고 있을게. 고마워, 존재해줘서. 💛
          </p>
        </motion.div>

        {/* 서명 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="px-6 pb-5 pt-2 text-right"
        >
          <p className="text-xs text-stone-400 italic">
            2026. 07. 19 — 0719 Pixel Cafe에서
          </p>
          <p className="text-sm font-medium text-stone-600 mt-0.5">
            {NPC_NAME} 올림 ✉️
          </p>
        </motion.div>

        {/* 장식 */}
        <div className="flex justify-center gap-2 pb-4">
          {['💛','🌸','⭐','🌸','💛'].map((e, i) => (
            <span key={i} className="text-sm opacity-60">{e}</span>
          ))}
        </div>
      </div>
    </Modal>
  );
}
