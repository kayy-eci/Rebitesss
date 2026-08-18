"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Transition } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Info,
  Leaf,
  Package,
  ShoppingCart,
  Tag,
} from "lucide-react";
import type { KeyboardEvent } from "react";

type FoodItem = {
  id: string;
  foto: string;
  nama: string;
  detail: string;
  stok: string;
  waktuHabis: number;
};

const FOODS: FoodItem[] = [
  {
    id: "roti-sourdough",
    foto: "/makanan2.jpeg",
    nama: "Paket Roti Sourdough Sisa Panggang",
    detail:
      "Campuran roti hari ini, tetap renyah & segar, cocok untuk sarapan besok pagi.",
    stok: "Sisa 4 paket",
    waktuHabis: 2 * 3600 + 15 * 60,
  },
  {
    id: "salad-kebun",
    foto: "/makanan5.jpeg",
    nama: "Salad Segar Kebun",
    detail:
      "Sayur lokal dari panen berlebih, vinaigrette lemon di sisi terpisah.",
    stok: "Sisa 6 mangkuk",
    waktuHabis: 1 * 3600 + 30 * 60,
  },
  {
    id: "sup-krim-labu",
    foto: "/makanan6.jpeg",
    nama: "Sup Krim Labu Hangat",
    detail:
      "Labu lokal tanpa pengawet, cukup dihangatkan 3 menit sebelum disantap.",
    stok: "Sisa 3 mangkuk",
    waktuHabis: 3 * 3600,
  },
  {
    id: "pasta-carbonara",
    foto: "/makanan7.jpg",
    nama: "Pasta Carbonara Surplus",
    detail:
      "Krim dan guanciale, sisa produksi dapur yang masih segar hari ini.",
    stok: "Sisa 5 porsi",
    waktuHabis: 2 * 3600 + 45 * 60,
  },
  {
    id: "box-donat",
    foto: "/makanan4.jpeg",
    nama: "Box Donat Mini Rasa Campur",
    detail:
      "Enam donat mini rasa campur dalam satu box, siap dimakan hingga besok.",
    stok: "Sisa 8 box",
    waktuHabis: 55 * 60,
  },
  {
    id: "sandwich-croissant",
    foto: "/makanan8.webp",
    nama: "Sandwich Croissant Pagi",
    detail:
      "Croissant mentega berisi isian pilihan, dibungkus rapi untuk dibawa pergi.",
    stok: "Sisa 2 paket",
    waktuHabis: 1 * 3600 + 10 * 60,
  },
  {
    id: "ikan-sayur",
    foto: "/makanan10.webp",
    nama: "Ikan & Sayur Surplus Hari Ini",
    detail:
      "Panggang saus jamur, dari kelebihan pasokan segar yang masih layak.",
    stok: "Sisa 4 porsi",
    waktuHabis: 2 * 3600 + 30 * 60,
  },
  {
    id: "kopi-susu",
    foto: "/makanan9.webp",
    nama: "Kopi Susu Sisa Barista",
    detail:
      "Racikan barista pagi tadi, disimpan dingin, tetap nikmat hingga sore.",
    stok: "Sisa 12 cangkir",
    waktuHabis: 1 * 3600 + 45 * 60,
  },
];

const TICKER = [
  "ROTI",
  "PASTRI",
  "SALAD",
  "SUP",
  "PASTA",
  "KUE",
  "SANDWICH",
  "DONAT",
  "SAYURAN",
  "BUAH",
  "KOPI",
  "FRITTATA",
];

const AUTO_ADVANCE_MS = 5000;

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-cream";

