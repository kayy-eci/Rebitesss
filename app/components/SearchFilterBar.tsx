"use client";

import { useState } from "react";
import { ChevronDown, MapPin, Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LOCATIONS } from "@/lib/data";
import { Pill } from "@/app/components/Pill";
import type { FilterKey } from "@/lib/types";

export const FILTER_OPTIONS: { key: FilterKey; label: string }[] = [
  { key: "terdekat", label: "Terdekat" },
  { key: "diskon-terbesar", label: "Diskon Terbesar" },
  { key: "segera-habis", label: "Segera Habis" },
  { key: "umkm", label: "UMKM" },
  { key: "bakery", label: "Bakery" },
  { key: "restoran", label: "Restoran" },
  { key: "minuman", label: "Minuman" },
];

interface SearchFilterBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSearchSubmit: () => void;
  activeFilter: FilterKey;
  onFilterChange: (key: FilterKey) => void;
}

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A882] focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50";

export function SearchFilterBar({
  query,
  onQueryChange,
  onSearchSubmit,
  activeFilter,
  onFilterChange,
}: SearchFilterBarProps) {
  const [locationOpen, setLocationOpen] = useState(false);
  const [location, setLocation] = useState(LOCATIONS[0]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-sage-100 bg-white p-2.5 shadow-md shadow-forest-900/5 sm:p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearchSubmit();
          }}
          className="flex flex-col gap-2.5 sm:flex-row sm:items-center"
        >
          <div className="flex flex-1 items-center gap-3 rounded-full bg-cream-50 px-4 py-2.5">
            <Search className="h-5 w-5 shrink-0 text-sage-500" />
            <input
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Cari makanan surplus di sekitarmu..."
              aria-label="Cari makanan surplus"
              className="w-full bg-transparent font-sans text-sm text-charcoal-900 placeholder:text-charcoal-500/70 focus:outline-none"
            />
          </div>

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

      <div className="mt-4 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {FILTER_OPTIONS.map((option) => (
          <Pill
            key={option.key}
            active={activeFilter === option.key}
            onClick={() => onFilterChange(option.key)}
          >
            {option.label}
          </Pill>
        ))}
      </div>
    </div>
  );
}
