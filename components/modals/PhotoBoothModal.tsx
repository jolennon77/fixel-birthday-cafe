'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useCafeStore } from '@/store/cafeStore';
import { Modal } from '@/components/ui/Modal';
import { BIRTHDAY_NAME } from '@/data/config';

function drawPhotoCard(
  canvas: HTMLCanvasElement,
  nickname: string,
  gender: 'male' | 'female'
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const W = canvas.width;
  const H = canvas.height;

  // 배경 그라데이션
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, gender === 'female' ? '#fce7f3' : '#e0f2fe');
  bg.addColorStop(1, gender === 'female' ? '#fbcfe8' : '#bae6fd');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // 테두리 장식
  ctx.strokeStyle = gender === 'female' ? '#f9a8d4' : '#7dd3fc';
  ctx.lineWidth = 8;
  ctx.strokeRect(12, 12, W - 24, H - 24);
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 20, W - 40, H - 40);

  // 상단 타이틀
  ctx.fillStyle = gender === 'female' ? '#be185d' : '#0369a1';
  ctx.font = 'bold 18px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('✦ 0719 PIXEL CAFE ✦', W / 2, 58);

  // 캐릭터 이모지 영역
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.beginPath();
  ctx.roundRect(W / 2 - 48, 78, 96, 96, 16);
  ctx.fill();
  ctx.font = '64px serif';
  ctx.textAlign = 'center';
  ctx.fillText('🐱', W / 2, 158);

  // 닉네임
  ctx.fillStyle = '#1c1917';
  ctx.font = 'bold 22px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(nickname, W / 2, 208);

  // 구분선
  ctx.strokeStyle = gender === 'female' ? '#f9a8d4' : '#7dd3fc';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(48, 222);
  ctx.lineTo(W - 48, 222);
  ctx.stroke();

  // 방문 정보
  const now = new Date();
  const dateStr = now.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  ctx.fillStyle = '#57534e';
  ctx.font = '13px monospace';
  ctx.fillText(`${BIRTHDAY_NAME}의 생일 카페 방문`, W / 2, 248);
  ctx.font = '12px monospace';
  ctx.fillStyle = '#78716c';
  ctx.fillText(dateStr, W / 2, 268);

  // 하단 장식 도트
  ctx.fillStyle = gender === 'female' ? '#f9a8d4' : '#7dd3fc';
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(W / 2 - 32 + i * 16, 298, 4, 0, Math.PI * 2);
    ctx.fill();
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
      // 모달이 마운트된 다음 프레임에 draw
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
        <h2 className="font-bold text-sm mb-1">📸 포토부스</h2>
        <p className="text-xs text-gray-400 mb-4">방문 기념 포토카드를 저장하세요!</p>

        {/* 포토카드 캔버스 */}
        <div className="flex justify-center mb-4">
          <canvas
            ref={canvasRef}
            width={320}
            height={320}
            className="rounded-xl shadow-lg border border-gray-100 w-full max-w-[240px]"
          />
        </div>

        <button
          onClick={download}
          disabled={!ready}
          className={[
            'w-full py-2.5 rounded-xl text-sm font-bold transition-all',
            ready
              ? 'bg-sky-400 text-white hover:bg-sky-300 active:scale-95'
              : 'bg-gray-100 text-gray-400',
          ].join(' ')}
        >
          {ready ? '💾 PNG 저장' : '생성 중...'}
        </button>
      </div>
    </Modal>
  );
}
