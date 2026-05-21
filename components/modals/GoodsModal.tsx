'use client';

import { useState } from 'react';
import { useCafeStore } from '@/store/cafeStore';
import { Modal } from '@/components/ui/Modal';
import { VIRTUAL_GOODS } from '@/data/config';

export function GoodsModal() {
  const activeModal = useCafeStore((s) => s.activeModal);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [bought, setBought] = useState(false);

  const toggle = (id: string) => {
    setCart((prev) => ({ ...prev, [id]: prev[id] ? 0 : 1 }));
  };

  const cartCount = Object.values(cart).filter(Boolean).length;

  const handleBuy = () => {
    if (cartCount === 0) return;
    setBought(true);
    setTimeout(() => {
      setBought(false);
      setCart({});
    }, 2500);
  };

  return (
    <Modal isOpen={activeModal === 'goods'} maxWidth="max-w-sm">
      <div className="p-5">
        <div className="text-center mb-4">
          <h2 className="text-base font-bold">🛍️ 굿즈 매대</h2>
          <p className="text-xs text-gray-400 mt-0.5">0719 공식 굿즈 (가상 판매)</p>
        </div>

        {bought ? (
          <div className="py-8 text-center space-y-2">
            <div className="text-4xl">🎁</div>
            <p className="font-bold text-sm">구매 완료!</p>
            <p className="text-xs text-gray-400">소중히 간직할게요 💛</p>
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
                    className={[
                      'flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-center transition-all',
                      inCart
                        ? 'border-amber-400 bg-amber-50 scale-[1.02]'
                        : 'border-gray-200 bg-white hover:border-gray-300',
                    ].join(' ')}
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="text-xs font-medium leading-tight">{item.name}</span>
                    <span className="text-xs text-amber-600 font-bold">{item.price}</span>
                    <span className="text-[10px] text-gray-400">재고 {item.stock}</span>
                    {inCart && (
                      <span className="text-[10px] text-amber-600 font-bold">✓ 담김</span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleBuy}
              disabled={cartCount === 0}
              className={[
                'w-full py-2.5 rounded-xl text-sm font-bold transition-all',
                cartCount > 0
                  ? 'bg-amber-400 text-stone-900 hover:bg-amber-300 active:scale-95'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed',
              ].join(' ')}
            >
              {cartCount > 0 ? `${cartCount}개 담기 🛒` : '굿즈를 선택하세요'}
            </button>
          </>
        )}
      </div>
    </Modal>
  );
}
