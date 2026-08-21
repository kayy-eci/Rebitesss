"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FilterKey } from "@/lib/types";
import { SearchFilterBar } from "@/app/components/SearchFilterBar";

export function ExploreSection({ from = "landing" }: { from?: "landing" | "home" }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("terdekat");

  const handleSearchSubmit = () => {
    const params = new URLSearchParams();
    const q = query.trim();
    if (q) params.set("q", q);
    if (activeFilter !== "terdekat") params.set("filter", activeFilter);
    params.set("from", from);
    const qs = params.toString();
    router.push(`/cari?${qs}`);
  };

  return (
    <section
      id="explore"
      data-nav="cream"
      className="relative scroll-mt-24 bg-cream-50 pt-14 pb-5 lg:pt-16 lg:pb-8"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
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
