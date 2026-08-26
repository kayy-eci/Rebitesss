'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Card } from './Card';
import { SalesEmptyState, CardLinesSkeleton } from './SalesEmptyState';
import { achievements } from './data';
import { useSellerOrders } from '@/hooks/use-seller-orders';

export function AchievementBadgesCard() {
  const reduced = useReducedMotion();
  const { hasOrders, hydrated } = useSellerOrders();
  const terkumpul = achievements.filter((badge) => badge.group === 'terkumpul');
  const sedangDiusahakan = achievements.filter(
    (badge) => badge.group === 'sedang-diusahakan'
  );

  return (
    <Card>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-charcoal-900">Pencapaian & Badge</h2>
        {hasOrders && (
          <button
            type="button"
            aria-label="Lihat semua pencapaian"
            className="text-xs font-semibold text-green-700 transition-colors hover:text-green-600"
          >
            Lihat Semua
          </button>
        )}
      </div>

      {!hydrated ? (
        <div className="mt-4">
          <CardLinesSkeleton />
        </div>
      ) : !hasOrders ? (
        <div className="mt-4">
          <SalesEmptyState
            title="Pencapaian belum tersedia"
            description="Badge dan capaian tokomu akan terbuka seiring aktivitas penjualan yang masuk."
          />
        </div>
      ) : (
        <>
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-sage-500">
          Lencana Terkumpul
        </p>
      <div className="mt-2.5 grid grid-cols-3 gap-2">
        {terkumpul.map((badge, index) => {
          const Icon = badge.icon;
          return (
            <motion.div
              key={badge.id}
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
              animate={
                reduced
                  ? { opacity: 1 }
                  : {
                      opacity: 1,
                      scale: 1,
                      boxShadow: [
                        '0 0 0px 0 rgba(27, 77, 50, 0)',
                        '0 0 26px 2px rgba(27, 77, 50, 0.4)',
                        '0 6px 16px -4px rgba(27, 77, 50, 0.35)',
                      ],
                    }
              }
              transition={{ duration: 0.5, delay: 0.15 + index * 0.08 }}
              className="flex flex-col items-center gap-1.5 rounded-2xl bg-cream-50 px-1 py-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-700 text-cream-50 shadow-md shadow-green-700/30">
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-center text-[10px] font-semibold leading-tight text-charcoal-900">
                {badge.name}
              </p>
            </motion.div>
          );
        })}
      </div>

      <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-sage-500">
        Sedang Diusahakan
      </p>
      <div className="mt-2.5 space-y-2.5">
        {sedangDiusahakan.map((badge, index) => {
          const Icon = badge.icon;
          const percent = Math.round((badge.current / badge.target) * 100);
          return (
            <div key={badge.id} className="flex items-center gap-3 rounded-2xl bg-cream-50 px-3 py-2.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage-100 text-sage-500">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-xs font-semibold text-charcoal-900">{badge.name}</p>
                  <p className="shrink-0 text-[11px] font-medium text-sage-500">
                    {badge.current}/{badge.target} {badge.unit}
                  </p>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-sage-100">
                  {reduced ? (
                    <div
                      className="h-full rounded-full bg-green-700"
                      style={{ width: `${percent}%` }}
                    />
                  ) : (
                    <motion.div
                      className="h-full rounded-full bg-green-700"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${percent}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 + index * 0.1 }}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
        </div>
        </>
      )}
    </Card>
  );
}
