'use client';

import { useCafeStore } from '@/store/cafeStore';
import { Modal } from '@/components/ui/Modal';

export function ReceiptModal() {
  const activeModal = useCafeStore((s) => s.activeModal);

  return (
    <Modal isOpen={activeModal === 'receipt'} maxWidth="max-w-xs">
      <div className="bg-amber-50 p-6 font-mono">
        <div className="text-center border-b border-dashed border-amber-300 pb-4 mb-4">
          <p className="text-xs text-gray-500">✦ ✦ ✦</p>
          <h2 className="text-xl font-bold mt-1">0719 PIXEL CAFE</h2>
          <p className="text-xs text-gray-500 mt-1">생일 초대장</p>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>날짜</span>
            <span>2025.07.19</span>
          </div>
          <div className="flex justify-between">
            <span>장소</span>
            <span>픽셀 카페</span>
          </div>
          <div className="flex justify-between">
            <span>주인공</span>
            <span>나미 🎂</span>
          </div>
        </div>
        <div className="border-t border-dashed border-amber-300 mt-4 pt-4 text-center text-xs text-gray-500">
          <p>생일 축하해요 💛</p>
          <p className="mt-1">✦ ✦ ✦</p>
        </div>
      </div>
    </Modal>
  );
}
