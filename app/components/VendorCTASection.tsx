'use client';

import { motion } from 'framer-motion';
import { ArrowRight, BadgeCheck } from 'lucide-react';
import { Button } from '@/app/components/Button';
import { SmartImage } from '@/app/components/SmartImage';
import { DotPattern, FloatingLeaf, SoftBlob } from '@/app/components/Ornaments';
import { scrollToId } from '@/lib/scroll';

const CTA_IMAGE =
  'https://images.pexels.com/photos/8964280/pexels-photo-8964280.jpeg?auto=compress&cs=tinysrgb&w=1000';

export function VendorCTASection() {
  return (
    <section
      id="umkm-cta"
      className="relative overflow-hidden scroll-mt-24 bg-cream-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
    >
      <SoftBlob className="-left-24 top-16 h-80 w-80 bg-sage-100/70" />
      <SoftBlob className="-right-24 bottom-0 h-72 w-72 bg-gold-100/50" />
      <FloatingLeaf
        className="right-10 top-12 hidden h-5 w-5 text-sage-500/50 lg:block"
        delay={1}
      />
      <DotPattern className="bottom-10 left-10 hidden h-24 w-24 text-green-700/15 lg:block" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Foto */}
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-2xl shadow-forest-900/25">
            <SmartImage
              src={CTA_IMAGE}
              alt="Tangan pelaku usaha menyiapkan bahan makanan untuk dijual kembali"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-900/40 to-transparent" />
            <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold text-cream-50 backdrop-blur-sm">
              <BadgeCheck className="h-3.5 w-3.5 text-gold-500" />
              UMKM ReBites
            </span>
          </div>
        </motion.div>

        {/* Konten */}
        <motion.div
          initial={{ opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-4 py-1.5 text-xs font-semibold text-charcoal-900">
            Untuk Pelaku Usaha
          </span>
          <h2 className="mt-5 font-sans text-3xl font-bold leading-tight tracking-tight text-charcoal-900 sm:text-4xl lg:text-[2.75rem]">
            Punya Makanan Surplus Hari Ini?
          </h2>
          <p className="mt-4 max-w-md font-inter text-sm leading-relaxed text-charcoal-500 sm:text-base">
            Unggah stok, atur diskon, dan jual dalam hitungan menit. Makanan
            yang tadinya terbuang berubah menjadi pemasukan tambahan untuk
            usahamu.
          </p>
          <div className="mt-8">
            <Button
              variant="solid"
              size="lg"
              className="group"
              onClick={() => scrollToId('how-it-works')}
            >
              Mulai Jual di ReBites
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>
          <p className="mt-4 flex items-center gap-2 font-inter text-xs text-charcoal-500">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
            Trial gratis 1 bulan untuk UMKM baru
          </p>
        </motion.div>
      </div>
    </section>
  );
}
