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
        <h2 className="font-pixel mb-1" style={{ fontSize: '0.55rem', color: '#3d2310' }}>★ 캡슐 뽑기 ★</h2>
        <p style={{ fontSize: '0.65rem', color: '#6b4423', marginBottom: '1.2rem' }}>축하 메시지를 뽑아보세요!</p>

        {/* 캡슐 머신 — 픽셀 사각 박스 */}
        <div className="mx-auto mb-5" style={{ width: '108px', height: '108px', position: 'relative' }}>
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: '#1a0e00',
              border: '4px solid #3d2310',
              boxShadow: 'inset 3px 3px 0 #2a1a08, inset -3px -3px 0 #0a0500, 4px 4px 0 rgba(0,0,0,0.5)',
            }}
          >
            <AnimatePresence mode="wait">
              {phase === 'rolling' ? (
                <motion.div
                  key="roll"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.4, ease: 'linear' }}
                  style={{ fontSize: '2.8rem' }}
                >
                  🎰
                </motion.div>
              ) : phase === 'result' && result ? (
                <motion.div
                  key="result"
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  style={{ fontSize: '3.2rem' }}
                >
                  {result.emoji}
                </motion.div>
              ) : (
                <motion.div key="idle" style={{ fontSize: '2.8rem', opacity: 0.5 }}>🎰</motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* 픽셀 코인 슬롯 장식 */}
          <div
            style={{
              position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)',
              width: '32px', height: '8px',
              background: '#3d2310',
              border: '2px solid #1a0e00',
              boxShadow: 'inset 1px 1px 0 #5a3a20',
            }}
          />
        </div>

        {/* 결과 텍스트 */}
        <AnimatePresence mode="wait">
          {phase === 'result' && result ? (
            <motion.div
              key="text"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-inset mb-4 text-left p-3"
            >
              <p style={{ fontSize: '0.65rem', fontWeight: 'bold', color: '#3d2310', marginBottom: '4px' }}>{result.title}</p>
              <p style={{ fontSize: '0.6rem', color: '#6b4423', lineHeight: 1.6 }}>{result.message}</p>
            </motion.div>
          ) : (
            <div style={{ height: '72px', marginBottom: '1rem' }} />
          )}
        </AnimatePresence>

        {phase === 'idle' && (
          <button onClick={roll} className="px-btn px-btn-amber w-full">
            뽑기! 🎰
          </button>
        )}
        {phase === 'rolling' && (
          <p className="font-pixel" style={{ fontSize: '0.5rem', color: '#6b4423' }}>뽑는 중...</p>
        )}
        {phase === 'result' && (
          <button onClick={reset} className="px-btn w-full">
            한 번 더 🎰
          </button>
        )}

        {history.length > 0 && (
          <div className="flex justify-center gap-1 mt-3">
            {history.map((e, i) => (
              <span key={i} style={{ fontSize: '0.8rem', opacity: 0.55 }}>{e}</span>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
