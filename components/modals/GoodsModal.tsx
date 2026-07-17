'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCafeStore } from '@/store/cafeStore';
import { Modal } from '@/components/ui/Modal';
import { GOODS_DISPLAY } from '@/data/config';

export function GoodsModal() {
  const activeModal = useCafeStore((s) => s.activeModal);
  const closeModal  = useCafeStore((s) => s.closeModal);
  const [featured, setFeatured] = useState(0);

  const item = GOODS_DISPLAY[featured];

  return (
    <Modal isOpen={activeModal === 'goods'} maxWidth="max-w-sm">
      <div className="p-5">
        <div className="text-center mb-4">
          <h2 className="font-bold" style={{ fontSize: '0.8rem', color: '#3d2310' }}>★ 굿즈 전시대 ★</h2>
          <p style={{ fontSize: '0.65rem', color: '#6b4423', marginTop: '4px' }}>몬치치 인형들이 전시되어 있어요</p>
        </div>

        <div className="px-inset aspect-square relative overflow-hidden mb-2">
          <Image
            key={item.id}
            src={item.image}
            alt={item.name}
            fill
            className="object-contain pixel-crisp"
          />
        </div>
        <p className="text-center mb-4" style={{ fontSize: '0.65rem', fontWeight: 'bold', color: '#3d2310' }}>
          {item.name}
        </p>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {GOODS_DISPLAY.map((g, i) => (
            <button
              key={g.id}
              onClick={() => setFeatured(i)}
              className="relative aspect-square overflow-hidden transition-all"
              style={{
                border: `3px solid ${i === featured ? '#a16207' : '#3d2310'}`,
                boxShadow: i === featured
                  ? 'inset 2px 2px 0 #fdf4d0, inset -2px -2px 0 #a07000, 2px 2px 0 rgba(0,0,0,0.3)'
                  : 'inset 2px 2px 0 #f5e8c0, inset -2px -2px 0 #c9a87c, 2px 2px 0 rgba(0,0,0,0.3)',
                cursor: 'pointer',
                opacity: i === featured ? 1 : 0.75,
              }}
            >
              <Image src={g.image} alt={g.name} fill className="object-cover pixel-crisp" />
            </button>
          ))}
        </div>

        <button onClick={closeModal} className="px-btn px-btn-amber w-full">
          잘 구경했어요 ✨
        </button>
      </div>
    </Modal>
  );
}
