'use client';

import { motion, type Variants } from 'framer-motion';
import { ArrowRight, Recycle, Sparkles, Store } from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { SmartImage } from './ui/SmartImage';
import {
  ArcLines,
  DotPattern,
  FloatingLeaf,
  LeafSprig,
  SoftBlob,
} from './Ornaments';
import { scrollToId } from '../lib/scroll';

const HERO_IMAGE =
  'https://images.pexels.com/photos/16134564/pexels-photo-16134564.jpeg?auto=compress&cs=tinysrgb&w=1200';
const UMKM_IMAGE =
  'https://images.pexels.com/photos/2696064/pexels-photo-2696064.jpeg?auto=compress&cs=tinysrgb&w=800';

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden scroll-mt-24 bg-cream-50 px-4 pb-16 pt-24 sm:px-6 lg:px-8 lg:pb-24 lg:pt-28"
    >
      {/* Ornamen latar */}
      <SoftBlob className="-left-28 -top-28 h-80 w-80 bg-sage-100/70" />
      <SoftBlob className="-right-24 top-36 h-96 w-96 bg-green-700/10" />
      <ArcLines className="right-0 top-6 hidden h-[420px] w-[720px] text-sage-500/25 md:block" />
      <DotPattern className="bottom-12 left-6 hidden h-28 w-28 text-green-700/15 lg:block" />
      <FloatingLeaf className="left-10 top-40 hidden h-6 w-6 text-sage-500/50 lg:block" />
      <FloatingLeaf
        className="right-16 top-72 hidden h-5 w-5 text-gold-500/50 lg:block"
        delay={1.4}
      />
      <LeafSprig className="-left-6 bottom-6 hidden h-48 w-48 -rotate-12 text-sage-500/30 lg:block" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.55fr_1fr]"
      >
        {/* ── Card utama ─────────────────────────────── */}
        <motion.div
          variants={item}
          className="relative min-h-[420px] overflow-hidden rounded-3xl shadow-2xl shadow-forest-900/30 lg:min-h-[560px]"
        >
          <div className="absolute inset-0">
            <SmartImage
              src={HERO_IMAGE}
              alt="Hidangan dari makanan surplus yang masih layak konsumsi"
              sizes="(min-width: 1024px) 60vw, 100vw"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-forest-900/95 via-forest-900/65 to-forest-900/25" />

          <div className="relative flex h-full flex-col justify-end p-6 sm:p-10 lg:p-12">
            <Badge variant="glass" className="mb-5 w-fit text-cream-50">
              <Recycle className="h-3.5 w-3.5 text-gold-500" />
              Food Rescue
            </Badge>

            <h1 className="max-w-xl font-sans text-4xl font-bold leading-[1.05] tracking-tight text-cream-50 sm:text-5xl lg:text-[3.4rem]">
              Selamatkan Makanan,
              <br />
              Nikmati{' '}
              <span className="relative inline-block">
                Lebih Hemat
                <span className="absolute inset-x-0 -bottom-1 h-[3px] rounded-full bg-gold-500 sm:-bottom-2" />
              </span>
              .
            </h1>

            <p className="mt-5 max-w-md font-inter text-sm leading-relaxed text-cream-50/85 sm:text-base">
              Temukan makanan surplus layak konsumsi dari UMKM di sekitarmu
              dengan harga yang lebih ramah — tanpa mengorbankan rasa.
            </p>

            <div className="mt-7">
              <Button
                variant="cream"
                size="lg"
                onClick={() => scrollToId('explore')}
                className="group"
              >
                Jelajahi Makanan
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </div>

            <p className="mt-5 flex items-center gap-2 font-inter text-xs text-cream-50/75 sm:text-sm">
              <Recycle className="h-4 w-4 text-gold-500" />
              12.540+ porsi makanan berhasil diselamatkan oleh komunitas
            </p>
          </div>
        </motion.div>

        {/* ── Kolom kanan: 2 card ────────────────────── */}
        <div className="grid gap-6">
          {/* Promo card */}
          <motion.div
            variants={item}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-700 to-green-600 p-6 shadow-lg shadow-green-700/25 transition-transform duration-300 hover:scale-[1.02] sm:p-8"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <Badge variant="gold" className="w-fit">
              <Sparkles className="h-3.5 w-3.5" />
              Hingga 60% OFF
            </Badge>
            <h2 className="mt-4 font-sans text-2xl font-bold leading-snug text-cream-50 sm:text-[1.7rem]">
              Diskon Besar,
              <br />
              Dampak Besar.
            </h2>
            <p className="mt-2 max-w-[260px] font-inter text-sm leading-relaxed text-cream-50/80">
              Satu pesanan menghemat pengeluaranmu sekaligus menyelamatkan
              porsi makanan dari tempat sampah.
            </p>
            <Button
              variant="outlineCream"
              size="sm"
              className="mt-5"
              onClick={() => scrollToId('explore')}
            >
              Lihat Promo
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </motion.div>

          {/* UMKM card */}
          <motion.div
            variants={item}
            className="group relative overflow-hidden rounded-3xl shadow-lg shadow-forest-900/20 transition-transform duration-300 hover:scale-[1.02]"
          >
            <div className="absolute inset-0">
              <SmartImage
                src={UMKM_IMAGE}
                alt="Pelaku UMKM menyiapkan bahan makanan di dapur"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </div>
            <div className="absolute inset-0 bg-forest-900/80 transition-colors duration-300 group-hover:bg-forest-900/70" />

            <div className="relative flex h-full flex-col justify-end p-6 sm:p-8">
              <Badge variant="glass" className="w-fit">
                <Store className="h-3.5 w-3.5 text-gold-500" />
                Untuk UMKM
              </Badge>
              <h2 className="mt-3 font-sans text-xl font-bold text-cream-50 sm:text-2xl">
                Punya Makanan Surplus?
              </h2>
              <p className="mt-1.5 max-w-[260px] font-inter text-sm leading-relaxed text-cream-50/80">
                Jual sekarang dengan harga diskon dan ubah sisa jadi
                pemasukan.
              </p>
              <Button
                variant="cream"
                size="sm"
                className="mt-5"
                onClick={() => scrollToId('umkm-cta')}
              >
                Mulai Jual
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
