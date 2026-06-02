'use client';

import { useState } from 'react';
import { useCafeStore } from '@/store/cafeStore';
import { Modal } from '@/components/ui/Modal';
import { VIRTUAL_GOODS } from '@/data/config';

export function GoodsModal() {
  const activeModal = useCafeStore((s) => s.activeModal);
  const [cart, setCart]   = useState<Record<string, number>>({});
  const [bought, setBought] = useState(false);

  const toggle = (id: string) => {
    setCart((prev) => ({ ...prev, [id]: prev[id] ? 0 : 1 }));
  };

  const cartCount = Object.values(cart).filter(Boolean).length;

  const handleBuy = () => {
    if (cartCount === 0) return;
    setBought(true);
    setTimeout(() => { setBought(false); setCart({}); }, 2500);
  };

  return (
    <Modal isOpen={activeModal === 'goods'} maxWidth="max-w-sm">
      <div className="p-5">
        <div className="text-center mb-4">
          <h2 className="font-bold" style={{ fontSize: '0.8rem', color: '#3d2310' }}>★ 굿즈 매대 ★</h2>
          <p style={{ fontSize: '0.65rem', color: '#6b4423', marginTop: '4px' }}>0719 공식 굿즈 (가상 판매)</p>
        </div>

        {bought ? (
          <div className="py-6 text-center space-y-2">
            <div style={{ fontSize: '2.5rem' }}>🎁</div>
            <p style={{ fontSize: '0.65rem', fontWeight: 'bold', color: '#3d2310' }}>구매 완료!</p>
            <p style={{ fontSize: '0.65rem', color: '#6b4423' }}>소중히 간직할게요 💛</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {VIRTUAL_GOODS.map((item) => {
                const inCart = !!cart[item.id];
                return (
                  <button
                    key={item.id}
                    onClick={() => toggle(item.id)}
                    className="flex flex-col items-center gap-1 p-3 text-center transition-all"
                    style={{
                      background: inCart ? '#fef08a' : '#e8d0a0',
                      border: `3px solid ${inCart ? '#a16207' : '#3d2310'}`,
                      boxShadow: inCart
                        ? 'inset 2px 2px 0 #fdf4d0, inset -2px -2px 0 #a07000, 2px 2px 0 rgba(0,0,0,0.3)'
                        : 'inset 2px 2px 0 #f5e8c0, inset -2px -2px 0 #c9a87c, 2px 2px 0 rgba(0,0,0,0.3)',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>{item.emoji}</span>
                    <span style={{ fontSize: '0.55rem', fontWeight: 'bold', color: '#3d2310', lineHeight: 1.3 }}>{item.name}</span>
                    <span style={{ fontSize: '0.55rem', color: '#8a4a00', fontWeight: 'bold' }}>{item.price}</span>
                    <span style={{ fontSize: '0.55rem', color: '#6b4423' }}>재고 {item.stock}</span>
                    {inCart && (
                      <span style={{ fontSize: '0.55rem', color: '#166534', fontWeight: 'bold' }}>✓ 담김</span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleBuy}
              disabled={cartCount === 0}
              className="px-btn px-btn-amber w-full"
            >
              {cartCount > 0 ? `${cartCount}개 담기 🛒` : '굿즈를 선택하세요'}
            </button>
          </>
        )}
      </div>
    </Modal>
  );
}
