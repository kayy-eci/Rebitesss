'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { vendors } from '@/lib/data';
import { VendorCard } from '@/app/components/VendorCard';
import { SoftBlob } from '@/app/components/ornaments';

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50';

export function VendorSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, [updateArrows]);

  const scrollByStep = useCallback((dir: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const step = Math.max(el.clientWidth * 0.8, 320);
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  }, []);

  return (
    <section
      id="umkm"
      className="relative overflow-hidden scroll-mt-24 bg-cream-50 pb-16 pt-2 lg:pb-20"
    >
      <SoftBlob className="-right-24 top-1/4 h-80 w-80 bg-sage-100/60" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-sans text-3xl font-bold tracking-tight text-charcoal-900 sm:text-4xl">
              Rekomendasi buat kamu sayang
            </h2>
            <p className="mt-2 max-w-md font-sans text-sm text-charcoal-500">
              Toko lokal yang rutin menyelamatkan makanan surplusnya setiap
              hari. Dukung mereka.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="#how-it-works"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById('how-it-works')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={cn(
                'group inline-flex w-fit items-center gap-1.5 font-sans text-sm font-semibold text-green-700 transition-colors hover:text-[#C8A882]',
                FOCUS_RING
              )}
            >
              Lihat Semua
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => scrollByStep(-1)}
            disabled={!canLeft}
            aria-label="Geser rekomendasi ke kiri"
            className={cn(
              'absolute -left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-sage-100 bg-white text-charcoal-900 shadow-md shadow-forest-900/5 transition-all duration-200 hover:bg-[#C8A882] hover:text-white active:scale-[0.95] sm:-left-5 sm:h-11 sm:w-11',
              !canLeft && 'cursor-default opacity-35 hover:bg-white hover:text-charcoal-900',
              FOCUS_RING
            )}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <motion.div
            ref={scrollRef}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.06 } },
            }}
            className="mt-10 grid snap-x snap-mandatory auto-cols-[85%] grid-flow-col gap-5 overflow-x-auto scroll-smooth pb-6 sm:auto-cols-[calc((100%-1.25rem)/2)] lg:auto-cols-[calc((100%-3.75rem)/4)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {vendors.map((vendor) => (
              <motion.div
                key={vendor.id}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                className="min-w-0 snap-start"
              >
                <VendorCard vendor={vendor} />
              </motion.div>
            ))}
          </motion.div>

          <button
            type="button"
            onClick={() => scrollByStep(1)}
            disabled={!canRight}
            aria-label="Geser rekomendasi ke kanan"
            className={cn(
              'absolute -right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-sage-100 bg-white text-charcoal-900 shadow-md shadow-forest-900/5 transition-all duration-200 hover:bg-[#C8A882] hover:text-white active:scale-[0.95] sm:-right-5 sm:h-11 sm:w-11',
              !canRight && 'cursor-default opacity-35 hover:bg-white hover:text-charcoal-900',
              FOCUS_RING
            )}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
