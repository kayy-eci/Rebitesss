'use client';

import { motion } from 'framer-motion';
import { Lock, MapPin } from 'lucide-react';
import type { ProductDetail } from '@/app/detailProduct/data';
import { formatIDR } from '@/app/detailProduct/data';
import { SectionReveal, fadeUpSmall, staggerContainer } from './anim';
import { Stars } from './stars';
import { VendorMiniCard } from './vendor-mini-card';
import { InfoGrid } from './info-grid';
import { TrustBadges } from './trust-badges';
import { PackageContents } from './package-contents';
import { CTAButtons } from './cta-buttons';

export function ProductInfo({
  product,
  ctaRef,
  onOrder,
  notify,
}: {
  product: ProductDetail;
  ctaRef: React.RefObject<HTMLDivElement>;
  onOrder: () => void;
  notify: (message: string) => void;
}) {
  const savings = product.originalPrice - product.discountedPrice;

  return (
    <div className="space-y-8">
      {/* Judul, meta, harga, deskripsi — fade-up saat load */}
      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={fadeUpSmall}
          className="font-display text-[clamp(2rem,3.5vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.02em] text-forest-deep"
        >
          {product.title}
        </motion.h1>

        <motion.div
          variants={fadeUpSmall}
          className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm"
        >
          <a
            href="#ulasan"
            className="inline-flex items-center gap-1.5 text-charcoal-500 transition-colors hover:text-green-700"
          >
            <Stars rating={product.rating} />
            <span className="font-semibold text-charcoal-900">
              {product.rating.toFixed(1)}
            </span>
            <span>({product.reviewCount} ulasan)</span>
          </a>
          <span aria-hidden className="text-sage-500">
            ·
          </span>
          <span className="inline-flex items-center gap-1 text-charcoal-500">
            <MapPin className="h-4 w-4 text-green-700" />
            {product.distanceKm.toLocaleString('id-ID')} km dari kamu
          </span>
        </motion.div>

        <motion.div
          variants={fadeUpSmall}
          className="mt-5 border-t border-sage-100"
        />

        <motion.div
          variants={fadeUpSmall}
          className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2"
        >
          <span className="font-display text-4xl font-semibold tracking-tight text-green-700">
            Rp{formatIDR(product.discountedPrice)}
          </span>
          <span className="font-sans text-lg text-charcoal-500 line-through">
            Rp{formatIDR(product.originalPrice)}
          </span>
          <span className="rounded-full bg-sage-100 px-3 py-1 text-xs font-semibold text-green-700">
            Hemat Rp{formatIDR(savings)}
          </span>
        </motion.div>

        <motion.p
          variants={fadeUpSmall}
          className="mt-5 max-w-xl font-inter text-sm leading-relaxed text-charcoal-500"
        >
          {product.description}
        </motion.p>
      </motion.div>

      <SectionReveal>
        <VendorMiniCard vendor={product.vendor} />
      </SectionReveal>

      <SectionReveal delay={0.05}>
        <InfoGrid product={product} />
      </SectionReveal>

      <SectionReveal delay={0.05}>
        <TrustBadges />
      </SectionReveal>

      <SectionReveal delay={0.05}>
        <PackageContents items={product.packageContents} />
      </SectionReveal>

      <div ref={ctaRef}>
        <SectionReveal amount={0.4}>
          <CTAButtons product={product} onOrder={onOrder} notify={notify} />
          <p className="mt-3 flex items-center gap-1.5 font-inter text-xs text-charcoal-500">
            <Lock className="h-3.5 w-3.5 text-green-700" />
            Pembayaran aman via QRIS &amp; e-wallet · Ambil sendiri di lokasi
            mitra
          </p>
        </SectionReveal>
      </div>
    </div>
  );
}
