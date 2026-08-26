"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCatalog } from "@/lib/catalog";
import type { FoodItem } from "@/lib/types";
import { FoodCard } from "@/app/components/FoodCard";
import { SoftBlob } from "@/app/components/ornaments";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50";

type FoodFilter = "semua" | "diskon-terbesar" | "segera-habis" | "terdekat";

const FILTERS: { key: FoodFilter; label: string }[] = [
  { key: "semua", label: "Semua" },
  { key: "diskon-terbesar", label: "Diskon Terbesar" },
  { key: "segera-habis", label: "Segera Habis" },
  { key: "terdekat", label: "Terdekat" },
];

const MAX_ITEMS = 8;

export function FoodRecommendationSection({ onViewDetail }: { onViewDetail?: (id: string) => void }) {
  const { foodItems, loading, error } = useCatalog();
  const [activeFilter, setActiveFilter] = useState<FoodFilter>("semua");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    // Data katalog & filter datang/berubah async -> hitung ulang chevron.
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows, foodItems.length, activeFilter]);

  const scrollByStep = useCallback((dir: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const step = Math.max(el.clientWidth * 0.8, 320);
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  const items = useMemo(() => {
    let list = [...foodItems];

    switch (activeFilter) {
      case "diskon-terbesar":
        list.sort((a, b) => b.discountPercent - a.discountPercent);
        break;
      case "segera-habis":
        list = list.filter((item) => item.expiresAt);
        list.sort(
          (a, b) =>
            new Date(a.expiresAt!).getTime() - new Date(b.expiresAt!).getTime(),
        );
        break;
      case "terdekat":
        list.sort((a, b) => a.distanceKm - b.distanceKm);
        break;
      default:
        list.sort((a, b) => b.rating - a.rating);
    }

    return list.slice(0, MAX_ITEMS);
  }, [activeFilter, foodItems]);

  const scrollToVendors = () => {
    document.getElementById("umkm")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="rekomendasiMakanan"
      data-nav="cream"
      className="relative overflow-hidden scroll-mt-24 bg-cream-50 py-16 lg:py-20"
    >
      <SoftBlob className="-left-24 top-1/3 h-80 w-80 bg-sage-100/60" />
      <SoftBlob className="-right-24 bottom-0 h-96 w-96 bg-forest-900/5" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="mt-3 font-sans text-3xl font-bold tracking-tight text-charcoal-900 sm:text-4xl">
              Menu unggulan hari ini
            </h2>
            <p className="mt-2 max-w-md font-sans text-sm text-charcoal-500">
              Pilihan makanan surplus dengan rating terbaik dari UMKM terdekat.
            </p>
          </div>
        </div>

        <div
          role="group"
          aria-label="Filter rekomendasi makanan"
          className="mt-8 flex flex-wrap items-center gap-2"
        >
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter.key;
            return (
              <button
                key={filter.key}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveFilter(filter.key)}
                className={cn(
                  "rounded-full border px-4 py-2 font-sans text-sm font-semibold transition-all duration-200",
                  isActive
                    ? "border-transparent bg-[#C8A882] text-white shadow-md shadow-[#C8A882]/25 hover:bg-[#7A4E35]"
                    : "border-sage-100 bg-white text-charcoal-500 hover:border-[#C8A882]/30 hover:text-[#C8A882]",
                  FOCUS_RING,
                )}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <a
            href="#umkm"
            onClick={(e) => {
              e.preventDefault();
              scrollToVendors();
            }}
            className={cn(
              "group inline-flex w-fit items-center gap-1.5 font-sans text-sm font-semibold text-green-700 transition-colors hover:text-[#C8A882]",
              FOCUS_RING,
            )}
          >
            Lihat Semua
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => scrollByStep(-1)}
            disabled={!canLeft}
            aria-label="Geser rekomendasi makanan ke kiri"
            className={cn(
              "absolute -left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-sage-100 bg-white text-charcoal-900 shadow-md shadow-forest-900/5 transition-all duration-200 hover:bg-[#C8A882] hover:text-white active:scale-[0.95] sm:-left-5 sm:h-11 sm:w-11",
              !canLeft &&
                "cursor-default opacity-35 hover:bg-white hover:text-charcoal-900",
              FOCUS_RING,
            )}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <motion.div
            key={activeFilter}
            ref={scrollRef}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.06 } },
            }}
            className="mt-10 grid snap-x snap-mandatory auto-cols-[85%] grid-flow-col gap-5 overflow-x-auto scroll-smooth pb-6 sm:auto-cols-[calc((100%-1.25rem)/2)] lg:auto-cols-[calc((100%-3.75rem)/4)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {loading && (
              <div className="flex h-56 items-center justify-center text-sm text-charcoal-500">
                Memuat rekomendasi...
              </div>
            )}
            {!loading && error && (
              <div className="flex h-56 items-center justify-center text-sm text-red-600">
                Gagal memuat katalog: {error}
              </div>
            )}
            {!loading && !error && items.length === 0 && (
              <div className="flex h-56 items-center justify-center text-sm text-charcoal-500">
                Belum ada menu tersedia.
              </div>
            )}
            {!loading &&
              items.map((item) => (
              <motion.div
                key={item.id}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                className="min-w-0 snap-start"
              >
                <FoodCard item={item} onViewDetail={onViewDetail} />
              </motion.div>
              ))}
          </motion.div>

          <button
            type="button"
            onClick={() => scrollByStep(1)}
            disabled={!canRight}
            aria-label="Geser rekomendasi makanan ke kanan"
            className={cn(
              "absolute -right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-sage-100 bg-white text-charcoal-900 shadow-md shadow-forest-900/5 transition-all duration-200 hover:bg-[#C8A882] hover:text-white active:scale-[0.95] sm:-right-5 sm:h-11 sm:w-11",
              !canRight &&
                "cursor-default opacity-35 hover:bg-white hover:text-charcoal-900",
              FOCUS_RING,
            )}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
