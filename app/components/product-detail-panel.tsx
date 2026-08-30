"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Clock,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Star,
  Utensils,
} from "lucide-react";
import { formatRupiah } from "@/lib/data";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50";

export type FeaturedFood = {
  name: string;
  image: string;
  merchant: string;
  category: string;
  hours: string;
  price: number;
  originalPrice: number;
  badge?: string;
  rating: number;
  reviewCount: number;
  description: string;
};

type BuyState = "idle" | "loading" | "done";

const BUY_LABELS: Record<BuyState, string> = {
  idle: "Beli Sekarang",
  loading: "Menambahkan…",
  done: "Berhasil Ditambahkan",
};

function RichText({ text }: { text: string }) {
  const [before, after] = text.split("ReBites");
  if (after === undefined) return <>{text}</>;
  return (
    <>
      {before}
      <strong className="font-semibold text-caramel">ReBites</strong>
      {after}
    </>
  );
}

export function ProductDetailPanel({ food }: { food: FeaturedFood }) {
  const [qty, setQty] = useState(1);
  const [buyState, setBuyState] = useState<BuyState>("idle");

  const discount = Math.round((1 - food.price / food.originalPrice) * 100);

  const handleBuy = () => {
    if (buyState !== "idle") return;
    setBuyState("loading");
    window.setTimeout(() => setBuyState("done"), 900);
    window.setTimeout(() => setBuyState("idle"), 2600);
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      {/* A — Label kategori */}
      <span className="inline-flex w-fit items-center gap-2 rounded-full border border-caramel/40 bg-white px-4 py-1.5 font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-caramel shadow-[0_10px_22px_-16px_rgba(192,138,62,0.8)]">
        <Star className="h-3.5 w-3.5 fill-caramel text-caramel" />
        {food.badge ?? "Menu Favorit"}
      </span>

      {/* B — Judul produk (satu baris) */}
      <h3 className="font-display font-light leading-[1.08] tracking-[-0.02em] text-charcoal-900 [font-size:clamp(1.85rem,3.2vw,2.6rem)]">
        {food.name}
      </h3>

      {/* E — Badge kategori & jam buka (di bawah nama) */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-sage-500/30 bg-white px-3 py-1.5 font-sans text-xs font-semibold text-charcoal-600">
          <Utensils className="h-3.5 w-3.5 text-green-700" />
          {food.category}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-caramel/40 bg-white px-3 py-1.5 font-sans text-xs font-semibold text-charcoal-600">
          <Clock className="h-3.5 w-3.5 text-caramel" />
          Buka {food.hours}
        </span>
      </div>

      <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.18em] text-charcoal-500">
        {food.merchant}
      </p>

      {/* C — Rating & ulasan */}
      <div className="flex items-center gap-2" aria-label={`Rating ${food.rating} dari 5`}>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, s) => (
            <Star key={s} className="h-4 w-4 fill-amber text-amber" />
          ))}
        </div>
        <span className="font-sans text-sm font-bold text-charcoal-900">
          {food.rating.toFixed(1)}
        </span>
        <span className="font-sans text-sm text-charcoal-500">
          ({food.reviewCount} ulasan)
        </span>
      </div>

      {/* D — Deskripsi */}
      <p className="max-w-md font-sans text-[15px] leading-[1.6] text-muted-foreground">
        <RichText text={food.description} />
      </p>

      <span
        aria-hidden
        className="h-px w-full bg-gradient-to-r from-caramel/50 via-caramel/20 to-transparent"
      />

      {/* F — Blok harga */}
      <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
        <div className="flex flex-col">
          <span className="font-sans text-sm text-charcoal-500 line-through">
            {formatRupiah(food.originalPrice)}
          </span>
          <span className="mt-0.5 font-display text-[2.15rem] font-bold leading-none tracking-tight text-green-700 sm:text-[2.5rem]">
            {formatRupiah(food.price)}
          </span>
        </div>
        <span className="mb-1 inline-flex items-center rounded-full bg-sale px-2.5 py-1 font-sans text-xs font-bold text-white shadow-[0_8px_18px_-8px_rgba(229,57,53,0.6)]">
          -{discount}%
        </span>
      </div>

      {/* G + H — Quantity selector & CTA */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex w-fit items-center rounded-full border border-sage-500/40 bg-white p-1">
          <button
            type="button"
            aria-label="Kurangi jumlah"
            disabled={qty <= 1}
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className={FOCUS_RING + " flex h-9 w-9 items-center justify-center rounded-full text-charcoal-900 transition-colors duration-200 hover:bg-cream-100 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"}
          >
            <Minus className="h-4 w-4" />
          </button>

          <span
            aria-live="polite"
            className="w-10 text-center font-sans text-base font-bold tabular-nums text-charcoal-900"
          >
            {qty}
          </span>

          <button
            type="button"
            aria-label="Tambah jumlah"
            onClick={() => setQty((q) => Math.min(99, q + 1))}
            className={FOCUS_RING + " flex h-9 w-9 items-center justify-center rounded-full text-charcoal-900 transition-colors duration-200 hover:bg-cream-100"}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <motion.button
          type="button"
          onClick={handleBuy}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          aria-label="Beli sekarang"
          className={
            FOCUS_RING +
            " group inline-flex h-[52px] w-full items-center justify-center gap-3 rounded-full bg-green-700 px-8 sm:w-auto sm:min-w-[220px] sm:flex-1 font-sans text-[15px] font-bold text-white shadow-[0_18px_32px_-18px_rgba(27,77,50,0.85)] transition-colors duration-300 hover:bg-green-600"
          }
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber text-white transition-transform duration-300 group-hover:scale-110">
            {buyState === "loading" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : buyState === "done" ? (
              <Check className="h-4 w-4" />
            ) : (
              <ShoppingBag className="h-4 w-4" />
            )}
          </span>

          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={buyState}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {BUY_LABELS[buyState]}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}