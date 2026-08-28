'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const STEPS = ['Pesanan', 'Pembayaran', 'Konfirmasi'];

export function StepIndicator({ active = 1 }: { active?: number }) {
  return (
    <div className="flex items-start gap-3 sm:gap-4">
      {STEPS.map((step, i) => {
        const done = i < active;
        const current = i === active;
        return (
          <div key={step} className="flex-1">
            <div className="h-1.5 overflow-hidden rounded-full bg-sage-100">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: done || current ? 1 : 0 }}
                transition={{ duration: 0.6, delay: 0.15 * (i + 1), ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  'h-full w-full origin-left rounded-full',
                  done ? 'bg-primary' : current ? 'bg-primary' : 'bg-sage-100'
                )}
              />
            </div>
            <p
              className={cn(
                'mt-2 text-[11px] font-medium tracking-wide',
                done || current ? 'text-primary' : 'text-sage-500'
              )}
            >
              {step}
            </p>
          </div>
        );
      })}
    </div>
  );
}
