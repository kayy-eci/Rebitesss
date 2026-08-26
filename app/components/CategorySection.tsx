"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/categories";
import { fetchCategoryCounts } from "@/lib/catalog";
import { SmartImage } from "@/app/components/SmartImage";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50";

export function CategorySection() {
  // Kategori hanya tampil kalau benar-benar ada produknya di database.
  // null = belum termuat -> tampilkan semua agar layout tidak melompat.
  const [counts, setCounts] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    let active = true;
    fetchCategoryCounts().then((result) => {
      if (active) setCounts(result);
    });
    return () => {
      active = false;
    };
  }, []);

  const visibleCategories = counts
    ? CATEGORIES.filter((category) => (counts[category.name] ?? 0) > 0)
    : CATEGORIES;

  if (counts && visibleCategories.length === 0) {
    return null;
  }

  return (
    <section
      id="kategori"
      data-nav="cream"
      className="relative scroll-mt-24 bg-cream-50 py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-sans text-3xl font-bold tracking-tight text-charcoal-900 sm:text-4xl">
              Jelajahi Kategori
            </h2>
            <p className="mt-2 max-w-md font-sans text-sm text-charcoal-500">
              Temukan berbagai makanan sesuai seleramu yang masih layak dinikmati
            </p>
          </div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.05 } },
          }}
          className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4"
        >
          {visibleCategories.map((category) => (
            <motion.div
              key={category.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              <Link
                href={`/makanan/${category.id}`}
                aria-label={`Lihat makanan kategori ${category.name}`}
                className={cn(
                  "group relative flex w-full flex-col overflow-hidden rounded-2xl bg-white shadow-md shadow-forest-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-forest-900/15",
                  FOCUS_RING,
                )}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-sage-100">
                  <SmartImage
                    src={category.image}
                    alt={`Foto makanan kategori ${category.name}`}
                    sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-forest-900/70 via-forest-900/10 to-transparent"
                  />
                </div>

                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 sm:p-5">
                  <span className="font-sans text-sm font-bold leading-snug text-white drop-shadow-md sm:text-base">
                    {category.name}
                  </span>
                  <span className="flex h-7 w-7 shrink-0 translate-y-1 items-center justify-center rounded-full bg-white/90 text-green-700 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
