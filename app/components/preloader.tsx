'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Preloader({ onDone }: { onDone?: () => void }) {
  const [done, setDone] = useState(false);
  const finishedRef = useRef(false);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setDone(true);
    onDone?.();
  }, [onDone]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish();
      return;
    }

    const safety = setTimeout(finish, 5500);
    return () => clearTimeout(safety);
  }, [finish]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[200] bg-black"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <video
            className="h-full w-full object-cover"
            src="/loading.mp4"
            autoPlay
            muted
            playsInline
            onEnded={finish}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
