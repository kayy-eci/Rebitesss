'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import type { ProductDetail } from './data';
import { formatIDR } from './data';
import { EASE } from './anim';

export function StickyMobileBar({
  product,
  ctaRef,
  onOrder,
}: {
  product: ProductDetail;
  ctaRef: React.RefObject<HTMLDivElement>;
  onOrder: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      setVisible(rect.bottom < 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [ctaRef]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: reduce ? 0 : '100%' }}
          animate={{ y: 0 }}
          exit={{ y: reduce ? 0 : '100%' }}
          transition={{ duration: 0.35, ease: EASE }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-sage-100 bg-cream-50/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl lg:hidden"
        >
          <div className="mx-auto flex max-w-lg items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-500">
                Hemat {product.discountPercent}%
              </p>
              <p className="flex items-baseline gap-2">
                <span className="font-display text-xl font-semibold text-green-700">
                  Rp{formatIDR(product.discountedPrice)}
                </span>
                <span className="font-inter text-sm text-charcoal-500 line-through">
                  Rp{formatIDR(product.originalPrice)}
                </span>
              </p>
            </div>
            <button
              type="button"
              onClick={onOrder}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-green-700 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-green-600 active:scale-[0.98]"
            >
              <ShoppingBag className="h-4 w-4" />
              Pesan Sekarang
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
