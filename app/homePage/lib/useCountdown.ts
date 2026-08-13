'use client';

import { useEffect, useState } from 'react';

export function useCountdown(deadlineIso: string) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const deadline = new Date(deadlineIso).getTime();

    const tick = () => {
      const diff = deadline - Date.now();
      setRemaining(Math.max(0, Math.floor(diff / 1000)));
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [deadlineIso]);

  return remaining;
}

export function formatCountdown(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
}
