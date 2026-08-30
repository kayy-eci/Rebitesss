"use client";

import Link from "next/link";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { Reveal } from "@/app/components/reveal";
import { SmartImage } from "@/app/components/SmartImage";
import { formatRupiah } from "@/lib/data";
import { useCatalog } from "@/lib/catalog";
import { cn } from "@/lib/utils";

type GridItem = {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
};

const FALLBACK_GRID: GridItem[] = [
  {
    id: "grid-salmon",
    name: "Salmon Salad Bites",
    category: "Salad",
    image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600",
    price: 25000,
  },
  {
    id: "grid-fried",
    name: "Fried Rice Bites",
    category: "Nasi",
    image: "https://images.pexels.com/photos/234731/pexels-photo-234731.jpeg?auto=compress&cs=tinysrgb&w=600",
    price: 28000,
  },
  {
    id: "grid-grilled",
    name: "Grilled Chicken Bites",
    category: "Panggang",
    image: "https://images.pexels.com/photos/6752433/pexels-photo-6752433.jpeg?auto=compress&cs=tinysrgb&w=600",
    price: 32000,
  },
  {
    id: "grid-bowl",
    name: "Rice Bowl Bites",
    category: "Bowl",
    image: "https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=600",
    price: 35000,
  },
];

export function FlashSaleGrid() {
  const { foodItems, urgentItems } = useCatalog();
  const [items, setItems] = useState<GridItem[]>(FALLBACK_GRID);

  useEffect(() => {
    const source = urgentItems.length > 0 ? urgentItems : foodItems;
    if (source.length > 0) {
      const mapped: GridItem[] = source.slice(0, 4).map((f) => ({
        id: f.id,
        name: f.name,
        category: f.category,
        image: f.image,
        price: f.discountedPrice,
      }));
      if (mapped.length === 4) setItems(mapped);
      else if (mapped.length > 0) {
        const needed = 4 - mapped.length;
        setItems([...mapped, ...FALLBACK_GRID.slice(0, needed)]);
      }
    }
  }, [foodItems, urgentItems]);

  return (
    <section
      id="flash-sale"
      data-nav="cream"
      className="relative scroll-mt-24 overflow-hidden bg-[#FAF3E4] py-16 lg:scroll-mt-28 lg:py-20"
    >
      <div className="relative mx-auto w-full max-w-[1280px] px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between lg:mb-12">
          <div>
            <Reveal delay={0.05}>
              <span className="font-sans text-xs font-bold uppercase tracking-[0.22em] text-[#C08A3E]">
                PILIHAN KAMI
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-2 font-sans text-[28px] font-bold leading-tight tracking-tight text-[#2E2A22] sm:text-[30px] lg:text-[32px]">
                Menu Favorit ReBites
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.12}>
            <Link
              href="/#rekomendasi"
              className="group inline-flex items-center gap-1.5 font-sans text-sm font-medium text-[#3F6B4A] transition-colors hover:text-[#345A3E]"
            >
              Lihat Semua Menu
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {items.map((item, idx) => (
            <Reveal key={item.id} delay={0.08 * idx}>
              <article
                className={cn(
                  "group relative flex flex-col rounded-[24px] bg-[#FFFDF8] pt-14 pb-6 px-6 shadow-[0_12px_30px_-16px_rgba(46,42,34,0.12)]",
                  "border border-transparent transition-all duration-300",
                  "hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-16px_rgba(46,42,34,0.18)] hover:border-[#C08A3E]/20"
                )}
              >
                {/* Circular image overlap */}
                <div className="absolute -top-10 left-6 h-[112px] w-[112px] overflow-hidden rounded-full border-[3px] border-white bg-white shadow-[0_12px_24px_-12px_rgba(46,42,34,0.35)]">
                  <div className="relative h-full w-full overflow-hidden rounded-full">
                    <SmartImage
                      src={item.image}
                      alt={`Foto ${item.name}`}
                      sizes="112px"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>

                {/* Price top right aligned with image center */}
                <div className="flex justify-end">
                  <span className="font-sans text-[19px] font-bold tracking-tight text-[#C08A3E]">
                    {formatRupiah(item.price)}
                  </span>
                </div>

                {/* Title & category */}
                <h3 className="mt-8 font-sans text-[17px] font-bold leading-snug text-[#2E2A22]">
                  {item.name}
                </h3>
                <p className="mt-1 font-sans text-[13px] font-normal text-[#7C7364]">
                  {item.category}
                </p>

                {/* Cart button bottom right */}
                <Link
                  href="/#rekomendasi"
                  aria-label={`Tambah ${item.name} ke keranjang`}
                  className="absolute bottom-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#3F6B4A] text-white shadow-sm transition-all duration-200 hover:bg-[#345A3E] hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C08A3E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFFDF8]"
                >
                  <ShoppingCart className="h-4 w-4" />
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
