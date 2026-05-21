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
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          />
          {/* Panel */}
          <motion.div
            key="panel"
            className={`fixed inset-0 z-50 flex items-center justify-center p-4`}
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          >
            <div className={`relative w-full ${maxWidth} bg-white rounded-2xl shadow-2xl overflow-hidden`}>
              {!hideCloseButton && (
                <button
                  onClick={closeModal}
                  className="absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-stone-900/50 hover:bg-stone-900/70 text-white text-xs backdrop-blur-sm transition-colors"
                  aria-label="닫기"
                >
                  ✕
                </button>
              )}
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
