"use client";

import { motion } from "framer-motion";
import {
  Apple,
  Cake,
  Coffee,
  Croissant,
  Drumstick,
  Popcorn,
  Sandwich,
  Soup,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50";

const CATEGORIES: { id: string; name: string; icon: LucideIcon }[] = [
  { id: "makanan-berat", name: "Makanan Berat", icon: Drumstick },
  { id: "jajanan", name: "Jajanan", icon: Popcorn },
  { id: "japanese", name: "Japanese", icon: Soup },
  { id: "roti-kue", name: "Roti & Kue", icon: Croissant },
  { id: "makanan-cepat-saji", name: "Makanan Cepat Saji", icon: Sandwich },
  { id: "dessert", name: "Dessert", icon: Cake },
  { id: "buah-sayur", name: "Buah & Sayur", icon: Apple },
  { id: "minuman", name: "Minuman", icon: Coffee },
];

export function CategorySection() {
  const scrollToFoods = () => {
    document.getElementById("umkm")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="kategori"
      className="relative scroll-mt-24 bg-cream-50 py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-sans text-3xl font-bold tracking-tight text-charcoal-900 sm:text-4xl">
              Jelajahi Kategori
            </h2>
            <p className="mt-2 max-w-md font-inter text-sm text-charcoal-500">
              Temukan surplus makanan favoritmu — pilih kategori untuk melihat
              rekomendasi dari UMKM terdekat.
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
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
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
                <button
                  type="button"
                  onClick={scrollToFoods}
                  aria-label={`Lihat makanan kategori ${category.name}`}
                  className={cn(
                    "group flex w-full flex-col items-center gap-3 rounded-2xl bg-white p-6 text-center shadow-md shadow-forest-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-forest-900/15 sm:p-7",
                    FOCUS_RING,
                  )}
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sage-100 to-cream-100 text-green-700 transition-all duration-300 group-hover:from-green-700 group-hover:to-green-600 group-hover:text-white">
                    <Icon className="h-7 w-7" strokeWidth={1.75} />
                  </span>
                  <span className="font-sans text-sm font-bold leading-snug text-charcoal-900 sm:text-base">
                    {category.name}
                  </span>
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
