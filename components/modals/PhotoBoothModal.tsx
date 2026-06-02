'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useCafeStore } from '@/store/cafeStore';
import { Modal } from '@/components/ui/Modal';
import { BIRTHDAY_NAME } from '@/data/config';

function drawPhotoCard(canvas: HTMLCanvasElement, nickname: string, gender: 'male' | 'female') {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const W = canvas.width;
  const H = canvas.height;

  // 배경
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, gender === 'female' ? '#fce7f3' : '#e0f2fe');
  bg.addColorStop(1, gender === 'female' ? '#fbcfe8' : '#bae6fd');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // 픽셀 테두리 (바깥)
  ctx.strokeStyle = '#3d2310';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, W - 16, H - 16);
  ctx.strokeStyle = gender === 'female' ? '#f9a8d4' : '#7dd3fc';
  ctx.lineWidth = 3;
  ctx.strokeRect(16, 16, W - 32, H - 32);

  // 타이틀
  ctx.fillStyle = '#3d2310';
  ctx.font = 'bold 16px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('✦ 0719 PIXEL CAFE ✦', W / 2, 56);

  // 캐릭터
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.fillRect(W / 2 - 48, 74, 96, 96);
  ctx.strokeStyle = '#3d2310';
  ctx.lineWidth = 3;
  ctx.strokeRect(W / 2 - 48, 74, 96, 96);
  ctx.font = '64px serif';
  ctx.fillText('🐱', W / 2, 152);

  // 닉네임
  ctx.fillStyle = '#3d2310';
  ctx.font = 'bold 20px monospace';
  ctx.fillText(nickname, W / 2, 200);

  // 구분선
  ctx.strokeStyle = '#3d2310';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(40, 214); ctx.lineTo(W - 40, 214);
  ctx.stroke();

  // 방문 정보
  const dateStr = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  ctx.fillStyle = '#6b4423';
  ctx.font = '13px monospace';
  ctx.fillText(`${BIRTHDAY_NAME}의 생일 카페 방문`, W / 2, 240);
  ctx.font = '12px monospace';
  ctx.fillStyle = '#8a6040';
  ctx.fillText(dateStr, W / 2, 260);

  // 하단 픽셀 도트
  ctx.fillStyle = '#3d2310';
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(W / 2 - 32 + i * 16, 288, 8, 8);
  }
}

export function PhotoBoothModal() {
  const activeModal = useCafeStore((s) => s.activeModal);
  const playerInfo  = useCafeStore((s) => s.playerInfo);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !playerInfo) return;
    drawPhotoCard(canvas, playerInfo.nickname, playerInfo.gender);
    setReady(true);
  }, [playerInfo]);

  useEffect(() => {
    if (activeModal === 'photobooth') {
      setReady(false);
      requestAnimationFrame(draw);
    }
  }, [activeModal, draw]);

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
        <p style={{ fontSize: '0.65rem', color: '#6b4423', marginBottom: '1rem' }}>방문 기념 포토카드를 저장하세요!</p>

        <div className="flex justify-center mb-4">
          <canvas
            ref={canvasRef}
            width={320}
            height={320}
            className="pixel-crisp"
            style={{
              width: '100%', maxWidth: '220px',
              border: '4px solid #3d2310',
              boxShadow: '4px 4px 0 rgba(0,0,0,0.4)',
              imageRendering: 'pixelated',
            }}
          />
        </div>

        <button
          onClick={download}
          disabled={!ready}
          className="px-btn px-btn-amber w-full"
        >
          {ready ? '💾 PNG 저장' : '생성 중...'}
        </button>
      </div>
    </Modal>
  );
}
