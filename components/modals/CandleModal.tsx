'use client';

import { useCafeStore } from '@/store/cafeStore';
import { Modal } from '@/components/ui/Modal';

export function CandleModal() {
  const activeModal = useCafeStore((s) => s.activeModal);
  const candleBlown = useCafeStore((s) => s.candleBlown);

  return (
    <Modal isOpen={activeModal === 'candle'} maxWidth="max-w-sm">
      <div className="p-8 text-center">
        <div className="text-6xl mb-4">
          {candleBlown ? '🎊' : '🎂'}
        </div>
        <h2 className="text-lg font-bold mb-2">
          {candleBlown ? '소원이 이뤄질 거예요!' : '촛불을 불어 끄세요!'}
        </h2>
        <p className="text-sm text-gray-500">
          {candleBlown
            ? '생일 축하해요 🎉'
            : '마이크에 바람을 불면 촛불이 꺼져요'}
        </p>
        <p className="text-xs text-gray-400 mt-4">
          (마이크 연동은 곧 추가될 예정이에요)
        </p>
      </div>
    </Modal>
  );
}
