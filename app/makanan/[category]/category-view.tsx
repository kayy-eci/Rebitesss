"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  PackageOpen,
  RotateCcw,
  SearchX,
  SlidersHorizontal,
} from "lucide-react";
import { Navbar } from "@/app/components/navbar";
import { SiteFooter } from "@/app/components/Footer";
import { FoodCard } from "@/app/components/FoodCard";
import { ProductDetailModal } from "@/app/components/ProductDetailModal";
import { SearchFilterBar } from "@/app/components/SearchFilterBar";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover";
import { Skeleton } from "@/app/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useCatalog } from "@/lib/catalog";
import type { FoodItem } from "@/lib/types";
import { getCategoryBySlug } from "@/lib/categories";
import type { ProductDetail } from "@/app/detail/product/data";
import { fetchProductDetail } from "@/app/detail/product/detail-data";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type SortKey = "terbaru" | "terdekat" | "harga-termurah" | "harga-termahal";
type DistanceRange = "semua" | "lt-1km" | "1km-3km" | "gt-3km";
type RatingThreshold = "semua" | "gte-4.5" | "gte-4" | "gte-3.5";

interface FilterState {
  distance: DistanceRange;
  rating: RatingThreshold;
  sort: SortKey;
}

const DEFAULT_FILTER_STATE: FilterState = {
  distance: "semua",
  rating: "semua",
  sort: "terbaru",
};

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "terbaru", label: "Terbaru" },
  { value: "terdekat", label: "Terdekat" },
  { value: "harga-termurah", label: "Harga termurah" },
  { value: "harga-termahal", label: "Harga tertinggi" },
];

const DISTANCE_OPTIONS: {
  value: DistanceRange;
  label: string;
}[] = [
  { value: "semua", label: "Semua" },
  { value: "lt-1km", label: "< 1 km" },
  { value: "1km-3km", label: "1–3 km" },
  { value: "gt-3km", label: "> 3 km" },
];

const RATING_OPTIONS: { value: RatingThreshold; label: string }[] = [
  { value: "semua", label: "Semua" },
  { value: "gte-4.5", label: "≥ 4.5" },
  { value: "gte-4", label: "≥ 4.0" },
  { value: "gte-3.5", label: "≥ 3.5" },
];

function matchesDistance(item: FoodItem, range: DistanceRange): boolean {
  switch (range) {
    case "lt-1km":
      return item.distanceKm < 1;
    case "1km-3km":
      return item.distanceKm >= 1 && item.distanceKm <= 3;
    case "gt-3km":
      return item.distanceKm > 3;
    default:
      return true;
  }
}

function matchesRating(item: FoodItem, threshold: RatingThreshold): boolean {
  switch (threshold) {
    case "gte-4.5":
      return item.rating >= 4.5;
    case "gte-4":
      return item.rating >= 4;
    case "gte-3.5":
      return item.rating >= 3.5;
    default:
      return true;
  }
}

function FilterOptionRow({
  active,
  label,
  onSelect,
}: {
  active: boolean;
  label: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors duration-150 hover:bg-cream-100",
        active ? "font-semibold text-green-700" : "text-charcoal-900",
        FOCUS_RING,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
          active ? "border-green-700" : "border-sage-200",
        )}
      >
        {active && <span className="h-2 w-2 rounded-full bg-green-700" />}
      </span>
      {label}
    </button>
  );
}

function FoodCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-md shadow-forest-900/5">
      <Skeleton className="aspect-[4/3] w-full rounded-none bg-sage-100" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-2/5" />
        <Skeleton className="h-10 w-full rounded-full" />
      </div>
    </div>
  );
}

