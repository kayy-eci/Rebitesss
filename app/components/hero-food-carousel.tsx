"use client";

import { useState, useRef, useId, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import OptionWheel, { type OptionWheelApi } from "@/app/components/ui/korosel";
import { Reveal } from "@/app/components/reveal";
import { LeafSprig } from "@/app/components/ornaments";
import {
  ProductDetailPanel,
  type FeaturedFood,
} from "@/app/components/product-detail-panel";

const FOODS: FeaturedFood[] = [
  {
    name: "Ayam Geprek",
    image: "/makanan1.jpeg",
    merchant: "Warung Geprek Bu Ati",
    category: "Makanan Berat",
    hours: "09.00–21.00",
    price: 12000,
    originalPrice: 15000,
    badge: "Menu Favorit",
    rating: 4.9,
    reviewCount: 214,
    description:
      "Ayam geprek renyah dengan sambal bawang khas yang menggugah selera — dijamin nagih di setiap gigitan, dan hanya bisa kamu temukan di ReBites.",
  },
  {
    name: "Nasi Goreng Kampung",
    image: "/makanan2.jpeg",
    merchant: "Kampung Rasa",
    category: "Nasi Goreng",
    hours: "10.00–21.00",
    price: 15000,
    originalPrice: 18000,
    badge: "Menu Favorit",
    rating: 4.8,
    reviewCount: 168,
    description:
      "Nasi goreng kampung dengan bumbu ulek segar dan telur mata sapi — kehangatan dapur rumahan yang hanya bisa kamu temukan di ReBites.",
  },
  {
    name: "Soto Mie Bogor",
    image: "/makanan3.jpeg",
    merchant: "Soto Mie Mang Aji",
    category: "Soto Mie",
    hours: "08.00–16.00",
    price: 18000,
    originalPrice: 22000,
    badge: "Menu Favorit",
    rating: 4.8,
    reviewCount: 176,
    description:
      "Soto mie Bogor dengan kuah bening gurih, mie kuning, dan risoles — kehangatan khas kota hujan yang hanya bisa kamu temukan di ReBites.",
  },
  {
    name: "Sate Ayam Pak Tigiset",
    image: "/makanan4.jpeg",
    merchant: "Sate Pak Tigiset",
    category: "Sate Ayam",
    hours: "15.00–22.00",
    price: 20000,
    originalPrice: 25000,
    badge: "Menu Favorit",
    rating: 4.9,
    reviewCount: 240,
    description:
      "Sate ayam empuk dengan bumbu kacang legendaris yang meresap — legit di setiap tusuk, dan hanya bisa kamu temukan di ReBites.",
  },
  {
    name: "Rendang Padang Karindang",
    image: "/makanan5.jpeg",
    merchant: "RM Padang Karindang",
    category: "Rendang",
    hours: "10.00–21.00",
    price: 25000,
    originalPrice: 30000,
    badge: "Menu Favorit",
    rating: 4.9,
    reviewCount: 300,
    description:
      "Rendang padang dengan daging empuk dan bumbu yang meresap sempurna — kekayaan rasa nusantara yang hanya bisa kamu temukan di ReBites.",
  },
  {
    name: "Pancong Boss Lumer",
    image: "/makanan6.jpeg",
    merchant: "Pancong Lumer Depok",
    category: "Jajanan",
    hours: "14.00–21.00",
    price: 10000,
    originalPrice: 13000,
    badge: "Menu Favorit",
    rating: 4.7,
    reviewCount: 132,
    description:
      "Pancong kelapa manis gurih dengan topping cokelat yang lumer — jajanan klasik yang hanya bisa kamu temukan di ReBites.",
  },
  {
    name: "Martabak Gombret",
    image: "/makanan7.jpg",
    merchant: "Martabak Gombret 45",
    category: "Martabak",
    hours: "17.00–23.00",
    price: 22000,
    originalPrice: 28000,
    badge: "Menu Favorit",
    rating: 4.8,
    reviewCount: 190,
    description:
      "Martabak gombret tebal dengan isian melimpah — manisnya pas di hati, dan hanya bisa kamu temukan di ReBites.",
  },
  {
    name: "Bakso Spesial Mas Jono",
    image: "/makanan8.webp",
    merchant: "Bakso Jono",
    category: "Bakso",
    hours: "09.00–21.00",
    price: 18000,
    originalPrice: 23000,
    badge: "Menu Favorit",
    rating: 4.9,
    reviewCount: 256,
    description:
      "Bakso sapi kenyal dengan kuah kaldu bening yang gurih — hangat, mengenyangkan, dan hanya bisa kamu temukan di ReBites.",
  },
  {
    name: "Ketoprak Telor Sedap",
    image: "/makanan9.webp",
    merchant: "Ketoprak Sedap",
    category: "Ketoprak",
    hours: "08.00–17.00",
    price: 13000,
    originalPrice: 16000,
    badge: "Menu Favorit",
    rating: 4.7,
    reviewCount: 148,
    description:
      "Ketoprak lengkap dengan lontong, bihun, tahu, dan telur — disiram sambal kacang yang hanya bisa kamu temukan di ReBites.",
  },
  {
    name: "Mie Ayam Balap 12",
    image: "/makanan10.webp",
    merchant: "Mie Ayam Balap 12",
    category: "Mie Ayam",
    hours: "10.00–22.00",
    price: 15000,
    originalPrice: 18000,
    badge: "Menu Favorit",
    rating: 4.8,
    reviewCount: 202,
    description:
      "Mie ayam dengan topping ayam cincang melimpah dan kuah gurih yang hangat — lezatnya hanya bisa kamu temukan di ReBites.",
  },
];

const BADGE_CLIP = (() => {
  const teeth = 36;
  const points: string[] = [];
  for (let t = 0; t < teeth; t++) {
    const a = (t / teeth) * Math.PI * 2;
    const b = ((t + 0.5) / teeth) * Math.PI * 2;
    points.push(
      `${(50 + 50 * Math.cos(a)).toFixed(3)}% ${(50 + 50 * Math.sin(a)).toFixed(3)}%`,
      `${(50 + 45 * Math.cos(b)).toFixed(3)}% ${(50 + 45 * Math.sin(b)).toFixed(3)}%`
    );
  }
  return `polygon(${points.join(", ")})`;
})();

export function HeroFoodCarousel() {
  const [foodIndex, setFoodIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [plateSize, setPlateSize] = useState(320);
  const wheelApi = useRef<OptionWheelApi | null>(null);

  const selected = FOODS[foodIndex];

  useEffect(() => {
    const updatePlate = () => {
      const w = window.innerWidth;
      if (w < 480) setPlateSize(Math.max(Math.round((w * 14) / 16 / 1.2), 150));
      else if (w < 1024) setPlateSize(300);
      else setPlateSize(390);
    };
    updatePlate();
    window.addEventListener("resize", updatePlate);
    return () => window.removeEventListener("resize", updatePlate);
  }, []);

  const steer = (action: () => void) => {
    setAutoRotate(false);
    action();
    window.setTimeout(() => setAutoRotate(true), 8000);
  };

  return (
    <section
      id="rekomendasi"
      data-nav="cream"
      className="grain-overlay relative overflow-hidden bg-cream py-20 lg:py-28"
    >
      <div className="relative z-10 mx-auto w-full max-w-[min(100vw,1600px)] px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="flex items-center justify-center gap-2">
            <Leaf className="h-4 w-4 text-caramel" />
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-caramel">
              Rekomendasi Makanan
            </span>
          </div>
          <h2 className="mt-4 font-display text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-forest-dark">
            Pilihan terbaik untukmu hari ini
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-sans text-sm leading-[1.8] text-muted-foreground sm:text-base">
            Putar piringnya, temukan menu surplus favoritmu dari UMKM terbaik
            di Kota Depok.
          </p>
        </Reveal>

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div className="order-2 w-full lg:order-1 lg:pl-8 xl:pl-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={foodIndex}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                <ProductDetailPanel food={selected} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="order-1 lg:order-2">
            <Reveal className="relative">
              <div className="relative mx-auto w-full max-w-[15rem] sm:max-w-[30rem] lg:mr-[-2rem] lg:max-w-[42rem]">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-y-2 left-0 right-0 z-0 rounded-l-full border-2 border-white bg-green-700 shadow-[0_44px_80px_-42px_rgba(63,107,74,0.75)] ring-1 ring-inset ring-caramel/30"
                />
                <div className="relative overflow-hidden rounded-l-full" style={{ height: plateSize + 10 }}>
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 left-0 w-1/2 rounded-l-full bg-[radial-gradient(130%_180%_at_12%_30%,rgba(255,253,248,0.18),transparent_55%)]"
                  />
                  <LeafSprig className="left-7 top-1/2 h-12 w-12 -translate-y-1/2 rotate-12 text-white/30" />

                  <div className="absolute inset-0">
                    <OptionWheel
                      items={FOODS.map((f) => f.name)}
                      defaultSelected={0}
                      side="right"
                      orientation="vertical"
                      spacing={0.45}
                      curve={18}
                      tilt={6}
                      blur={4}
                      fade={1}
                      minOpacity={0}
                      smoothing={200}
                      loop
                      draggable
                      autoRotate={autoRotate}
                      autoRotateInterval={4200}
                      plateSize={plateSize}
                      onChange={(index) => setFoodIndex(index)}
                      apiRef={wheelApi}
                      className="!py-0 -translate-x-[9%] sm:-translate-x-[18%] lg:-translate-x-[20%]"
                      renderItem={(i) => <FoodPlate image={FOODS[i].image} />}
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-green-700 to-transparent"
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-green-700 to-transparent"
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-green-700 to-transparent"
                    />
                  </div>

                  <div
                    aria-hidden
                    className="absolute right-20 top-1/2 z-20 hidden h-16 w-16 -translate-y-1/2 flex-col items-center justify-center bg-amber text-white [filter:drop-shadow(0_16px_22px_rgba(192,138,62,0.55))] sm:h-24 sm:w-24 lg:flex lg:h-32 lg:w-32"
                    style={{ clipPath: BADGE_CLIP }}
                  >
                    <span className="font-display text-base font-bold leading-none text-white sm:text-2xl lg:text-3xl">
                      30%
                    </span>
                    <span className="mt-1 font-sans text-[8px] font-bold uppercase tracking-[0.18em] text-white sm:text-[10px] lg:text-xs">
                      OFF
                    </span>
                  </div>

                  <div
                    aria-hidden
                    className="absolute right-7 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex"
                  >
                    <span className="h-9 w-px bg-caramel/60" />
                    <span className="[writing-mode:vertical-rl] font-display text-xs font-semibold uppercase tracking-[0.48em] text-white">
                      ReBites
                    </span>
                    <span className="h-9 w-px bg-caramel/60" />
                  </div>
                </div>
              </div>

              <div className="relative z-20 mt-6 flex items-center justify-center gap-1.5">
                {FOODS.map((food, index) => (
                  <button
                    key={food.name}
                    type="button"
                    aria-label={`Pilih ${food.name}`}
                    onClick={() => steer(() => wheelApi.current?.to(index))}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      index === foodIndex
                        ? "w-6 bg-green-700"
                        : "w-1.5 bg-charcoal-900/15 hover:bg-amber",
                    )}
                  />
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      </section>
  );
}

function FoodPlate({ image }: { image: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const gradId = `plate-surface-${uid}`;
  const clipId = `plate-cut-${uid}`;

  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label="Piring makanan"
      className="h-full w-full drop-shadow-[0_16px_22px_-14px_rgba(63,107,74,0.55)]"
    >
      <defs>
        <radialGradient id={gradId} cx="50%" cy="42%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="72%" stopColor="#F4F1E9" />
          <stop offset="100%" stopColor="#DFDAC8" />
        </radialGradient>

        <clipPath id={clipId}>
          <circle cx="100" cy="100" r="84" />
        </clipPath>
      </defs>

      <circle cx="100" cy="100" r="92" fill={`url(#${gradId})`} />

      <circle
        cx="100"
        cy="100"
        r="92"
        fill="none"
        stroke="#DEDACF"
        strokeWidth="2.5"
      />

      <circle
        cx="100"
        cy="100"
        r="88"
        fill="none"
        stroke="#E6E1D1"
        strokeWidth="1.5"
      />

      <circle cx="100" cy="100" r="86" fill="#F7F5EF" />

      <image
        href={image}
        x="0"
        y="0"
        width="200"
        height="200"
        preserveAspectRatio="xMidYMid slice"
        clipPath={`url(#${clipId})`}
      />

      <circle
        cx="100"
        cy="100"
        r="84"
        fill="none"
        stroke="#F7F5EF"
        strokeWidth="4"
      />

      <ellipse cx="80" cy="66" rx="46" ry="22" fill="#FFFFFF" opacity="0.16" />
    </svg>
  );
}