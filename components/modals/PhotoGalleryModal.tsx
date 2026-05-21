'use client';

import { useCafeStore } from '@/store/cafeStore';
import { Modal } from '@/components/ui/Modal';

export function PhotoGalleryModal() {
  const activeModal = useCafeStore((s) => s.activeModal);

  return (
    <Modal isOpen={activeModal === 'gallery'} maxWidth="max-w-lg">
      <div className="p-6">
        <h2 className="text-lg font-bold text-center mb-4">📷 사진 갤러리</h2>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-amber-100 rounded-xl flex items-center justify-center text-4xl border-2 border-dashed border-amber-300"
            >
              🖼
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">
          /public/photos/ 폴더에 사진을 넣으면 여기에 표시돼요
        </p>
      </div>
    </Modal>
  );
}
