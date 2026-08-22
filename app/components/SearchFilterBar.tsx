"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, MapPin, Search, SearchX, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LOCATIONS, foodItems, formatRupiah } from "@/lib/data";
import { SmartImage } from "@/app/components/SmartImage";
import type { FilterKey, FoodItem } from "@/lib/types";

interface SearchFilterBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSearchSubmit: () => void;
  activeFilter: FilterKey;
  onFilterChange: (key: FilterKey) => void;
  showLocation?: boolean;
  showInlineResults?: boolean;
  onSelectResult?: (id: string) => void;
}

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A882] focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50";

function applySort(key: FilterKey) {
  return (a: FoodItem, b: FoodItem) => {
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

function HighlightedText({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;

  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return <>{text}</>;

  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-cream-100 px-0.5 font-semibold text-green-700">
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  );
}

export function SearchFilterBar({
  query,
  onQueryChange,
  onSearchSubmit,
  activeFilter,
  onFilterChange,
  showLocation = true,
  showInlineResults = false,
  onSelectResult,
}: SearchFilterBarProps) {
  const [locationOpen, setLocationOpen] = useState(false);
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const trimmedQuery = query.trim();

  const results = useMemo(() => {
    if (!showInlineResults || !trimmedQuery) return [];

    const q = trimmedQuery.toLowerCase();
    let items = foodItems.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.vendorName.toLowerCase().includes(q),
    );

    const categoryFilters: FilterKey[] = [
      "umkm",
      "bakery",
      "restoran",
      "minuman",
    ];
    if (categoryFilters.includes(activeFilter)) {
      items = items.filter((item) => item.category === activeFilter);
    } else if (activeFilter === "segera-habis") {
      items = items.filter((item) => item.expiresAt);
    }

    return [...items].sort(applySort(activeFilter));
  }, [showInlineResults, trimmedQuery, activeFilter]);

  const dropdownVisible =
    showInlineResults && isDropdownOpen && trimmedQuery.length > 0;

  useEffect(() => {
    if (!dropdownVisible) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsDropdownOpen(false);
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [dropdownVisible]);

  const handleQueryChange = (value: string) => {
    onQueryChange(value);
    setIsDropdownOpen(value.trim().length > 0);
  };

  const handleClear = () => {
    onQueryChange("");
    setIsDropdownOpen(false);
    inputRef.current?.focus();
  };

  const handleSelectResult = (id: string) => {
    setIsDropdownOpen(false);
    onSelectResult?.(id);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-sage-100 bg-white p-2.5 shadow-md shadow-forest-900/5 sm:p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (showInlineResults && trimmedQuery) setIsDropdownOpen(true);
            onSearchSubmit();
          }}
          className="flex flex-col gap-2.5 sm:flex-row sm:items-center"
        >
          <div className="relative flex-1">
            <div className="flex w-full items-center gap-3 rounded-full bg-cream-50 px-4 py-2.5">
              <Search className="h-5 w-5 shrink-0 text-sage-500" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                onFocus={() => {
                  if (trimmedQuery) setIsDropdownOpen(true);
                }}
                placeholder="Cari makanan surplus di sekitarmu..."
                aria-label="Cari makanan surplus"
                aria-expanded={dropdownVisible}
                role="combobox"
                aria-controls="search-inline-results"
                className={cn(
                  "w-full bg-transparent font-sans text-sm text-charcoal-900 placeholder:text-charcoal-500/70 focus:outline-none",
                  showInlineResults && "[&::-webkit-search-cancel-button]:hidden",
                )}
              />

              {showInlineResults && trimmedQuery && (
                <button
                  type="button"
                  aria-label="Hapus pencarian"
                  onClick={handleClear}
                  className="-ml-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-charcoal-500 transition-colors duration-150 hover:bg-cream-100 hover:text-charcoal-900"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <AnimatePresence>
              {dropdownVisible && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <motion.div
                    id="search-inline-results"
                    role="listbox"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[340px] overflow-y-auto rounded-2xl border border-sage-100 bg-white p-1.5 shadow-xl"
                  >
                    {results.length > 0 ? (
                      results.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          role="option"
                          aria-selected={false}
                          onClick={() => handleSelectResult(item.id)}
                          className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors duration-150 hover:bg-cream-50"
                        >
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-sage-100">
                            <SmartImage
                              src={item.image}
                              alt={`Foto ${item.name}`}
                              sizes="48px"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate font-sans text-sm font-semibold text-charcoal-900">
                              <HighlightedText
                                text={item.name}
                                query={trimmedQuery}
                              />
                            </p>
                            <p className="mt-0.5 truncate font-inter text-xs text-charcoal-500">
                              <HighlightedText
                                text={item.vendorName}
                                query={trimmedQuery}
                              />
                            </p>
                            <p className="mt-0.5 truncate font-inter text-[11px] text-charcoal-500">
                              {item.stockLabel} · {item.distanceKm} km
                            </p>
                          </div>

                          <div className="shrink-0 text-right">
                            <p className="font-sans text-sm font-bold text-green-700">
                              {formatRupiah(item.discountedPrice)}
                            </p>
                            <p className="font-inter text-xs text-charcoal-500 line-through">
                              {formatRupiah(item.originalPrice)}
                            </p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="flex flex-col items-center gap-1 px-4 py-8 text-center">
                        <SearchX
                          className="h-7 w-7 text-sage-400"
                          strokeWidth={1.5}
                        />
                        <p className="mt-1 font-sans text-sm font-semibold text-charcoal-900">
                          Makanan tidak ditemukan
                        </p>
                        <p className="font-inter text-xs text-charcoal-500">
                          Coba kata kunci lain.
                        </p>
                      </div>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {showLocation && (
            <div className="relative hidden sm:block">
            <button
              type="button"
              aria-label="Pilih lokasi"
              aria-expanded={locationOpen}
              onClick={() => setLocationOpen((v) => !v)}
              className={cn(
                "flex h-11 items-center gap-2 rounded-full border border-sage-100 bg-white px-4 text-sm font-medium text-charcoal-500 transition-colors duration-200 hover:border-[#C8A882]/40 hover:text-[#C8A882]",
                FOCUS_RING,
              )}
            >
              <MapPin className="h-4 w-4 text-[#C8A882]" />
              <span className="max-w-[130px] truncate">{location}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  locationOpen && "rotate-180",
                )}
              />
            </button>

            <AnimatePresence>
              {locationOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40"
                    onClick={() => setLocationOpen(false)}
                  />
                  <motion.ul
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-sage-100 bg-white p-1.5 shadow-xl"
                  >
                    {LOCATIONS.map((loc) => (
                      <li key={loc}>
                        <button
                          type="button"
                          onClick={() => {
                            setLocation(loc);
                            setLocationOpen(false);
                          }}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors duration-150",
                            loc === location
                              ? "bg-cream-100 font-semibold text-[#C8A882]"
                              : "text-charcoal-500 hover:bg-cream-50 hover:text-[#C8A882]",
                          )}
                        >
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          {loc}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                </>
              )}
            </AnimatePresence>
          </div>
          )}

          <button
            type="submit"
            className={cn(
              "flex h-11 shrink-0 items-center justify-center gap-2 rounded-full px-7 font-sans text-sm font-semibold text-white shadow-md transition-colors duration-200 active:scale-[0.98]",
              "bg-[#C8A882] hover:bg-[#A06B45]",
              FOCUS_RING,
            )}
          >
            <Search className="h-4 w-4" />
            Cari
          </button>
        </form>
      </div>
    </div>
  );
}
