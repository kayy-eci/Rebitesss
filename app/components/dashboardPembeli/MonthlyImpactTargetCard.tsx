'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Pencil } from 'lucide-react';
import { Card } from './Card';
import { useCountUp } from './useCountUp';

const CURRENT = 14;
const TARGET = 20;
const PERCENT = Math.round((CURRENT / TARGET) * 100);

export function MonthlyImpactTargetCard() {
  const reduced = useReducedMotion();
  const { ref, value } = useCountUp(CURRENT);

  return (
    <Card>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-charcoal-900">Target Penyelamatan Bulanan</h2>
        <button
          type="button"
          aria-label="Edit target penyelamatan"
          className="flex h-8 w-8 items-center justify-center rounded-full text-sage-500 transition-colors hover:bg-sage-100 hover:text-charcoal-900"
        >
          <Pencil className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-5 flex items-end justify-between gap-2">
        <p className="font-display text-3xl font-medium leading-none tracking-tight text-forest-900">
          <span ref={ref}>{value}</span>
          <span className="ml-1.5 text-sm font-normal text-sage-500">porsi</span>
        </p>
        <p className="inline-flex rounded-full bg-green-700 px-2.5 py-1 text-[11px] font-semibold text-white">
          {PERCENT}% tercapai
        </p>
      </div>

      <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-sage-100">
        {reduced ? (
          <div className="h-full rounded-full bg-green-700" style={{ width: `${PERCENT}%` }} />
        ) : (
          <motion.div
            className="h-full rounded-full bg-green-700"
            initial={{ width: 0 }}
            whileInView={{ width: `${PERCENT}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.15 }}
          />
        )}
      </div>

      <div className="mt-2 flex items-center justify-between text-xs">
        <p className="font-semibold text-charcoal-900">
          {CURRENT} porsi <span className="font-normal text-sage-500">diambil</span>
        </p>
        <p className="text-sage-500">Target {TARGET} porsi</p>
      </div>

      <p className="mt-3 rounded-xl bg-cream-50 px-3 py-2 text-[11px] leading-relaxed text-charcoal-500">
        Tinggal {TARGET - CURRENT} porsi lagi untuk mencapai target bulan ini. Terus berburu
        surplus favoritmu!
      </p>
    </Card>
  );
}
