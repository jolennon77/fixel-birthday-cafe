'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCafeStore } from '@/store/cafeStore';

export function InteractionHint() {
  const nearbyObject = useCafeStore((s) => s.nearbyObject);
  const nearbyNpc    = useCafeStore((s) => s.nearbyNpc);

  const label = nearbyNpc
    ? `💬 ${nearbyNpc.name}에게 말 걸기 [E]`
    : (nearbyObject?.label ?? null);

  return (
    <AnimatePresence>
      {label && (
        <motion.div
          key="hint"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-[168px] left-1/2 -translate-x-1/2 z-20 md:bottom-6 md:left-1/2"
        >
          <div className="bg-black/70 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm font-medium whitespace-nowrap">
            {label}
            <span className="ml-2 opacity-60 hidden md:inline">[E]</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
