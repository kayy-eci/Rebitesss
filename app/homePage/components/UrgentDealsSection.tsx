'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Clock, Flame, MapPin, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatRupiah, urgentItems } from '../lib/data';
import { useCountdown, formatCountdown } from '../lib/useCountdown';
import { useCart } from '../lib/cart-store';
import { Badge } from './ui/Badge';
import { SmartImage } from './ui/SmartImage';
import type { UrgentItem } from '../lib/types';

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50';

function UrgentCard({ item }: { item: UrgentItem }) {
  const { addItem } = useCart();
  const remaining = useCountdown(item.expiresAt);
  const isExpired = remaining === 0;
  const isLow = remaining !== null && remaining > 0 && remaining < 300;
  const timeText =
    remaining === null
      ? '--:--:--'
      : isExpired
        ? 'Habis'
        : formatCountdown(remaining);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md shadow-forest-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-forest-900/15">
      <div className="relative aspect-[4/3] overflow-hidden bg-sage-100">
        <SmartImage
          src={item.image}
          alt={`Foto ${item.name} dari ${item.vendorName}`}
          sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
          className={cn(
            'transition-transform duration-500 group-hover:scale-105',
            isExpired && 'grayscale'
          )}
        />
        <div className="absolute left-3 top-3">
          <Badge variant="green">SURPLUS</Badge>
        </div>
        <div className="absolute right-3 top-3">
          <Badge variant="gold">{item.discountPercent}% OFF</Badge>
        </div>

        <div className="absolute inset-x-3 bottom-3">
          <div className="flex items-center gap-2 rounded-full bg-forest-900/85 px-4 py-2 backdrop-blur-sm">
            <Flame
              className={cn(
                'h-4 w-4 shrink-0',
                isExpired ? 'text-charcoal-500' : 'text-gold-500'
              )}
            />
            <span className="text-xs font-semibold text-cream-50">
              Berakhir dalam{' '}
              <span
                className={cn(
                  'tabular-nums',
                  isExpired
                    ? 'text-charcoal-500'
                    : isLow
                      ? 'text-red-800'
                      : 'text-gold-500'
                )}
              >
                {timeText}
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div>
          <h3 className="font-sans text-base font-bold leading-snug text-charcoal-900">
            {item.name}
          </h3>
          <p className="mt-0.5 text-sm text-charcoal-500">{item.vendorName}</p>
        </div>

        <div className="flex items-center gap-3 text-xs text-charcoal-500">
          <span className="flex items-center gap-1 font-medium">
            <Star className="h-3.5 w-3.5 fill-gold-500 text-gold-500" />
            {item.rating.toFixed(1)}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-sage-500" />
            {item.distanceKm} km
          </span>
        </div>

        <span className="w-fit rounded-full bg-cream-100 px-3 py-1 text-xs font-medium text-charcoal-500">
          {item.stockLabel}
        </span>

        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="text-sm text-charcoal-500 line-through">
            {formatRupiah(item.originalPrice)}
          </span>
          <span className="text-lg font-bold text-green-700">
            {formatRupiah(item.discountedPrice)}
          </span>
        </div>

        <motion.button
          type="button"
          disabled={isExpired}
          onClick={() => addItem(item.id)}
          aria-label={
            isExpired
              ? `${item.name} sudah habis`
              : `Selamatkan ${item.name} sekarang`
          }
          animate={!isExpired ? { scale: [1, 1.03, 1] } : undefined}
          transition={
            !isExpired
              ? { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
              : undefined
          }
          className={cn(
            'mt-1 flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold shadow-md transition-colors duration-200 active:scale-[0.98]',
            isExpired
              ? 'cursor-not-allowed bg-sage-100 text-charcoal-500'
              : 'bg-green-700 text-white shadow-green-700/20 hover:bg-green-600',
            FOCUS_RING
          )}
        >
          <Flame className="h-4 w-4 text-gold-500" />
          {isExpired ? 'Habis' : 'Selamatkan Sekarang'}
        </motion.button>
      </div>
    </article>
  );
}

export function UrgentDealsSection() {
  return (
    <section className="bg-cream-50 pb-16 pt-2 lg:pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2.5 font-sans text-3xl font-bold tracking-tight text-charcoal-900 sm:text-4xl">
              Segera Diselamatkan
              <Clock className="h-7 w-7 text-green-700 sm:h-8 sm:w-8" />
            </h2>
            <p className="mt-2 max-w-md font-inter text-sm text-charcoal-500">
              Penawaran dengan waktu terbatas. Kalau tidak kamu ambil, orang
              lain yang menyelamatkannya.
            </p>
          </div>
          <a
            href="#explore"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById('explore')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={cn(
              'group inline-flex w-fit items-center gap-1.5 font-inter text-sm font-semibold text-green-700 transition-colors hover:text-green-600',
              FOCUS_RING
            )}
          >
            Lihat Semua
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>

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
          {urgentItems.map((item) => (
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
              <UrgentCard item={item} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
