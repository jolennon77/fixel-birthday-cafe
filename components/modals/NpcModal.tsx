'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCafeStore } from '@/store/cafeStore';
import { Modal } from '@/components/ui/Modal';
import { NPC_NAME, NPC_DIALOGUES, BIRTHDAY_NAME } from '@/data/config';

export function NpcModal() {
  const activeModal = useCafeStore((s) => s.activeModal);
  const playerInfo  = useCafeStore((s) => s.playerInfo);
  const [lineIdx, setLineIdx] = useState(0);

  const lines = [
    `어, ${playerInfo?.nickname ?? '손님'}! 왔어요? 반가워요 😊`,
    ...NPC_DIALOGUES,
  ];

  const next = () => setLineIdx((i) => Math.min(i + 1, lines.length - 1));
  const isLast = lineIdx === lines.length - 1;

  return (
    <Modal isOpen={activeModal === 'npc'} maxWidth="max-w-sm">
      <div className="p-5">
        {/* NPC 헤더 */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-2xl border-2 border-amber-300">
            🧑‍🍳
          </div>
          <div>
            <p className="font-bold text-sm">{NPC_NAME}</p>
            <p className="text-xs text-gray-400">{BIRTHDAY_NAME}의 단짝친구 · 카페 매니저</p>
          </div>
        </div>

        {/* 대사 박스 */}
        <div className="bg-amber-50 rounded-xl p-4 min-h-[80px] flex items-center mb-4 relative">
          <AnimatePresence mode="wait">
            <motion.p
              key={lineIdx}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="text-sm leading-relaxed text-gray-700"
            >
              {lines[lineIdx]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* 진행 도트 */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {lines.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === lineIdx ? 'bg-amber-400' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <button
            onClick={next}
            disabled={isLast}
            className={[
              'text-xs font-bold px-4 py-1.5 rounded-full transition-all',
              isLast
                ? 'bg-gray-100 text-gray-400 cursor-default'
                : 'bg-amber-400 text-stone-900 hover:bg-amber-300 active:scale-95',
            ].join(' ')}
          >
            {isLast ? '끝' : '다음 ▶'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
