"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import type { FilterKey } from "@/lib/types";
import { SearchFilterBar } from "@/app/components/SearchFilterBar";

export function ExploreSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("terdekat");

  const handleSearchSubmit = () => {
    const params = new URLSearchParams();
    const q = query.trim();
    if (q) params.set("q", q);
    if (activeFilter !== "terdekat") params.set("filter", activeFilter);
    const qs = params.toString();
    router.push(qs ? `/cari?${qs}` : "/cari");
  };

  return (
    <section
      id="explore"
      className="relative scroll-mt-24 overflow-hidden bg-cream-50 py-14 lg:py-16"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="flex items-center justify-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.3em] text-green-700">
            <Sparkles className="h-4 w-4" />
            Jelajahi
          </p>
          <h2 className="mt-3 font-sans text-3xl font-bold tracking-tight text-charcoal-900 sm:text-4xl">
            Cari Makanan Surplus
          </h2>
          <p className="mx-auto mt-2 max-w-md font-inter text-sm text-charcoal-500">
            Ketik nama makanan atau UMKM, lalu filter sesuai keinginanmu.
          </p>
        </div>

        <div className="mt-8">
          <SearchFilterBar
            query={query}
            onQueryChange={setQuery}
            onSearchSubmit={handleSearchSubmit}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>
      </div>
    </section>
  );
}