export default function CategoryView({ slug, name }: { slug: string; name: string }) {
  const category = getCategoryBySlug(slug);
  const description =
    category?.description ??
    "Temukan makanan berlebih yang masih layak dinikmati di sekitarmu.";

  const [status, setStatus] = useState<"loading" | "ready">("loading");

  const [searchQuery, setSearchQuery] = useState("");
  const [filterState, setFilterState] = useState<FilterState>(DEFAULT_FILTER_STATE);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const { foodItems, loading: catalogLoading } = useCatalog();

  useEffect(() => {
    if (!catalogLoading) setStatus("ready");
  }, [catalogLoading]);

  const baseCategoryItems = useMemo(
    () => foodItems.filter((item) => item.category === name),
    [name, foodItems],
  );

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const result = baseCategoryItems
      .filter((item) => {
        if (query === "") return true;
        return (
          item.name.toLowerCase().includes(query) ||
          item.vendorName.toLowerCase().includes(query)
        );
      })
      .filter((item) => matchesDistance(item, filterState.distance))
      .filter((item) => matchesRating(item, filterState.rating));

    const sorted = [...result];
    switch (filterState.sort) {
      case "terdekat":
        sorted.sort((a, b) => a.distanceKm - b.distanceKm);
        break;
      case "harga-termurah":
        sorted.sort((a, b) => a.discountedPrice - b.discountedPrice);
        break;
      case "harga-termahal":
        sorted.sort((a, b) => b.discountedPrice - a.discountedPrice);
        break;
      case "terbaru":
      default:

        break;
    }
    return sorted;
  }, [baseCategoryItems, searchQuery, filterState]);

  const activeFilterCount =
    (filterState.distance !== "semua" ? 1 : 0) +
    (filterState.rating !== "semua" ? 1 : 0) +
    (filterState.sort !== "terbaru" ? 1 : 0);
  const hasFilters = activeFilterCount > 0 || searchQuery.trim() !== "";
  const [selectedProduct, setSelectedProduct] = useState<ProductDetail | null>(
    null
  );

  useEffect(() => {
    if (!selectedProductId) {
      setSelectedProduct(null);
      return;
    }
    let active = true;
    setSelectedProduct(null);
    fetchProductDetail(selectedProductId).then((detail) => {
      if (active) setSelectedProduct(detail ?? null);
    });
    return () => {
      active = false;
    };
  }, [selectedProductId]);

  const resetAll = () => {
    setFilterState(DEFAULT_FILTER_STATE);
    setSearchQuery("");
  };

  const isLoading = status === "loading";
  const isCategoryEmpty = !isLoading && baseCategoryItems.length === 0;
  const showNoResults =
    !isLoading && !isCategoryEmpty && filteredItems.length === 0;

  return (
    <div className="flex min-h-screen flex-col bg-cream-50">
      <Navbar />

      <main className="flex-1 pt-28">
        <section data-nav="cream" className="bg-cream-50 pb-16 pt-6 lg:pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            { }
            <Link
              href="/home "
              className={cn(
                "mt-4 inline-flex items-center gap-2 rounded-full border border-hairline bg-white px-4 py-2 text-sm font-medium text-charcoal-900 shadow-sm transition-all duration-200 hover:border-caramel hover:bg-cream-100 active:scale-[0.98]",
                FOCUS_RING,
              )}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Kembali
            </Link>

            { }
            <header className="mt-6 max-w-2xl">
              <h1 className="font-display text-3xl font-bold tracking-tight text-charcoal-900 sm:text-4xl">
                {name}
              </h1>
              <p className="mt-2 text-sm text-charcoal-500 sm:text-base">
                {description}
              </p>
              <p
                aria-live="polite"
                className="mt-3 inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700"
              >
                {isLoading ? "Memuat makanan…" : `${filteredItems.length} makanan tersedia`}
              </p>
            </header>

            { }
            <div className="mt-8 lg:mt-10">
              <SearchFilterBar
                query={searchQuery}
                onQueryChange={setSearchQuery}
                onSearchSubmit={() => undefined}
                showLocation={false}
                showInlineResults={false}
                variant="light"
                placeholder="Cari makanan di kategori ini..."
              />
            </div>

            { }
            <div className="mt-4">
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium shadow-sm transition-all duration-200 active:scale-[0.98]",
                      activeFilterCount > 0
                        ? "border-green-700 bg-green-700 text-white hover:bg-green-600"
                        : "border-hairline bg-white text-charcoal-900 hover:border-sage-500/60 hover:bg-cream-100",
                      FOCUS_RING,
                    )}
                  >
                    <SlidersHorizontal className="h-4 w-4" aria-hidden />
                    Filter
                    {activeFilterCount > 0 && (
                      <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-white/20 px-1.5 text-xs font-bold tabular-nums">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  side="bottom"
                  sideOffset={8}
                  collisionPadding={16}
                  className="max-h-[70vh] w-72 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl border-hairline bg-white p-4 shadow-xl shadow-forest-900/10"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-charcoal-900">Filter</p>
                    <button
                      type="button"
                      onClick={() => setFilterState(DEFAULT_FILTER_STATE)}
                      disabled={!hasFilters}
                      className={cn(
                        "inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold transition-colors disabled:pointer-events-none disabled:opacity-40",
                        hasFilters
                          ? "text-green-700 hover:bg-cream-100"
                          : "text-charcoal-500",
                        FOCUS_RING,
                      )}
                    >
                      <RotateCcw className="h-3 w-3" aria-hidden />
                      Reset
                    </button>
                  </div>

                  <fieldset className="mt-3">
                    <legend className="text-xs font-semibold uppercase tracking-wide text-charcoal-500">
                      Lokasi
                    </legend>
                    <div
                      role="radiogroup"
                      aria-label="Filter jarak lokasi"
                      className="mt-1 space-y-0.5"
                    >
                      {DISTANCE_OPTIONS.map((option) => (
                        <FilterOptionRow
                          key={option.value}
                          active={filterState.distance === option.value}
                          label={option.label}
                          onSelect={() =>
                            setFilterState((prev) => ({ ...prev, distance: option.value }))
                          }
                        />
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="mt-3 border-t border-hairline pt-3">
                    <legend className="text-xs font-semibold uppercase tracking-wide text-charcoal-500">
                      Rating
                    </legend>
                    <div
                      role="radiogroup"
                      aria-label="Filter rating minimum"
                      className="mt-1 space-y-0.5"
                    >
                      {RATING_OPTIONS.map((option) => (
                        <FilterOptionRow
                          key={option.value}
                          active={filterState.rating === option.value}
                          label={option.label}
                          onSelect={() =>
                            setFilterState((prev) => ({ ...prev, rating: option.value }))
                          }
                        />
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="mt-3 border-t border-hairline pt-3">
                    <legend className="text-xs font-semibold uppercase tracking-wide text-charcoal-500">
                      Urutkan
                    </legend>
                    <div
                      role="radiogroup"
                      aria-label="Urutkan makanan"
                      className="mt-1 space-y-0.5"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <FilterOptionRow
                          key={option.value}
                          active={filterState.sort === option.value}
                          label={option.label}
                          onSelect={() =>
                            setFilterState((prev) => ({ ...prev, sort: option.value }))
                          }
                        />
                      ))}
                    </div>
                  </fieldset>
                </PopoverContent>
              </Popover>
            </div>

            { }
            {isLoading ? (
              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 sm:gap-5 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <FoodCardSkeleton key={index} />
                ))}
              </div>
            ) : isCategoryEmpty ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-sage-200 bg-white px-6 py-16 text-center"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cream-100">
                  <PackageOpen className="h-7 w-7 text-charcoal-500" aria-hidden />
                </span>
                <h2 className="mt-4 font-sans text-lg font-bold text-charcoal-900">
                  Belum ada makanan di kategori ini
                </h2>
                <p className="mt-1 max-w-sm text-sm text-charcoal-500">
                  Coba pilih kategori lain atau cek kembali beberapa saat lagi.
                </p>
                <Link
                  href="/cari"
                  className={cn(
                    "mt-6 inline-flex items-center justify-center rounded-full bg-green-700 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-green-700/20 transition-all duration-200 hover:bg-caramel active:scale-[0.98]",
                    FOCUS_RING,
                  )}
                >
                  Lihat Semua Makanan
                </Link>
              </motion.div>
            ) : showNoResults ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-sage-200 bg-white px-6 py-16 text-center"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cream-100">
                  <SearchX className="h-7 w-7 text-charcoal-500" aria-hidden />
                </span>
                <h2 className="mt-4 font-sans text-lg font-bold text-charcoal-900">
                  Tidak ada makanan yang cocok
                </h2>
                <p className="mt-1 max-w-sm text-sm text-charcoal-500">
                  Coba ubah pencarian atau filter yang digunakan.
                </p>
                <button
                  type="button"
                  onClick={resetAll}
                  className={cn(
                    "mt-6 inline-flex items-center gap-2 justify-center rounded-full bg-green-700 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-green-700/20 transition-all duration-200 hover:bg-caramel active:scale-[0.98]",
                    FOCUS_RING,
                  )}
                >
                  <RotateCcw className="h-4 w-4" aria-hidden />
                  Reset Filter
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={`${slug}-${searchQuery}-${filterState.distance}-${filterState.rating}-${filterState.sort}`}
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.05 } },
                }}
                className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-4"
              >
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={{
                      hidden: { opacity: 0, y: 16 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.4, ease: EASE },
                      },
                    }}
                  >
                    <FoodCard
                      item={item}
                      onViewDetail={(id) => setSelectedProductId(id)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />

      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            onClose={() => setSelectedProductId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
