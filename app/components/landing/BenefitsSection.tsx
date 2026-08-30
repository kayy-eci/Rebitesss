'use client';

import { motion } from 'framer-motion';
import {
  PiggyBank,
  Recycle,
  Sprout,
  Store,
  type LucideIcon,
} from 'lucide-react';
import { FloatingLeaf, SoftBlob } from '@/app/components/shared/ornaments';

interface Benefit {
  icon: LucideIcon;
  title: string;
  description: string;
}

const BENEFITS: Benefit[] = [
  {
    icon: Recycle,
    title: 'Kurangi Food Waste',
    description:
      'Setiap pembelian menyelamatkan porsi yang layak konsumsi dari berakhir di tempat sampah.',
  },
  {
    icon: PiggyBank,
    title: 'Harga Lebih Hemat',
    description:
      'Makanan surplus dijual dengan diskon besar, nikmati kualitas sama, harga lebih ringan.',
  },
  {
    icon: Store,
    title: 'Dukung UMKM',
    description:
      'Setiap pesanan jadi pemasukan tambahan bagi pelaku usaha kuliner lokal di sekitarmu.',
  },
  {
    icon: Sprout,
    title: 'Berdampak untuk Lingkungan',
    description:
      'Mengurangi emisi gas rumah kaca yang lahir dari food waste di tempat pembuangan akhir.',
  },
];

export function BenefitsSection() {
  return (
    <section className="relative overflow-hidden bg-cream-50 pb-16 pt-2 lg:pb-20">
      <SoftBlob className="-left-28 bottom-10 h-80 w-80 bg-primary/5" />
      <SoftBlob className="-right-20 top-8 h-64 w-64 bg-caramel/10" />
      <FloatingLeaf
        className="right-10 top-16 hidden h-5 w-5 text-caramel/45 lg:block"
        delay={0.8}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-sans text-3xl font-bold tracking-tight text-charcoal-900 sm:text-4xl">
            Belanja Hemat. Selamatkan Makanan.
          </h2>
          <p className="mt-3 font-inter text-sm leading-relaxed text-charcoal-500 sm:text-base">
            Satu platform, tiga kemenangan, untuk dompetmu, untuk UMKM, dan
            untuk bumi.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {BENEFITS.map((benefit) => (
            <motion.div
              key={benefit.title}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              className="group rounded-2xl border border-sage-100 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sage-100 text-primary transition-colors duration-300 group-hover:bg-caramel group-hover:text-cream-50">
                <benefit.icon className="h-7 w-7" strokeWidth={1.6} />
              </span>
              <h3 className="mt-5 font-sans text-lg font-bold text-charcoal-900">
                {benefit.title}
              </h3>
              <p className="mt-2 font-inter text-sm leading-relaxed text-charcoal-500">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
