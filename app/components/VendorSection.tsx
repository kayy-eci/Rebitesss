'use client';

import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { vendors } from '@/lib/data';
import { VendorCard } from '@/app/components/VendorCard';
import { SoftBlob } from '@/app/components/Ornaments';

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50';

export function VendorSection() {
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
            <p className="mt-2 max-w-md font-inter text-sm text-charcoal-500">
              Toko lokal yang rutin menyelamatkan makanan surplusnya setiap
              hari. Dukung mereka.
            </p>
          </div>
          <a
            href="#how-it-works"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById('how-it-works')
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
      </div>
    </section>
  );
}
