"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Heart, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLikedFoods } from "@/hooks/use-liked-foods";
import type { ProductDetail } from "@/app/detail/product/data";

export function CTAButtons({
  product,
  onOrder,
  notify,
}: {
  product: ProductDetail;
  onOrder: () => void;
  notify: (message: string) => void;
}) {
  const { isLiked, toggle } = useLikedFoods();
  const saved = isLiked(product.id);
  const [added, setAdded] = useState(false);
  const reduce = useReducedMotion();

  const handleSave = async () => {
    const next = !saved;
    const ok = await toggle(product.id);
    if (ok) notify(next ? "Disimpan ke favorit" : "Dihapus dari favorit");
  };

  const handleOrder = () => {
    onOrder();
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <motion.button
        type="button"
        onClick={handleOrder}
        whileHover={reduce ? undefined : { scale: 1.02 }}
        whileTap={reduce ? undefined : { scale: 0.98 }}
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-green-700 px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-green-600 hover:shadow-[0_20px_45px_-20px_rgba(27,77,50,0.65)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50"
      >
        {added ? (
          <>
            <Check className="h-4 w-4" />
            Ditambahkan ke keranjang
          </>
        ) : (
          <>
            <ShoppingBag className="h-4 w-4" />
            Pesan Sekarang
          </>
        )}
      </motion.button>

      <motion.button
        type="button"
        aria-pressed={saved}
        aria-label={saved ? "Hapus dari favorit" : "Simpan ke favorit"}
        onClick={handleSave}
        whileTap={reduce ? undefined : { scale: 0.94 }}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3.5 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50",
          saved
            ? "border-green-700 bg-sage-100 text-green-700"
            : "border-sage-500/60 text-green-700 hover:bg-cream-100",
        )}
      >
        <motion.span
          className="inline-flex"
          key={saved ? "on" : "off"}
          initial={saved ? { scale: 0.5, rotate: -18 } : false}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 600, damping: 14 }}
        >
          <Heart
            className={cn("h-4 w-4", saved && "fill-green-700 text-green-700")}
          />
        </motion.span>
        {saved ? "Tersimpan" : "Simpan"}
      </motion.button>
    </div>
  );
}
