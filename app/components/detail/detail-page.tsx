'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ProfileNavbar } from '@/app/components/navbar';
import { SiteFooter } from '@/app/components/site-footer';
import { CartProvider, useCart } from './cart-context';
import { PageOrnaments } from './page-ornaments';
import { ProductBreadcrumb } from './product-breadcrumb';
import { ProductGallery } from './product-gallery';
import { ProductInfo } from './product-info';
import { ReviewSection } from './review-section';
import { RelatedProducts } from './related-products';
import { StickyMobileBar } from './sticky-mobile-bar';
import { PRODUCT, RELATED_PRODUCTS, REVIEWS } from '@/app/detailProduct/data';
import { EASE } from './anim';

export default function DetailPage() {
  return (
    <CartProvider>
      <DetailPageContent />
    </CartProvider>
  );
}

function DetailPageContent() {
  const rightColRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [toast, setToast] = useState<{ id: number; message: string } | null>(
    null
  );
  const { addToCart } = useCart();

  const notify = useCallback((message: string) => {
    setToast({ id: Date.now(), message });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const handleOrder = useCallback(() => {
    addToCart(PRODUCT);
    notify('Ditambahkan ke keranjang');
  }, [addToCart, notify]);

  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      notify('Link produk disalin ke clipboard');
    } catch {
      notify('Gagal menyalin link');
    }
  }, [notify]);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-cream-50 text-charcoal-900">
      <PageOrnaments />
      <ProfileNavbar />

      <main className="relative mx-auto max-w-[1200px] px-5 pb-10 pt-24 sm:px-8 lg:pt-28">
        <ProductBreadcrumb product={PRODUCT} onShare={handleShare} />

        {/* Grid 2 kolom: galeri sticky kiri, konten scroll kanan */}
        <div className="mt-8 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="lg:sticky lg:top-28">
            <ProductGallery product={PRODUCT} scrollTargetRef={rightColRef} />
          </div>

          <div ref={rightColRef} className="min-w-0">
            <ProductInfo
              product={PRODUCT}
              ctaRef={ctaRef}
              onOrder={handleOrder}
              notify={notify}
            />
          </div>
        </div>

        {/* Ulasan & produk terkait — full width, DI LUAR grid sticky */}
        <ReviewSection reviews={REVIEWS} product={PRODUCT} />
        <RelatedProducts products={RELATED_PRODUCTS} />
      </main>

      <StickyMobileBar product={PRODUCT} ctaRef={ctaRef} onOrder={handleOrder} />

      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.25, ease: EASE }}
            role="status"
            className="fixed bottom-24 right-4 z-[70] rounded-full bg-forest-900 px-4 py-2.5 text-sm font-medium text-cream-50 shadow-xl lg:bottom-6 lg:right-6"
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <SiteFooter />
    </div>
  );
}
