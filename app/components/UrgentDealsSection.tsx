"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCatalog } from "@/lib/catalog";
import { FoodCard } from "@/app/components/FoodCard";
import { SearchFilterBar } from "@/app/components/SearchFilterBar";
import { SoftBlob } from "@/app/components/ornaments";
import type { FilterKey } from "@/lib/types";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel focus-visible:ring-offset-2 focus-visible:ring-offset-primary";

const MAX_ITEMS = 8;

const SPARKLES = [
  { top: "12%", left: "5%" },
  { top: "22%", right: "9%" },
  { top: "52%", left: "2%" },
  { bottom: "14%", right: "16%" },
  { bottom: "8%", left: "22%" },
];

export function UrgentDealsSection({
  onViewDetail,
  from = "landing",
}: {
  onViewDetail?: (id: string) => void;
  from?: "landing" | "home";
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState<FilterKey>("terdekat");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const { foodItems, loading } = useCatalog();

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
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  const scrollByStep = useCallback((dir: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const step = Math.max(el.clientWidth * 0.8, 320);
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  const items = useMemo(
    () =>
      [...foodItems].sort((a, b) => b.rating - a.rating).slice(0, MAX_ITEMS),
    [foodItems],
  );

  return (
    <section
      id="rekomendasi"
      data-nav="green"
      className="grain-overlay relative flex min-h-screen scroll-mt-24 flex-col justify-center overflow-hidden bg-primary py-16 lg:py-20"
    >
      <SoftBlob className="-left-24 top-1/4 h-80 w-80 bg-white/10" />
      <SoftBlob className="-right-24 bottom-0 h-96 w-96 bg-gold-500/15" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-white/[0.06] blur-3xl" />

      {SPARKLES.map((pos, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="pointer-events-none absolute text-white/50"
          style={pos}
          animate={{
            y: [0, -12, 0],
            rotate: [0, 45, 0],
            opacity: [0.25, 0.9, 0.25],
          }}
          transition={{
            duration: 4.5 + i * 0.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        >
          ✦
        </motion.span>
      ))}

      <div className="relative mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E53935]" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#E53935]" />
              </span>
              <span className="font-sans text-xs font-bold uppercase tracking-[0.3em] text-white/90">
                Rekomendasi Untukmu
              </span>
            </div>

            <h2 className="mt-3 font-sans text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Menu <span className="text-caramel">unggulan</span> hari ini
            </h2>
          </div>
        </div>

        <div className="mb-10 mt-8 lg:mt-10">
          <SearchFilterBar
            query={searchQuery}
            onQueryChange={setSearchQuery}
            onSearchSubmit={() => undefined}
            activeFilter={searchFilter}
            onFilterChange={setSearchFilter}
            showLocation={false}
            showInlineResults
            onSelectResult={onViewDetail}
            variant="glass"
          />
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => scrollByStep(-1)}
            disabled={!canLeft}
            aria-label="Geser rekomendasi makanan ke kiri"
            className={cn(
              "absolute -left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white text-charcoal-900 shadow-xl shadow-black/20 transition-all duration-200 hover:bg-caramel hover:text-white active:scale-[0.95] sm:-left-5 sm:h-11 sm:w-11",
              !canLeft &&
                "cursor-default opacity-35 hover:bg-white hover:text-charcoal-900",
              FOCUS_RING,
            )}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <motion.div
            ref={scrollRef}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.06 } },
            }}
            className="mt-2 grid snap-x snap-mandatory auto-cols-[85%] grid-flow-col gap-5 overflow-x-auto scroll-smooth pb-6 sm:auto-cols-[calc((100%-1.25rem)/2)] lg:auto-cols-[calc((100%-3.75rem)/4)] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {loading && (
              <div className="flex h-56 items-center justify-center text-sm text-white/70">
                Memuat menu...
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
              "absolute -right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white text-charcoal-900 shadow-xl shadow-black/20 transition-all duration-200 hover:bg-caramel hover:text-white active:scale-[0.95] sm:-right-5 sm:h-11 sm:w-11",
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
