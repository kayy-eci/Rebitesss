'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PRELOADED_KEY = 'rebites-preloaded-v1';

export function Preloader({ onDone }: { onDone?: () => void }) {
  const [done, setDone] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const finishedRef = useRef(false);

  const finish = useCallback(
    (markPlayed: boolean) => {
      if (finishedRef.current) return;
      finishedRef.current = true;

      if (markPlayed) {
        try {
          window.sessionStorage.setItem(PRELOADED_KEY, '1');
        } catch {}
        setDone(true);
      } else {
        
        setSkipped(true);
      }
      onDone?.();
    },
    [onDone]
  );

  useEffect(() => {
    let alreadyPlayed = false;
    try {
      alreadyPlayed = window.sessionStorage.getItem(PRELOADED_KEY) === '1';
    } catch {}

    if (
      alreadyPlayed ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      finish(false);
      return;
    }

    setCanPlay(true);
    const safety = setTimeout(() => finish(true), 5500);
    return () => clearTimeout(safety);
  }, [finish]);

  if (skipped) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[200] bg-black"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          {canPlay && (
            <video
              className="h-full w-full object-cover"
              src="/loading.mp4"
              autoPlay
              muted
              playsInline
              onEnded={() => finish(true)}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
