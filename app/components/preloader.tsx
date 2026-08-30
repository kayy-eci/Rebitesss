'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const PRELOADED_KEY = 'rebites-preloaded-v1';

export function Preloader({ onDone }: { onDone?: () => void }) {
  const [done, setDone] = useState(false);
  const [skipped, setSkipped] = useState(false);
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

    const safety = setTimeout(() => finish(true), 2600);
    return () => clearTimeout(safety);
  }, [finish]);

  if (skipped) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div className="fixed inset-0 z-[200] overflow-hidden">
          {/* Lingkaran raksasa di tengah; saat masuk ia terangkat ke atas. */}
          <motion.div
            className="absolute left-1/2 top-1/2 flex flex-col items-center justify-center rounded-full bg-primary"
            style={{ width: '200vmax', height: '200vmax', marginLeft: '-100vmax', marginTop: '-100vmax' }}
            initial={false}
            exit={{ y: '-160vh', scale: 0.5 }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.div
              className="flex flex-col items-center gap-4 px-10 text-center"
              initial={{ opacity: 0, scale: 0.8, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
            >
              <span className="flex h-24 w-24 items-center justify-center rounded-full bg-cream p-1.5 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.6)]">
                <Image
                  src="/logo.png"
                  alt="ReBites"
                  width={96}
                  height={96}
                  priority
                  className="h-full w-full rounded-full object-cover"
                />
              </span>

              <span className="font-display text-4xl font-semibold tracking-tight text-cream">
                Re<span className="font-light italic">Bites</span>
              </span>

              <span className="mt-1 flex items-center justify-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-cream/80"
                    animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{
                      duration: 0.9,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
