'use client';

import { useEffect, useState } from 'react';
import { useCafeStore } from '@/store/cafeStore';
import { Modal } from '@/components/ui/Modal';
import { BIRTHDAY_DATE, BIRTHDAY_NAME } from '@/data/config';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isBirthday: boolean;
}

function getTimeLeft(): TimeLeft {
  const now  = new Date();
  const diff = BIRTHDAY_DATE.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isBirthday: true };
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isBirthday: false,
  };
}

function Digit({ value, label, large }: { value: number; label: string; large?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="px-inset font-pixel tabular-nums text-center"
        style={{
          background: '#1a1a0a',
          color: '#4ade80',
          fontSize: large ? '1.6rem' : '1rem',
          padding: large ? '0.6rem 1rem' : '0.4rem 0.7rem',
          minWidth: large ? '80px' : '52px',
          boxShadow: 'inset 2px 2px 0 #0a0a02, inset -1px -1px 0 #2a2a12',
        }}
      >
        {String(value).padStart(large ? 3 : 2, '0')}
      </div>
      <span className="font-pixel" style={{ fontSize: '0.45rem', color: '#7a5c3a' }}>{label}</span>
    </div>
  );
}

export function BillboardModal() {
  const activeModal = useCafeStore((s) => s.activeModal);
  const closeModal  = useCafeStore((s) => s.closeModal);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft);

  useEffect(() => {
    if (activeModal !== 'billboard') return;
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, [activeModal]);

  return (
    <Modal isOpen={activeModal === 'billboard'} maxWidth="max-w-sm" hideCloseButton>
      {/* 패널 헤더 */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ borderBottom: '3px solid #3d2310', background: '#d4a017' }}
      >
        <div style={{ width: '2rem' }} />
        <span className="font-pixel" style={{ fontSize: '0.5rem', color: '#1a0e00', letterSpacing: '0.15em' }}>
          ★ 0719 PIXEL CAFE ★
        </span>
        <button
          onClick={closeModal}
          className="px-btn px-btn-red w-8 h-8"
          style={{ padding: 0, fontSize: '0.55rem' }}
          aria-label="닫기"
        >
          ✕
        </button>
      </div>

      {/* 본문 */}
      <div className="p-5 text-center">
        {timeLeft.isBirthday ? (
          <div className="space-y-3">
            <div className="text-5xl animate-bounce">🎂</div>
            <p className="font-pixel" style={{ fontSize: '0.65rem', color: '#3d2310', lineHeight: 2 }}>
              HAPPY<br />BIRTHDAY!
            </p>
            <p style={{ fontSize: '0.65rem', color: '#6b4423' }}>
              {BIRTHDAY_NAME}야, 생일 축하해! 🎉
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p style={{ fontSize: '0.65rem', color: '#6b4423' }}>{BIRTHDAY_NAME}의 생일까지</p>

            <div className="flex justify-center">
              <Digit value={timeLeft.days} label="DAYS" large />
            </div>

            <div className="flex gap-3 justify-center items-start">
              <Digit value={timeLeft.hours}   label="HRS" />
              <span className="font-pixel" style={{ fontSize: '1.2rem', color: '#4ade80', marginTop: '0.3rem' }}>:</span>
              <Digit value={timeLeft.minutes} label="MIN" />
              <span className="font-pixel" style={{ fontSize: '1.2rem', color: '#4ade80', marginTop: '0.3rem' }}>:</span>
              <Digit value={timeLeft.seconds} label="SEC" />
            </div>

            <p style={{ fontSize: '0.55rem', color: '#8a6040' }}>
              {BIRTHDAY_DATE.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        )}
      </div>

      {/* LED 도트 장식 */}
      <div className="flex justify-center gap-1 pb-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="w-2 h-2" style={{ background: '#4ade80', border: '1px solid #3d2310', opacity: 0.7 }} />
        ))}
      </div>
    </Modal>
  );
}
