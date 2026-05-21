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
  const now = new Date();
  const diff = BIRTHDAY_DATE.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isBirthday: true };
  }

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
    <div className="flex flex-col items-center">
      <div className={[
        'bg-stone-900 text-green-400 font-pixel rounded-lg text-center tabular-nums shadow-inner px-4',
        large ? 'text-3xl py-4' : 'text-xl py-3',
      ].join(' ')}>
        {String(value).padStart(large ? 3 : 2, '0')}
      </div>
      <span className="text-stone-400 text-[10px] mt-1">{label}</span>
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
      <div className="bg-stone-800 rounded-2xl overflow-hidden">
        {/* 전광판 헤더 — 닫기 버튼 포함 */}
        <div className="bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 px-4 py-2 flex items-center justify-between">
          <div className="w-7" /> {/* 좌측 여백 (버튼 너비만큼) */}
          <p className="text-stone-900 text-xs font-pixel tracking-widest flex-1 text-center">
            ★ 0719 PIXEL CAFE ★
          </p>
          <button
            onClick={closeModal}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-stone-900/20 hover:bg-stone-900/40 text-stone-900 text-xs transition-colors shrink-0"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        <div className="p-6 text-center">
          {timeLeft.isBirthday ? (
            // 생일 당일 이후
            <div className="space-y-3">
              <div className="text-5xl animate-bounce">🎂</div>
              <h2 className="text-white text-lg font-pixel leading-relaxed">
                HAPPY<br />BIRTHDAY!
              </h2>
              <p className="text-amber-400 text-sm">
                {BIRTHDAY_NAME}야, 생일 축하해! 🎉
              </p>
              <p className="text-stone-400 text-xs mt-2">
                오늘 하루도 행복하게 보내길 바랄게 ☕
              </p>
            </div>
          ) : (
            // 생일 전 카운트다운
            <div className="space-y-3">
              <p className="text-stone-300 text-xs">
                {BIRTHDAY_NAME}의 생일까지
              </p>
              {/* DAYS — 단독 행 */}
              <div className="flex justify-center">
                <Digit value={timeLeft.days} label="DAYS" large />
              </div>
              {/* H : M : S — 두 번째 행 */}
              <div className="flex gap-2 justify-center items-start">
                <Digit value={timeLeft.hours}   label="HRS" />
                <span className="text-green-400 font-pixel text-2xl mt-3">:</span>
                <Digit value={timeLeft.minutes} label="MIN" />
                <span className="text-green-400 font-pixel text-2xl mt-3">:</span>
                <Digit value={timeLeft.seconds} label="SEC" />
              </div>
              <p className="text-stone-500 text-[11px]">
                {BIRTHDAY_DATE.toLocaleDateString('ko-KR', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </p>
            </div>
          )}
        </div>

        {/* LED 하단 장식 */}
        <div className="flex justify-center gap-1 pb-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-green-400 opacity-60"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    </Modal>
  );
}
