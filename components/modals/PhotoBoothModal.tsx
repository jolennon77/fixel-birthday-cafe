'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useCafeStore } from '@/store/cafeStore';
import { Modal } from '@/components/ui/Modal';

const CAPTURE_SIZE = 640;
const FRAME_SRC = '/frames/photobooth-frame.png';
const MIRROR = true; // 셀카처럼 좌우 반전해서 촬영/저장

type BoothState = 'idle' | 'requesting' | 'live' | 'captured' | 'error';

export function PhotoBoothModal() {
  const activeModal = useCafeStore((s) => s.activeModal);
  const playerInfo  = useCafeStore((s) => s.playerInfo);
  const videoRef    = useRef<HTMLVideoElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const streamRef   = useRef<MediaStream | null>(null);
  const [state, setState] = useState<BoothState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const startCamera = useCallback(async () => {
    setState('requesting');
    setErrorMsg('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: CAPTURE_SIZE }, height: { ideal: CAPTURE_SIZE } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setState('live');
    } catch {
      setErrorMsg('카메라를 사용할 수 없어요. 브라우저 권한을 확인해주세요.');
      setState('error');
    }
  }, []);

  useEffect(() => {
    if (activeModal === 'photobooth') {
      startCamera();
    } else {
      stopStream();
      setState('idle');
    }
    return () => stopStream();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeModal]);

  const capture = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = CAPTURE_SIZE;
    canvas.height = CAPTURE_SIZE;

    // 비디오 중앙을 정사각형으로 크롭
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    const side = Math.min(vw, vh);
    const sx = (vw - side) / 2;
    const sy = (vh - side) / 2;

    ctx.save();
    if (MIRROR) {
      ctx.translate(CAPTURE_SIZE, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, sx, sy, side, side, 0, 0, CAPTURE_SIZE, CAPTURE_SIZE);
    ctx.restore();

    stopStream();

    // 프레임을 사진 위에 합성 (제작한 프레임 PNG는 투명 영역이 있어야 함)
    const frame = new Image();
    frame.onload = () => {
      ctx.drawImage(frame, 0, 0, CAPTURE_SIZE, CAPTURE_SIZE);
      setState('captured');
    };
    frame.onerror = () => setState('captured');
    frame.src = FRAME_SRC;
  }, [stopStream]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.download = `0719-pixel-cafe-${playerInfo?.nickname ?? 'visitor'}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
  };

  return (
    <Modal isOpen={activeModal === 'photobooth'} maxWidth="max-w-xs">
      <div className="p-5 text-center">
        <h2 className="font-bold mb-1" style={{ fontSize: '0.8rem', color: '#3d2310' }}>★ 포토부스 ★</h2>
        <p style={{ fontSize: '0.65rem', color: '#6b4423', marginBottom: '1rem' }}>
          {state === 'captured' ? '방문 기념 포토카드를 저장하세요!' : '프레임 안에 얼굴을 맞추고 촬영하세요!'}
        </p>

        <div
          className="relative mx-auto mb-4 overflow-hidden"
          style={{
            width: '100%', maxWidth: '220px', aspectRatio: '1 / 1',
            border: '4px solid #3d2310',
            boxShadow: '4px 4px 0 rgba(0,0,0,0.4)',
            background: '#000',
          }}
        >
          <video
            ref={videoRef}
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              display: state === 'live' || state === 'requesting' ? 'block' : 'none',
              transform: MIRROR ? 'scaleX(-1)' : 'none',
            }}
          />
          {(state === 'live' || state === 'requesting') && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={FRAME_SRC}
              alt=""
              className="absolute inset-0 w-full h-full pointer-events-none object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          )}
          <canvas
            ref={canvasRef}
            className="pixel-crisp absolute inset-0 w-full h-full"
            style={{ display: state === 'captured' ? 'block' : 'none', imageRendering: 'pixelated' }}
          />
          {state === 'requesting' && (
            <div className="absolute inset-0 flex items-center justify-center" style={{ color: '#fff', fontSize: '0.65rem' }}>
              카메라 준비 중...
            </div>
          )}
          {state === 'error' && (
            <div className="absolute inset-0 flex items-center justify-center text-center px-3" style={{ color: '#fff', fontSize: '0.6rem' }}>
              {errorMsg}
            </div>
          )}
        </div>

        {state === 'error' && (
          <button onClick={startCamera} className="px-btn px-btn-amber w-full">
            다시 시도
          </button>
        )}

        {state === 'live' && (
          <button onClick={capture} className="px-btn px-btn-amber w-full">
            📸 촬영하기
          </button>
        )}

        {state === 'captured' && (
          <div className="flex gap-2">
            <button onClick={startCamera} className="px-btn w-1/2">다시 찍기</button>
            <button onClick={download} className="px-btn px-btn-amber w-1/2">💾 PNG 저장</button>
          </div>
        )}
      </div>
    </Modal>
  );
}