function formatHMS(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

function useCountdown(baseSeconds: number, key: string) {
  const [remaining, setRemaining] = useState(baseSeconds);

  useEffect(() => {
    setRemaining(baseSeconds);
    const id = window.setInterval(() => {
      setRemaining((r) => (r <= 1 ? baseSeconds : r - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [baseSeconds, key]);

  return remaining;
}

function FoodPhoto({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-sage">
        <Leaf
          className="h-16 w-16 text-forest/40"
          strokeWidth={1.25}
          aria-hidden
        />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      decoding="async"
      draggable={false}
      className="h-full w-full object-cover"
    />
  );
}

export function RekomendasiSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();

  const item = FOODS[activeIndex];
  const remaining = useCountdown(item.waktuHabis, item.id);

  const goTo = useCallback((next: number) => {
    const wrapped = (next + FOODS.length) % FOODS.length;
    activeIndexRef.current = wrapped;
    setActiveIndex(wrapped);
  }, []);

  const startAutoAdvance = useCallback(() => {
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      goTo(activeIndexRef.current + 1);
    }, AUTO_ADVANCE_MS);
  }, [goTo]);

  useEffect(() => {
    startAutoAdvance();
    return () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
    };
  }, [startAutoAdvance]);

  const navigate = useCallback(
    (dir: number) => {
      goTo(activeIndexRef.current + dir);
      startAutoAdvance();
    },
    [goTo, startAutoAdvance]
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      navigate(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      navigate(1);
    }
  };

  const fade: Transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.4, ease: "easeInOut" };
  const infoFade: Transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.3, ease: "easeInOut" };

  return (
    <section id="pembeli" className="bg-cream pt-24 lg:pt-32">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12">

        <div className="text-center">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.4em] text-forest-dark">
            Rekomendasi
          </p>
          <h2 className="mt-5 font-display text-[clamp(2.2rem,5.5vw,4.5rem)] font-bold leading-[0.98] tracking-[-0.02em] text-forest">
            UNTUK KAMU
          </h2>
        </div>


        <div className="mt-16 grid items-center gap-12 lg:mt-20 lg:grid-cols-[1fr_400px_1fr] lg:gap-10 xl:gap-16">

          <div className="order-2 flex flex-col items-center lg:order-none lg:items-start">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={item.id}
                className="flex w-full flex-col items-center gap-10 text-center lg:items-start lg:gap-12 lg:text-left"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={infoFade}
              >
                <div className="max-w-[320px]">
                  <Tag className="h-6 w-6 text-forest" strokeWidth={1.5} aria-hidden />
                  <h3 className="mt-4 font-display text-2xl font-bold leading-snug text-forest-dark">
                    {item.nama}
                  </h3>
                </div>

                <div className="h-px w-full max-w-[320px] bg-hairline" />

                <div className="max-w-[320px]">
                  <Info className="h-6 w-6 text-forest" strokeWidth={1.5} aria-hidden />
                  <p className="mt-4 font-sans text-sm leading-relaxed text-stone">
                    {item.detail}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>


          <div className="order-1 lg:order-none">
            <div className="relative mx-auto w-full max-w-[400px] sm:max-w-[440px]">
              <div
                tabIndex={0}
                role="region"
                aria-roledescription="carousel"
                aria-label="Carousel rekomendasi makanan"
                onKeyDown={handleKeyDown}
                className={`relative aspect-square w-full overflow-hidden rounded-full bg-sage shadow-[0_36px_70px_-30px_rgba(34,81,56,0.55)] ${FOCUS_RING}`}
              >
                <AnimatePresence initial={false} mode="sync">
                  <motion.div
                    key={item.id}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={fade}
                  >
                    <FoodPhoto src={item.foto} alt={`Foto ${item.nama}`} />
                  </motion.div>
                </AnimatePresence>

                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  aria-label="Rekomendasi sebelumnya"
                  className={`absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-hairline bg-white text-forest-dark shadow-[0_14px_30px_-16px_rgba(34,81,56,0.65)] transition-all duration-300 hover:bg-forest-dark hover:text-white sm:left-5 sm:h-12 sm:w-12 ${FOCUS_RING}`}
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate(1)}
                  aria-label="Rekomendasi berikutnya"
                  className={`absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-forest-dark text-white shadow-[0_14px_30px_-16px_rgba(34,81,56,0.7)] transition-all duration-300 hover:bg-forest sm:right-5 sm:h-12 sm:w-12 ${FOCUS_RING}`}
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>

              <Link
                href={`/register?produk=${item.id}`}
                className={`group absolute bottom-0 left-1/2 z-20 inline-flex -translate-x-1/2 translate-y-1/2 items-center gap-2 rounded-full bg-forest px-7 py-3.5 font-sans text-sm font-semibold text-white shadow-[0_18px_38px_-16px_rgba(34,81,56,0.75)] transition-all duration-300 hover:bg-forest-dark ${FOCUS_RING}`}
              >
                <ShoppingCart className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
                Beli Sekarang
              </Link>
            </div>
          </div>


          <div className="order-3 flex flex-col items-center lg:order-none lg:items-end">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={item.id}
                className="flex w-full flex-col items-center gap-10 text-center lg:items-end lg:gap-12 lg:text-right"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={infoFade}
              >
                <div className="max-w-[320px]">
                  <Package className="h-6 w-6 text-forest" strokeWidth={1.5} aria-hidden />
                  <p className="mt-4 font-sans text-lg font-bold text-forest-dark">
                    {item.stok}
                  </p>
                </div>

                <div className="h-px w-full max-w-[320px] bg-hairline" />

                <div className="max-w-[320px]">
                  <Clock className="h-6 w-6 text-forest" strokeWidth={1.5} aria-hidden />
                  <p className="mt-4 font-sans text-sm text-stone">
                    Habis dalam{" "}
                    <span className="font-semibold text-forest-dark tabular-nums">
                      {formatHMS(remaining)}
                    </span>
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>


      <div className="group relative mt-20 flex overflow-hidden bg-forest lg:mt-24">
        <div
          tabIndex={0}
          aria-label="Kategori makanan ReBites"
          className="flex w-max shrink-0 animate-marquee items-center whitespace-nowrap py-5 [animation-duration:30s] group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
        >
          {TICKER.concat(TICKER).map((kategori, i) => (
            <span
              key={i}
              aria-hidden={i >= TICKER.length}
              className="flex items-center font-sans text-sm font-bold uppercase tracking-[0.22em] text-white"
            >
              <span className="px-6">{kategori}</span>
              <span className="text-white/40">•</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
