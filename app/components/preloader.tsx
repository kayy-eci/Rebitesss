'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Preloader({ onDone }: { onDone?: () => void }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) {
      setProgress(100);
      const t = setTimeout(() => {
        setDone(true);
        onDone?.();
      }, 200);
      return () => clearTimeout(t);
    }

    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 14 + 6;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => {
          setDone(true);
          onDone?.();
        }, 380);
      } else {
        setProgress(current);
      }
    }, 130);

    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-primary"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="grain-overlay flex flex-col items-center px-6">
            <div className="flex items-baseline gap-1 text-primary-foreground">
              <span className="font-display text-5xl font-medium tracking-tight sm:text-7xl">
                Re
              </span>
              <span className="font-display text-5xl font-light italic tracking-tight sm:text-7xl">
                Bites
              </span>
            </div>
            <p className="mt-3 font-sans text-[11px] uppercase tracking-[0.3em] text-primary-foreground/60">
              Selamatkan makanan surplus
            </p>

            <div className="mt-10 h-px w-48 overflow-hidden bg-primary-foreground/20 sm:w-64">
              <motion.div
                className="h-full bg-primary-foreground"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="mt-3 font-sans text-[10px] tabular-nums tracking-widest text-primary-foreground/50">
              {Math.round(progress).toString().padStart(3, '0')}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
