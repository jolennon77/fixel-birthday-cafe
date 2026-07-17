'use client';

import Image from 'next/image';
import { useCafeStore } from '@/store/cafeStore';
import { Modal } from '@/components/ui/Modal';

const PHOTOS = ['/photos/1.jpg', '/photos/2.jpg', '/photos/3.jpg', '/photos/4.jpg'];

export function PhotoGalleryModal() {
  const activeModal = useCafeStore((s) => s.activeModal);

  return (
    <Modal isOpen={activeModal === 'gallery'} maxWidth="max-w-lg">
      <div className="p-5">
        <h2 className="font-bold text-center mb-4" style={{ fontSize: '0.8rem', color: '#3d2310' }}>
          ★ 사진 갤러리 ★
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {PHOTOS.map((src, i) => (
            <div
              key={src}
              className="px-inset aspect-square relative overflow-hidden rounded"
            >
              <Image
                src={src}
                alt={`추억 사진 ${i + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <p className="text-center mt-4" style={{ fontSize: '0.55rem', color: '#8a6040', fontFamily: 'var(--font-pixel), monospace' }}>
        </p>
      </div>
    </Modal>
  );
}
