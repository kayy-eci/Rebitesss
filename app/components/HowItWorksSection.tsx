'use client';

import { motion } from 'framer-motion';
import {
  ClipboardList,
  Heart,
  Search,
  type LucideIcon,
} from 'lucide-react';
import { DotPattern, LeafSprig, SoftBlob } from '@/app/components/ornaments';

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    icon: Search,
    title: 'Temukan',
    description:
      'Cari makanan surplus dari UMKM terdekat dengan filter kategori, lokasi, dan jarak.',
  },
  {
    icon: ClipboardList,
    title: 'Pesan',
    description:
      'Pilih menu favoritmu, tambahkan ke keranjang, dan selesaikan pemesanan dalam hitungan menit.',
  },
  {
    icon: Heart,
    title: 'Selamatkan',
    description:
      'Ambil pesananmu tepat waktu. Satu porsi terselamatkan, satu porsi tidak jadi sampah.',
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden scroll-mt-24 bg-cream-50 pb-20 pt-2 lg:pb-24"
    >
      <SoftBlob className="-right-28 top-10 h-80 w-80 bg-sage-100/60" />
      <DotPattern className="left-8 top-16 hidden h-24 w-24 text-sage-500/25 lg:block" />
      <LeafSprig className="-right-4 bottom-0 hidden h-44 w-44 rotate-12 text-sage-500/25 lg:block" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-sans text-3xl font-bold tracking-tight text-charcoal-900 sm:text-4xl">
            Cara Kerja ReBites
          </h2>
          <p className="mt-3 font-inter text-sm leading-relaxed text-charcoal-500 sm:text-base">
            Tiga langkah sederhana antara dapur UMKM dan piringmu.
          </p>
        </div>

        <div className="relative mt-14">
          {/* Garis penghubung */}
          <motion.div
            aria-hidden
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-[16.66%] right-[16.66%] top-10 hidden border-t-2 border-dashed border-sage-500/60 md:block"
          />

          <div className="grid gap-12 md:grid-cols-3 md:gap-8">
            {STEPS.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.18,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex flex-col items-center text-center"
              >
                <div className="relative">
                  <span className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full border border-sage-100 bg-white shadow-md shadow-forest-900/10">
                    <step.icon className="h-8 w-8 text-green-700" strokeWidth={1.6} />
                  </span>
                  <span className="absolute -right-2 -top-2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-green-700 font-sans text-xs font-bold text-white shadow-md">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-6 font-sans text-xl font-bold text-charcoal-900">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-xs font-inter text-sm leading-relaxed text-charcoal-500">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
