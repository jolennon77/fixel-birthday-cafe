'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCafeStore } from '@/store/cafeStore';
import { Modal } from '@/components/ui/Modal';

type Phase = 'idle' | 'listening' | 'blown' | 'denied';

const BLOW_THRESHOLD = 0.18;
const BLOW_SUSTAIN_MS = 600;

export function CandleModal() {
  const activeModal = useCafeStore((s) => s.activeModal);
  const candleBlown = useCafeStore((s) => s.candleBlown);
  const blowCandle  = useCafeStore((s) => s.blowCandle);

  const [phase, setPhase]     = useState<Phase>('idle');
  const [volume, setVolume]   = useState(0);
  const [flicker, setFlicker] = useState(false);

  const audioCtxRef  = useRef<AudioContext | null>(null);
  const analyserRef  = useRef<AnalyserNode | null>(null);
  const streamRef    = useRef<MediaStream | null>(null);
  const rafRef       = useRef<number>(0);
  const blowStartRef = useRef<number | null>(null);

  const stopMic = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioCtxRef.current?.close();
    streamRef.current   = null;
    audioCtxRef.current = null;
    analyserRef.current = null;
  }, []);

  const startListening = useCallback(async () => {
    try {
      const stream   = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx      = new AudioContext();
      const source   = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      streamRef.current   = stream;
      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
      setPhase('listening');

      const buf = new Float32Array(analyser.fftSize);
      const tick = () => {
        analyser.getFloatTimeDomainData(buf);
        let sum = 0;
        for (const v of buf) sum += v * v;
        const rms = Math.sqrt(sum / buf.length);
        setVolume(rms);

        if (rms > BLOW_THRESHOLD) {
          setFlicker(true);
          if (blowStartRef.current === null) blowStartRef.current = Date.now();
          else if (Date.now() - blowStartRef.current >= BLOW_SUSTAIN_MS) {
            stopMic();
            blowCandle();
            setPhase('blown');
            setFlicker(false);
            return;
          }
        } else {
          blowStartRef.current = null;
          setFlicker(false);
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      setPhase('denied');
    }
  }, [blowCandle, stopMic]);

  useEffect(() => {
    if (activeModal !== 'candle') {
      stopMic();
      if (!candleBlown) setPhase('idle');
    }
  }, [activeModal, candleBlown, stopMic]);

  useEffect(() => {
    if (candleBlown) setPhase('blown');
  }, [candleBlown]);

  return (
    <Modal isOpen={activeModal === 'candle'} maxWidth="max-w-sm">
      <div className="p-6 text-center space-y-4">
        <h2 className="font-pixel" style={{ fontSize: '0.55rem', color: '#3d2310' }}>
          ★ 촛불 불기 ★
        </h2>

        {/* 촛불 */}
        <div className="relative inline-block">
          <AnimatePresence mode="wait">
            {phase !== 'blown' ? (
              <motion.div
                key="candle"
                style={{ fontSize: '3.5rem', lineHeight: 1, display: 'block' }}
                animate={
                  flicker
                    ? { scale: [1, 1.12, 0.92, 1.08, 1], rotate: [-3, 3, -2, 2, 0] }
                    : { scale: 1, rotate: 0 }
                }
                transition={{ duration: 0.25 }}
              >
                🕯️
              </motion.div>
            ) : (
              <motion.div
                key="blown"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                style={{ fontSize: '3.5rem', lineHeight: 1, display: 'block' }}
              >
                🎊
              </motion.div>
            )}
          </AnimatePresence>

          {/* 볼륨 게이지 */}
          {phase === 'listening' && (
            <div
              className="absolute"
              style={{ bottom: '-10px', left: '50%', transform: 'translateX(-50%)', width: '60px', height: '6px', background: '#c9a87c', border: '2px solid #3d2310' }}
            >
              <motion.div
                style={{ height: '100%', background: '#d4a017' }}
                animate={{ width: `${Math.min(volume / BLOW_THRESHOLD, 1) * 100}%` }}
                transition={{ duration: 0.05 }}
              />
            </div>
          )}
        </div>

        <div className="pt-2 space-y-1">
          <p style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#3d2310' }}>
            {phase === 'blown'     ? '소원이 이뤄질 거예요! 🎉'
             : phase === 'listening' ? '마이크에 바람을 불어보세요!'
             : '촛불을 끄세요'}
          </p>
          <p style={{ fontSize: '0.65rem', color: '#6b4423' }}>
            {phase === 'blown'     ? '생일 축하해요 나미 🎂'
             : phase === 'denied'  ? '마이크 권한이 필요해요'
             : phase === 'listening' ? (flicker ? '조금 더... 계속 불어요! 💨' : '소리가 감지되면 촛불이 흔들려요')
             : '마이크로 바람 소리를 내면 꺼져요'}
          </p>
        </div>

        {phase === 'idle' && (
          <button onClick={startListening} className="px-btn px-btn-amber w-full">
            🎤 마이크 켜기
          </button>
        )}
        {phase === 'denied' && (
          <p style={{ fontSize: '0.6rem', color: '#c0392b' }}>
            브라우저 마이크 권한을 허용하고 다시 시도하세요
          </p>
        )}
        {phase === 'listening' && (
          <button onClick={() => { stopMic(); setPhase('idle'); }} className="px-btn px-btn-red">
            취소
          </button>
        )}
      </div>
    </Modal>
  );
}
