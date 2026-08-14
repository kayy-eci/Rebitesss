'use client';

import { ArrowRight, SearchX } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { FoodCard } from '@/app/components/FoodCard';
import { DotPattern, SoftBlob } from '@/app/components/Ornaments';
import type { FoodItem } from '@/lib/types';

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50';

interface FoodGridProps {
  items: FoodItem[];
  onShowAll: () => void;
}

export function FoodGrid({ items, onShowAll }: FoodGridProps) {
  return (
    <section className="relative overflow-hidden scroll-mt-24 bg-cream-50 pb-16 pt-10 lg:pb-20 lg:pt-12">
      <SoftBlob className="-right-24 top-16 h-72 w-72 bg-sage-100/70" />
      <DotPattern className="bottom-16 right-10 hidden h-24 w-24 text-sage-500/25 lg:block" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-sans text-3xl font-bold tracking-tight text-charcoal-900 sm:text-4xl">
              Makanan Surplus di Sekitarmu
            </h2>
            <p className="mt-2 max-w-md font-inter text-sm text-charcoal-500">
              Diskon hingga 60% dari dapur UMKM terdekat, sebelum habis
              diselamatkan orang lain.
            </p>
          </div>
          <button
            type="button"
            onClick={onShowAll}
            className={cn(
              'group inline-flex w-fit items-center gap-1.5 font-inter text-sm font-semibold text-green-700 transition-colors hover:text-green-600',
              FOCUS_RING
            )}
          >
            Lihat Semua
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="mt-12 flex flex-col items-center rounded-3xl border border-dashed border-sage-100 bg-white/60 px-6 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cream-100 text-green-700">
              <SearchX className="h-7 w-7" />
            </span>
            <h3 className="mt-4 font-sans text-lg font-bold text-charcoal-900">
              Tidak ada makanan yang cocok
            </h3>
            <p className="mt-1 max-w-sm font-inter text-sm text-charcoal-500">
              Coba kata kunci atau kategori lain. Makanan baru ditambahkan
              setiap hari oleh UMKM di sekitarmu.
            </p>
            <button
              type="button"
              onClick={onShowAll}
              className={cn(
                'mt-6 rounded-full bg-green-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-600',
                FOCUS_RING
              )}
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.07 } },
            }}
            className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {items.map((item) => (
              <motion.div
                key={item.id}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
              >
                <FoodCard item={item} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
