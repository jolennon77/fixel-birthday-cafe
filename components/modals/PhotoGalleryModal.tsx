'use client';

import { useCafeStore } from '@/store/cafeStore';
import { Modal } from '@/components/ui/Modal';

export function PhotoGalleryModal() {
  const activeModal = useCafeStore((s) => s.activeModal);

  return (
    <Modal isOpen={activeModal === 'gallery'} maxWidth="max-w-lg">
      <div className="p-5">
        <h2 className="font-bold text-center mb-4" style={{ fontSize: '0.8rem', color: '#3d2310' }}>
          ★ 사진 갤러리 ★
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="px-inset aspect-square flex items-center justify-center"
              style={{ fontSize: '2.5rem' }}
            >
              🖼
            </div>
          ))}
        </div>
        <p className="text-center mt-4" style={{ fontSize: '0.55rem', color: '#8a6040', fontFamily: 'var(--font-pixel), monospace' }}>
          /public/photos/ 에 사진을 추가하세요
        </p>
      </div>
    </Modal>
  );
}
