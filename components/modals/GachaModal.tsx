'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCafeStore } from '@/store/cafeStore';
import { Modal } from '@/components/ui/Modal';
import { GACHA_MESSAGES } from '@/data/config';

type Phase = 'idle' | 'rolling' | 'result';

export function GachaModal() {
  const activeModal = useCafeStore((s) => s.activeModal);
  const [phase, setPhase]   = useState<Phase>('idle');
  const [result, setResult] = useState<(typeof GACHA_MESSAGES)[number] | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const roll = () => {
    if (phase !== 'idle') return;
    setPhase('rolling');

    setTimeout(() => {
      const pick = GACHA_MESSAGES[Math.floor(Math.random() * GACHA_MESSAGES.length)];
      setResult(pick);
      setHistory((h) => [pick.emoji, ...h].slice(0, 8));
      setPhase('result');
    }, 1200);
  };

  const reset = () => { setPhase('idle'); setResult(null); };

  return (
    <Modal isOpen={activeModal === 'gacha'} maxWidth="max-w-xs">
      <div className="p-5 text-center">
        <h2 className="font-bold text-sm mb-1">🎰 캡슐 뽑기</h2>
        <p className="text-xs text-gray-400 mb-5">축하 메시지를 뽑아보세요!</p>

        {/* 머신 시각화 */}
        <div className="relative w-28 h-28 mx-auto mb-5">
          <div className="w-28 h-28 rounded-full border-4 border-red-300 bg-red-50 flex items-center justify-center shadow-inner">
            <AnimatePresence mode="wait">
              {phase === 'rolling' ? (
                <motion.div
                  key="roll"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.4, ease: 'linear' }}
                  className="text-4xl"
                >
                  🎰
                </motion.div>
              ) : phase === 'result' && result ? (
                <motion.div
                  key="result"
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="text-5xl"
                >
                  {result.emoji}
                </motion.div>
              ) : (
                <motion.div key="idle" className="text-4xl opacity-50">🎰</motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 결과 텍스트 */}
        <AnimatePresence mode="wait">
          {phase === 'result' && result ? (
            <motion.div
              key="text"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-amber-50 rounded-xl p-4 mb-4 text-left"
            >
              <p className="font-bold text-sm mb-1">{result.title}</p>
              <p className="text-xs text-gray-600 leading-relaxed">{result.message}</p>
            </motion.div>
          ) : (
            <div className="h-[72px] mb-4" />
          )}
        </AnimatePresence>

        {/* 버튼 */}
        {phase === 'idle' && (
          <button
            onClick={roll}
            className="w-full py-2.5 bg-red-400 text-white font-bold text-sm rounded-xl hover:bg-red-300 active:scale-95 transition-all"
          >
            뽑기! 🎰
          </button>
        )}
        {phase === 'rolling' && (
          <div className="text-sm text-gray-400 animate-pulse">뽑는 중...</div>
        )}
        {phase === 'result' && (
          <button
            onClick={reset}
            className="w-full py-2.5 bg-amber-400 text-stone-900 font-bold text-sm rounded-xl hover:bg-amber-300 active:scale-95 transition-all"
          >
            한 번 더 🎰
          </button>
        )}

        {/* 뽑기 히스토리 */}
        {history.length > 0 && (
          <div className="flex justify-center gap-1 mt-3">
            {history.map((e, i) => (
              <span key={i} className="text-sm opacity-60">{e}</span>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
