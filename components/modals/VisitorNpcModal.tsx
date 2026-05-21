'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCafeStore } from '@/store/cafeStore';
import { Modal } from '@/components/ui/Modal';

export function VisitorNpcModal() {
  const activeModal    = useCafeStore((s) => s.activeModal);
  const activeVisitorNpc = useCafeStore((s) => s.activeVisitorNpc);
  const [lineIdx, setLineIdx] = useState(0);

  // 모달 열릴 때 대화 인덱스 초기화
  useEffect(() => {
    if (activeModal === 'visitor_npc') setLineIdx(0);
  }, [activeModal]);

  if (!activeVisitorNpc) return null;

  const lines   = activeVisitorNpc.dialogues;
  const isLast  = lineIdx === lines.length - 1;
  const isFemale = activeVisitorNpc.gender === 'female';

  return (
    <Modal isOpen={activeModal === 'visitor_npc'} maxWidth="max-w-sm">
      <div className="p-5">
        {/* NPC 헤더 */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
          <div
            className="w-11 h-11 rounded-full bg-amber-50 flex items-center justify-center text-2xl border-2 border-amber-200 shrink-0"
          >
            <span style={isFemale ? { filter: 'hue-rotate(280deg) saturate(2)' } : undefined}>
              🐱
            </span>
          </div>
          <div>
            <p className="font-bold text-sm">{activeVisitorNpc.name}</p>
            <p className="text-xs text-gray-400">카페 방문객</p>
          </div>
        </div>

        {/* 대화 박스 */}
        <div className="bg-gray-50 rounded-xl p-4 min-h-[72px] flex items-center mb-4">
          <AnimatePresence mode="wait">
            <motion.p
              key={lineIdx}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="text-sm leading-relaxed text-gray-700"
            >
              {lines[lineIdx]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* 진행 바 + 버튼 */}
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
            onClick={() => !isLast && setLineIdx((i) => i + 1)}
            className={[
              'text-xs font-bold px-4 py-1.5 rounded-full transition-all',
              isLast
                ? 'bg-gray-100 text-gray-400 cursor-default'
                : 'bg-amber-400 text-stone-900 hover:bg-amber-300 active:scale-95',
            ].join(' ')}
          >
            {isLast ? '끝 👋' : '다음 ▶'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
