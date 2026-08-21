'use client';

import { useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { Card } from './Card';
import { FilterDropdown } from './FilterDropdown';
import { useCountUp } from './useCountUp';
import { partnerScoreByPeriod, periodOptions } from './data';

const SIZE = 200;
const STROKE = 14;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function PartnerScoreGaugeCard() {
  const [period, setPeriod] = useState('30-hari');
  const reduced = useReducedMotion();
  const data = partnerScoreByPeriod[period];
  const { ref, value } = useCountUp(data.score);
  const svgRef = useRef<SVGSVGElement>(null);
  const inView = useInView(svgRef, { once: true, margin: '-10% 0px' });

  const dashOffset = CIRCUMFERENCE * (1 - data.score / 100);

  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-sm font-bold text-charcoal-900">Skor Mitra</h2>
        <FilterDropdown
          value={period}
          onChange={setPeriod}
          options={periodOptions}
          ariaLabel="Pilih rentang waktu skor"
        />
      </div>

      <div className="relative mx-auto mt-2 h-[200px] w-[200px]">
        <svg
          ref={svgRef}
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          role="img"
          aria-label={`Skor Mitra ${data.score} persen`}
        >
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="#E4EBE4"
            strokeWidth={STROKE}
          />
          {reduced ? (
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="#1B4D32"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            />
          ) : (
            <motion.circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke="#1B4D32"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              initial={{ strokeDashoffset: CIRCUMFERENCE }}
              animate={
                inView
                  ? { strokeDashoffset: dashOffset }
                  : { strokeDashoffset: CIRCUMFERENCE }
              }
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.15 }}
              transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            />
          )}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="font-display text-[42px] font-medium leading-none tracking-tight text-forest-900">
            <span ref={ref}>{value}%</span>
          </p>
          <p className="mt-1 text-[11px] font-medium text-sage-500">Skor Mitra</p>
        </div>
      </div>

      <p className="mt-3 text-center text-sm font-medium text-charcoal-900">
        Tokomu mengungguli{' '}
        <span className="font-bold text-green-700">{data.score}%</span> toko lain bulan ini
      </p>
      <p className="mt-1 text-center text-[11px] leading-relaxed text-sage-500">
        Berdasarkan kecepatan respons, tingkat keterjualan, dan ulasan pelanggan
      </p>
      <p className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-cream-50 px-3 py-2 text-xs font-semibold text-green-700">
        <TrendingUp className="h-3.5 w-3.5" />
        +{data.deltaPercent}% dari bulan lalu
      </p>
    </Card>
  );
}
