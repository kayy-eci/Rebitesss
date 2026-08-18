"use client";

import { Clock, MapPin, Plus, Star } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatRupiah } from "@/lib/data";
import { SmartImage } from "@/app/components/SmartImage";
import type { FoodItem } from "@/lib/types";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50";

export function FoodCard({ item }: { item: FoodItem }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md shadow-forest-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-forest-900/15">
      <div className="relative aspect-[4/3] overflow-hidden bg-sage-100">
        <SmartImage
          src={item.image}
          alt={`Foto ${item.name} dari ${item.vendorName}`}
          sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <motion.div
          className="absolute right-3 top-3 z-20"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="relative rounded-lg bg-[#E53935] px-3 py-2 text-center text-white shadow-[0_10px_22px_-10px_rgba(34,81,56,0.85)]">
            <span className="block font-sans text-base font-black leading-none tabular-nums">
              {item.discountPercent}%
            </span>
            <span className="block font-sans text-[9px] font-bold uppercase leading-tight tracking-[0.18em]">
              Off
            </span>
            <span
              aria-hidden
              className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-[#E53935]"
            />
          </div>
        </motion.div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div>
          <h3 className="font-sans text-base font-bold leading-snug text-charcoal-900">
            {item.name}
          </h3>
          <p className="mt-0.5 text-sm text-charcoal-500">{item.vendorName}</p>
        </div>

        <div className="flex items-center gap-3 text-xs text-charcoal-500">
          <span className="flex items-center gap-1 font-medium">
            <Star className="h-3.5 w-3.5 fill-gold-500 text-gold-500" />
            {item.rating.toFixed(1)}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-sage-500" />
            {item.distanceKm} km
          </span>
        </div>

        <p className="flex items-center gap-1 text-xs text-charcoal-500">
          <Clock className="h-3.5 w-3.5 text-green-700" />
          Tersedia {item.availableFrom}–{item.availableTo}
        </p>

        <span className="w-fit rounded-full bg-cream-100 px-3 py-1 text-xs font-medium text-charcoal-500">
          {item.stockLabel}
        </span>

        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="text-sm text-charcoal-500 line-through">
            {formatRupiah(item.originalPrice)}
          </span>
          <span className="text-lg font-bold text-green-700">
            {formatRupiah(item.discountedPrice)}
          </span>
        </div>

        <button
          type="button"
          aria-label={`Lihat detail ${item.name}`}
          className={cn(
            "mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-green-700 py-2.5 text-sm font-semibold text-white shadow-md shadow-green-700/20 transition-all duration-200 hover:bg-[#8C5A3C] active:scale-[0.98]",
            FOCUS_RING,
          )}
        >
          Lihat Detail
        </button>
      </div>
    </article>
  );
}
