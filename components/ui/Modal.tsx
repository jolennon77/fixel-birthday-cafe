'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCafeStore } from '@/store/cafeStore';

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  maxWidth?: string;
  hideCloseButton?: boolean;
}

export function Modal({ isOpen, children, maxWidth = 'max-w-md', hideCloseButton = false }: ModalProps) {
  const closeModal = useCafeStore((s) => s.closeModal);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(15,8,2,0.82)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          />
          <motion.div
            key="panel"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.88, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 6 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <div className={`relative w-full ${maxWidth} px-panel`}>
              {!hideCloseButton && (
                <button
                  onClick={closeModal}
                  aria-label="닫기"
                  className="px-btn px-btn-red absolute top-[-14px] right-[-14px] z-10 w-8 h-8"
                  style={{ padding: 0, fontSize: '0.6rem' }}
                >
                  ✕
                </button>
              )}
              <div className="overflow-y-auto" style={{ maxHeight: '82vh' }}>
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
