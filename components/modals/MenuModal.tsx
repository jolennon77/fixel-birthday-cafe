'use client';

import { useCafeStore } from '@/store/cafeStore';
import { Modal } from '@/components/ui/Modal';
import { CAFE_MENU, BIRTHDAY_NAME } from '@/data/config';

export function MenuModal() {
  const activeModal = useCafeStore((s) => s.activeModal);

  return (
    <Modal isOpen={activeModal === 'menu'} maxWidth="max-w-sm">
      <div className="bg-emerald-900 rounded-2xl overflow-hidden">
        {/* 칠판 헤더 */}
        <div className="px-5 pt-5 pb-3 border-b border-emerald-700 text-center">
          <p className="text-emerald-300 text-[10px] tracking-widest mb-1">✦ TODAY&apos;S SPECIAL ✦</p>
          <h2 className="text-white font-bold text-base">{BIRTHDAY_NAME}의 생일 특선 메뉴</h2>
          <p className="text-emerald-400 text-xs mt-0.5">2026. 07. 19</p>
        </div>

        {/* 메뉴 목록 */}
        <div className="p-5 space-y-5">
          {CAFE_MENU.map((section) => (
            <div key={section.category}>
              <p className="text-emerald-300 text-xs font-bold mb-2">{section.category}</p>
              <div className="space-y-2">
                {section.items.map((item) => (
                  <div key={item.name} className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-white text-sm">{item.name}</p>
                      <p className="text-emerald-400 text-xs">{item.desc}</p>
                    </div>
                    <span className="text-amber-300 text-xs font-bold whitespace-nowrap shrink-0">
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 pb-4 text-center">
          <p className="text-emerald-600 text-[10px]">✦ 모든 메뉴는 가상입니다 ✦</p>
        </div>
      </div>
    </Modal>
  );
}
