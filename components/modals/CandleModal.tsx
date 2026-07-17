'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useCafeStore } from '@/store/cafeStore';
import { Modal } from '@/components/ui/Modal';
import { useAudio } from '@/hooks/useAudio';

type Phase = 'idle' | 'listening' | 'blown' | 'denied';

// "후~" 하고 부는 바람 소리는 특정 톤 없이 넓은 대역에 걸친 잡음(turbulence)이라
// 저음 위주인 목소리("아~")보다 시간축 RMS 진폭 자체는 오히려 작게 잡힌다.
// 그래서 전체 음량이 아니라 "고주파 대역 에너지"만 따로 뽑아서 판정한다.
const BLOW_FREQ_LOW_HZ  = 1000; // 이 대역 아래는 목소리 기본 주파수/배음이 많아 제외
const BLOW_FREQ_HIGH_HZ = 8000;
const BLOW_THRESHOLD    = 0.10; // 고주파 대역 평균 (0~1 정규화)
const BLOW_SUSTAIN_MS   = 500;

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
  const { pauseBGM, resumeBGM } = useAudio();

  const stopMic = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioCtxRef.current?.close();
    streamRef.current   = null;
    audioCtxRef.current = null;
    analyserRef.current = null;
    resumeBGM();
  }, [resumeBGM]);

  const startListening = useCallback(async () => {
    try {
      // BGM이 스피커로 흘러나오면 마이크가 같이 주워듣게 되어 바람 소리 인식을 방해하므로,
      // 마이크를 켜는 동안은 BGM을 잠시 멈춘다 (stopMic에서 다시 재생).
      pauseBGM();
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          // BGM은 마이크 켜는 동안 이미 꺼두기 때문에 에코 캔슬링이 굳이 필요 없고,
          // 오히려 브로드밴드 잡음(=바람 소리)을 에코 아티팩트로 오인해 깎아낼 수 있어 끈다.
          echoCancellation: false,
          // 노이즈 억제/자동 게인이 숨을 부는 약한 소리를 "잡음"으로 판단해 깎아버리는 경우가 많아 꺼둔다.
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      const ctx      = new AudioContext();
      const source   = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      source.connect(analyser);

      streamRef.current   = stream;
      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
      setPhase('listening');

      const freqData  = new Uint8Array(analyser.frequencyBinCount);
      const binHz      = ctx.sampleRate / analyser.fftSize;
      const bandStart  = Math.max(1, Math.round(BLOW_FREQ_LOW_HZ / binHz));
      const bandEnd    = Math.min(freqData.length - 1, Math.round(BLOW_FREQ_HIGH_HZ / binHz));

      const tick = () => {
        analyser.getByteFrequencyData(freqData);
        let sum = 0;
        for (let i = bandStart; i <= bandEnd; i++) sum += freqData[i];
        const highBandLevel = sum / (bandEnd - bandStart + 1) / 255; // 0~1 정규화
        setVolume(highBandLevel);

        if (highBandLevel > BLOW_THRESHOLD) {
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
      resumeBGM();
      setPhase('denied');
    }
  }, [blowCandle, stopMic, pauseBGM, resumeBGM]);

  useEffect(() => {
    if (activeModal !== 'candle') {
      stopMic();
      if (!candleBlown) setPhase('idle');
    }
  }, [activeModal, candleBlown, stopMic]);

  useEffect(() => {
    if (candleBlown) setPhase('blown');
  }, [candleBlown]);

  const isBlown = phase === 'blown';

  return (
    <Modal isOpen={activeModal === 'candle'} maxWidth="max-w-sm">
      <div className="p-6 text-center space-y-4">

        {/* 소원 멘트 */}
        <div className="space-y-1">
          <h2 className="font-bold" style={{ fontSize: '0.8rem', color: '#3d2310' }}>
            ★ 나미의 생일 케이크 ★
          </h2>
          <p style={{ fontSize: '0.65rem', color: '#6b4423' }}>
            {isBlown
              ? '소원이 하늘에 닿았을 거예요 🌠'
              : '나미를 위해 소원을 빌고, 초를 꺼주세요 💛'}
          </p>
          {!isBlown && (
            <p style={{ fontSize: '0.55rem', color: '#a08060', marginTop: '4px' }}>
              ※ 본인 소원은 이뤄지지 않습니다. 본인 생일에 비세요.
            </p>
          )}
        </div>

        {/* 케이크 이미지 */}
        <div className="relative inline-block">
          <AnimatePresence mode="wait">
            {!isBlown ? (
              <motion.div
                key="cake-light"
                animate={
                  flicker
                    ? { x: [-2, 2, -1, 1, 0], scale: [1, 1.03, 0.98, 1.02, 1] }
                    : { x: 0, scale: 1 }
                }
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/cake-light.png"
                  alt="촛불 켜진 케이크"
                  width={200}
                  height={200}
                  unoptimized
                  className="pixel-crisp"
                  style={{ imageRendering: 'pixelated' }}
                  priority
                />
              </motion.div>
            ) : (
              <motion.div
                key="cake-nolight"
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 280, damping: 20 }}
              >
                <Image
                  src="/cake-nolight.png"
                  alt="촛불 꺼진 케이크"
                  width={200}
                  height={200}
                  unoptimized
                  className="pixel-crisp"
                  style={{ imageRendering: 'pixelated' }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* 볼륨 게이지 */}
          {phase === 'listening' && (
            <div
              style={{
                position: 'absolute',
                bottom: '-14px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80px',
                height: '6px',
                background: '#c9a87c',
                border: '2px solid #3d2310',
              }}
            >
              <motion.div
                style={{ height: '100%', background: flicker ? '#e05c2a' : '#d4a017' }}
                animate={{ width: `${Math.min(volume / BLOW_THRESHOLD, 1) * 100}%` }}
                transition={{ duration: 0.05 }}
              />
            </div>
          )}
        </div>

        {/* 상태 안내 */}
        <div className="pt-2 space-y-1">
          <p style={{ fontSize: '0.65rem', fontWeight: 'bold', color: '#3d2310' }}>
            {isBlown              ? '🎉 소원이 이뤄질 거예요! 🎉'
             : phase === 'listening' ? (flicker ? '💨 조금만 더...' : '마이크에 바람을 불어보세요!')
             : phase === 'denied'    ? '마이크 권한이 필요해요'
             :                        '마이크를 켜고 초를 불어주세요'}
          </p>
          <p style={{ fontSize: '0.65rem', color: '#6b4423' }}>
            {isBlown              ? '나미야 생일 축하해 🎂'
             : phase === 'listening' ? '바람 소리가 감지되면 초가 흔들려요'
             : phase === 'denied'    ? '브라우저 마이크 권한을 허용하고 다시 시도하세요'
             :                        '후~ 하고 불면 초가 꺼져요'}
          </p>
        </div>

        {phase === 'idle' && (
          <button onClick={startListening} className="px-btn px-btn-amber w-full">
            🎤 마이크 켜기
          </button>
        )}
        {phase === 'denied' && (
          <button onClick={startListening} className="px-btn px-btn-amber w-full">
            🎤 다시 시도
          </button>
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
