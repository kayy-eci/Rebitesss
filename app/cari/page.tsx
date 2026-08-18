"use client";

import { Suspense, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Search, SearchX, Sparkles } from "lucide-react";
import { foodItems } from "@/lib/data";
import type { FilterKey } from "@/lib/types";
import { Navbar } from "@/app/components/navbar";
import { SiteFooter } from "@/app/components/Footer";
import { SearchFilterBar } from "@/app/components/SearchFilterBar";
import { FoodCard } from "@/app/components/FoodCard";

const VALID_FILTERS: FilterKey[] = [
  "terdekat",
  "diskon-terbesar",
  "segera-habis",
  "umkm",
  "bakery",
  "restoran",
  "minuman",
];

function parseFilter(value: string | null): FilterKey {
  return VALID_FILTERS.includes(value as FilterKey) ? (value as FilterKey) : "terdekat";
}

function applyFilter(key: FilterKey) {
  return (a: (typeof foodItems)[number], b: (typeof foodItems)[number]) => {
    switch (key) {
      case "terdekat":
        return a.distanceKm - b.distanceKm;
      case "diskon-terbesar":
        return b.discountPercent - a.discountPercent;
      case "segera-habis":
        return (
          (a.expiresAt
            ? new Date(a.expiresAt).getTime()
            : Number.MAX_SAFE_INTEGER) -
          (b.expiresAt
            ? new Date(b.expiresAt).getTime()
            : Number.MAX_SAFE_INTEGER)
        );
      default:
        return 0;
    }
  };
}

function CariContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [activeFilter, setActiveFilter] = useState<FilterKey>(
    parseFilter(searchParams.get("filter")),
  );

  const hasQuery = query.trim().length > 0;

  const filteredItems = useMemo(() => {
    let items = [...foodItems];

    const q = query.trim().toLowerCase();
    if (q) {
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.vendorName.toLowerCase().includes(q),
      );
    }

    const categoryFilters: FilterKey[] = ["umkm", "bakery", "restoran", "minuman"];
    if (categoryFilters.includes(activeFilter)) {
      items = items.filter((item) => item.category === activeFilter);
    } else if (activeFilter === "segera-habis") {
      items = items.filter((item) => item.expiresAt);
    }

    items.sort(applyFilter(activeFilter));
    return items;
  }, [query, activeFilter]);

  const resetAll = () => {
    setQuery("");
    setActiveFilter("terdekat");
  };

  return (
    <div className="flex min-h-screen flex-col bg-cream-50">
      <Navbar />

      <main className="flex-1 pt-28">
        <section className="relative overflow-hidden bg-cream-50 pb-16 pt-6 lg:pb-24">
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="flex items-center justify-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.3em] text-green-700">
                <Sparkles className="h-4 w-4" />
                Hasil Pencarian
              </p>
              <h2 className="mt-3 font-sans text-3xl font-bold tracking-tight text-charcoal-900 sm:text-4xl">
                Cari Makanan Surplus
              </h2>
              <p className="mx-auto mt-2 max-w-md font-inter text-sm text-charcoal-500">
                Perbarui kata kunci atau filter untuk melihat makanan surplus
                yang kamu cari.
              </p>
            </div>

            <div className="mt-8">
              <SearchFilterBar
                query={query}
                onQueryChange={setQuery}
                onSearchSubmit={() => undefined}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
              />
            </div>

            {hasQuery ? (
              <>
                <div className="mt-8 flex items-center justify-between">
                  <p className="font-sans text-sm text-charcoal-500">
                    <span className="font-semibold text-green-700">
                      {filteredItems.length}
                    </span>{" "}
                    makanan ditemukan untuk &ldquo;
                    <span className="font-semibold text-charcoal-900">
                      {query.trim()}
                    </span>
                    &rdquo;
                  </p>
                  <button
                    type="button"
                    onClick={resetAll}
                    className="rounded-full px-3 py-1.5 font-sans text-xs font-semibold text-green-700 transition-colors hover:bg-cream-100 hover:text-green-600"
                  >
                    Reset
                  </button>
                </div>

                {filteredItems.length > 0 ? (
                  <motion.div
                    key={`${query}-${activeFilter}`}
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: {},
                      visible: { transition: { staggerChildren: 0.05 } },
                    }}
                    className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  >
                    {filteredItems.map((item) => (
                      <motion.div
                        key={item.id}
                        variants={{
                          hidden: { opacity: 0, y: 16 },
                          visible: {
                            opacity: 1,
                            y: 0,
                            transition: {
                              duration: 0.4,
                              ease: [0.22, 1, 0.36, 1],
                            },
                          },
                        }}
                        className="min-w-0"
                      >
                        <FoodCard item={item} />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-sage-200 bg-white px-6 py-16 text-center">
                    <SearchX className="h-12 w-12 text-sage-400" strokeWidth={1.5} />
                    <p className="mt-4 font-sans text-lg font-semibold text-charcoal-900">
                      Makanan tidak ditemukan
                    </p>
                    <p className="mt-1 max-w-sm font-inter text-sm text-charcoal-500">
                      Coba kata kunci lain atau reset filter untuk melihat semua
                      makanan surplus yang tersedia.
                    </p>
                    <button
                      type="button"
                      onClick={resetAll}
                      className="mt-6 rounded-full bg-green-700 px-6 py-2.5 font-sans text-sm font-semibold text-white shadow-md shadow-green-700/25 transition-all duration-200 hover:bg-green-600 active:scale-[0.98]"
                    >
                      Lihat Semua Makanan
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-dashed border-sage-200 bg-white px-6 py-16 text-center">
                <Search className="h-12 w-12 text-sage-400" strokeWidth={1.5} />
                <p className="mt-4 font-sans text-lg font-semibold text-charcoal-900">
                  Mulai cari makanan
                </p>
                <p className="mt-1 max-w-sm font-inter text-sm text-charcoal-500">
                  Ketik nama makanan atau UMKM untuk melihat makanan surplus
                  yang tersedia.
                </p>
                <Link
                  href="/homePage"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-green-700 px-6 py-2.5 font-sans text-sm font-semibold text-white shadow-md shadow-green-700/25 transition-all duration-200 hover:bg-green-600 active:scale-[0.98]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Kembali ke Beranda
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

export default function CariPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream-50" />}>
      <CariContent />
    </Suspense>
  );
}
