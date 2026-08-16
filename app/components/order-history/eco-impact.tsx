'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Recycle, Sprout, Store, Utensils } from 'lucide-react';
import { VeggieImpactScene, LeafSprig } from '@/app/components/order-history/ornaments';

const TARGET = 74;
const RADIUS = 64;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const IMPACT_STATS = [
  {
    label: 'Food saved',
    value: '24.8 kg',
    sub: 'Equivalent to 49 rescued meals',
    icon: <Leaf className="h-4 w-4" />,
    tint: 'bg-mint text-pine',
  },
  {
    label: 'CO₂e avoided',
    value: '18.6 kg',
    sub: 'Carbon emissions prevented',
    icon: <Recycle className="h-4 w-4" />,
    tint: 'bg-sage/25 text-pine',
  },
  {
    label: 'Local merchants',
    value: '6',
    sub: 'Community contribution',
    icon: <Store className="h-4 w-4" />,
    tint: 'bg-beige text-pine',
  },
];

export function OrderImpactPanel() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 1800;
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * TARGET));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const offset = CIRCUMFERENCE * (1 - value / 100);

  return (
    <section className="relative flex flex-col overflow-hidden rounded-2xl border border-pine/10 bg-white p-6 shadow-[0_10px_30px_-22px_rgba(40,89,67,0.35)] sm:p-7">
      <LeafSprig className="pointer-events-none absolute -left-6 -bottom-6 h-20 w-20 text-leaf/15 -scale-x-100" />

      <div className="relative">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-pine text-cream">
            <Sprout className="h-[18px] w-[18px]" strokeWidth={2.1} />
          </span>
          <h2 className="font-display text-lg font-medium tracking-tight text-ink">
            Your order impact
          </h2>
        </div>

        {/* Organic circular progress */}
        <div className="relative mt-6 flex justify-center">
          <div className="relative h-[190px] w-[190px]">
            <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
              <circle
                cx="80"
                cy="80"
                r={RADIUS}
                fill="none"
                stroke="#E9DFC8"
                strokeWidth="12"
              />
              <motion.circle
                cx="80"
                cy="80"
                r={RADIUS}
                fill="none"
                stroke="url(#orderImpactGrad)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
              />
              <defs>
                <linearGradient id="orderImpactGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#285943" />
                  <stop offset="55%" stopColor="#76B852" />
                  <stop offset="100%" stopColor="#A8C686" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mint text-pine">
                <Leaf className="h-4 w-4" strokeWidth={2.2} />
              </span>
              <span className="mt-2 font-display text-4xl font-medium tracking-tight tabular-nums text-ink">
                {value}%
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-moss">
                Rescue score
              </span>
            </div>
          </div>
        </div>

        {/* Warm illustration */}
        <div className="relative mt-6">
          <VeggieImpactScene className="h-36 w-full" />
        </div>

        {/* Stats */}
        <ul className="relative mt-5 space-y-2.5">
          {IMPACT_STATS.map((stat) => (
            <li
              key={stat.label}
              className="group flex items-center gap-3 rounded-2xl border border-pine/5 bg-cream/70 p-3 transition-all duration-300 hover:border-leaf/30 hover:bg-white"
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.tint} transition-transform duration-300 group-hover:scale-105`}
              >
                {stat.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink">{stat.value}</p>
                <p className="truncate text-xs text-moss">{stat.label}</p>
              </div>
              <span className="flex items-center gap-1 text-[11px] font-medium text-pine">
                <Utensils className="h-3 w-3 text-leaf" />
                {stat.sub}
              </span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="group relative mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-pine px-5 text-sm font-semibold text-cream transition-all duration-300 hover:bg-pine/90 hover:shadow-[0_12px_28px_-12px_rgba(40,89,67,0.6)]"
        >
          See full impact
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </button>
      </div>
    </section>
  );
}
