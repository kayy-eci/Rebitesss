"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SmartImage } from "@/app/components/SmartImage";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50";

const CATEGORIES: { id: string; name: string; image: string }[] = [
  {
    id: "makanan-berat",
    name: "Makanan Berat",
    image:
      "https://images.pexels.com/photos/37081081/pexels-photo-37081081.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "jajanan",
    name: "Jajanan",
    image:
      "https://images.pexels.com/photos/37222830/pexels-photo-37222830.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "japanese",
    name: "Japanese",
    image:
      "https://images.pexels.com/photos/36292346/pexels-photo-36292346.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "roti-kue",
    name: "Roti & Kue",
    image:
      "https://images.pexels.com/photos/5436437/pexels-photo-5436437.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "makanan-cepat-saji",
    name: "Makanan Cepat Saji",
    image:
      "https://images.pexels.com/photos/23091813/pexels-photo-23091813.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "dessert",
    name: "Dessert",
    image:
      "https://images.pexels.com/photos/32916204/pexels-photo-32916204.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "buah-sayur",
    name: "Buah & Sayur",
    image:
      "https://images.pexels.com/photos/3987405/pexels-photo-3987405.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "minuman",
    name: "Minuman",
    image:
      "https://images.pexels.com/photos/8215110/pexels-photo-8215110.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
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
          {CATEGORIES.map((category) => (
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
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
