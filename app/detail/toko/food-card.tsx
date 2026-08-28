"use client";

import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/app/components/Badge";
import { SmartImage } from "@/app/components/SmartImage";
import { formatRupiah } from "@/lib/data";
import type { FoodItem } from "@/lib/types";

function parseStock(label: string): number | null {
  const match = label.match(/\d+/);
  return match ? Number(match[0]) : null;
}

export function FoodCard({
  item,
  onSelect,
  forceUnavailable,
}: {
  item: FoodItem;
  onSelect: () => void;
  forceUnavailable?: boolean;
}) {
  const stock = parseStock(item.stockLabel);
  const lowStock = stock !== null && stock <= 3;
  const isUnavailable = forceUnavailable === true || item.stockLabel === "Habis";

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`Lihat detail ${item.name}`}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        "group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl bg-white shadow-md outline-none transition-all duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        isUnavailable
          ? "opacity-60 shadow-none hover:translate-y-0 hover:shadow-md"
          : "shadow-primary/5 hover:shadow-lg hover:shadow-primary/10"
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-sage-100">
        <SmartImage
          src={item.image}
          alt={`Foto ${item.name}`}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 34vw, 45vw"
          className={cn(
            "transition-transform duration-500 group-hover:scale-105",
            isUnavailable && "grayscale-[40%]"
          )}
        />
        <div className="absolute right-2.5 top-2.5">
          <Badge variant="gold">{item.discountPercent}% OFF</Badge>
        </div>
        {isUnavailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-charcoal-900/40">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-charcoal-900 shadow-lg">
              {stock === 0 ? "Stok Habis" : "Tidak Tersedia"}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="line-clamp-2 min-h-[2.5rem] font-sans text-sm font-bold leading-snug text-charcoal-900">
          {item.name}
        </h3>

        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-charcoal-500">
          <span className="flex items-center gap-1 rounded-full bg-gold-100 px-1.5 py-0.5 font-medium text-gold-600">
            <Star className="h-3 w-3 fill-gold-500 text-gold-500" />
            {item.rating.toFixed(1)}
          </span>
          {!lowStock && <span>{item.stockLabel}</span>}
        </div>

        <div className="mt-auto pt-0.5">
          <div className="flex flex-wrap items-baseline gap-x-1.5">
            <span className="text-base font-bold text-primary">
              {formatRupiah(item.discountedPrice)}
            </span>
            <span className="text-xs text-charcoal-500 line-through">
              {formatRupiah(item.originalPrice)}
            </span>
          </div>
        </div>

        {isUnavailable ? (
          <div className="mt-0.5 flex w-full items-center justify-center gap-2 rounded-full border border-sage-200 bg-sage-50 py-2 text-xs font-semibold text-charcoal-500">
            {stock === 0 ? "Stok Habis" : "Di Luar Jam Jual"}
          </div>
        ) : (
          <Link
            href={`/auth/register?produk=${item.id}`}
            onClick={(event) => event.stopPropagation()}
            className="mx-auto mt-0.5 flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full bg-primary px-5 py-2 text-xs font-semibold text-white shadow-md shadow-primary/20 transition-all duration-200 hover:bg-caramel active:scale-[0.98]"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Beli Sekarang
          </Link>
        )}
      </div>
    </article>
  );
}
