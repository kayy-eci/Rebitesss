"use client";

import { useEffect, useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Store,
  Clock,
  Check,
  Sparkles,
  Scale,
  Wallet,
  Users,
} from "lucide-react";
import { SmoothScroll } from "@/app/components/smooth-scroll";
import { Preloader } from "@/app/components/preloader";
import { SiteFooter } from "@/app/components/site-footer";
import { Reveal, RevealWords } from "@/app/components/reveal";
import { Counter } from "@/app/components/counter";
import { Marquee } from "@/app/components/marquee";
import { MagneticButton } from "@/app/components/magnetic-button";
import HowItWorks from "@/app/components/HowItWorks";
import { Badge } from "@/app/components/ui/badge";
import { HeroSection } from "@/app/components/hero-section";
import OptionWheel from "@/app/components/ui/korosel";

const CATEGORIES = [
  "Makanan Rumahan",
  "Roti & Bakeri",
  "Kue & Dessert",
  "Jajanan Pasar",
  "Sayuran Segar",
  "Minuman",
  "Seafood",
  "Satay & Grill",
];

const PARTNERS = [
  "Warung Mang Teten",
  "Roti Boy",
  "Dapur Ibu Sri",
  "Kue Mbok Darmi",
  "Segar Sigit",
  "Satay Pak Tigiset",
  "Toko Sehat Jaya",
  "Kopi Pagi",
];

type Food = {
  name: string;
  desc: string;
  price: number;
  original?: number;
  tag?: string;
  image: string;
};

const FOODS: Food[] = [
  {
    name: "Geprek Sambal Bawang",
    desc: "Ayamnya digoreng kering, sambal bawangnya pedes bikin keringetan. Kalau nggak kuat level asli, boleh minta dibikin sopan.",
    price: 20000,
    original: 24000,
    image: "/makanan1.jpeg",
  },
  {
    name: "Nasi Goreng Kampung",
    desc: "Nasgor ala rumahan: telur dadar, kerupuk, dan acar. Enak dimakan nasi anget pas jam istirahat.",
    price: 25000,
    image: "/makanan2.jpeg",
  },
  {
    name: "Soto Mie Bogor",
    desc: "Kuah kaldu hangat, lengkap sama mie, risol, dan potongan daging sapi. Paling pas dimakan pas hujan.",
    price: 30000,
    original: 34000,
    image: "/makanan3.jpeg",
  },
  {
    name: "Sate Ayam Bumbu Kacang",
    desc: "Sepuluh tusuk sate bakaran arang, bumbu kacang kental dari kacang sangrai sendiri. Lontongnya minta dua juga nggak nolak.",
    price: 32000,
    tag: "Favorit",
    image: "/makanan4.jpeg",
  },
  {
    name: "Rendang Sapi Rumahan",
    desc: "Dimasak pelan sampai bumbunya nyerap bener, dagingnya empuk tapi nggak lembek. Diduetin sama nasi anget, habis satu piring.",
    price: 38000,
    tag: "Terlaris",
    image: "/makanan5.jpeg",
  },
  {
    name: "Kari Ayam Kuning",
    desc: "Kuah kari kental dari santan segar, ayamnya empuk meresap kunyit dan rempah. Paling enak disantap sama ketupat atau nasi anget.",
    price: 27000,
    original: 30000,
    image: "/makanan6.jpeg",
  },
  {
    name: "Gado-Gado Ibu",
    desc: "Sayuran rebus segar disiram bumbu kacang gurih, telur, tahu, tempe, dan kerupuk. Dijamin bikin nambah terus.",
    price: 19000,
    tag: "Sehat",
    image: "/makanan7.jpg",
  },
  {
    name: "Nasi Uduk Komplit",
    desc: "Nasi uduk wangi santan dan daun pandan, lengkap sama orek tempe, telur balado, bihun, dan sambal kacang.",
    price: 21000,
    original: 24000,
    image: "/makanan8.webp",
  },
  {
    name: "Ikan Bakar Sambal Matah",
    desc: "Ikan bakar bumbu kecap manis, dipadu sambal matah segar yang bikin nagih. Dimakan sama nasi putih hangat, mantap.",
    price: 33000,
    tag: "Favorit",
    image: "/makanan9.webp",
  },
  {
    name: "Rawon Daging",
    desc: "Semangkuk rawon kuah hitam khas keluak yang gurih, dagingnya empuk dengan tauge dan sambal terasi. Pas buat makan siang.",
    price: 35000,
    original: 39000,
    image: "/makanan10.webp",
  },
];

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [foodIndex, setFoodIndex] = useState(0);
  const food = FOODS[foodIndex];

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (loaded) {
      document.body.style.overflow = "";
    }
  }, [loaded]);

  return (
    <SmoothScroll>
      <Preloader onDone={() => setLoaded(true)} />

      {/* ── HERO / BERANDA ─────────────────────────────────── */}
      <div id="top">
        <HeroSection />
      </div>

      {/* ── MARQUEE: KATEGORI ──────────────────────────────── */}
      <section className="border-y border-border/60 bg-background py-5">
        <Marquee pauseOnHover>
          {CATEGORIES.map((c, i) => (
            <span
              key={i}
              className="mx-6 flex items-center gap-3 font-display text-xl font-light text-primary/70 lg:text-2xl"
            >
              {c}
              <span className="text-primary/30">✦</span>
            </span>
          ))}
        </Marquee>
      </section>

      {/* ── INFO: FOOD WASTE ───────────────────────────────── */}
      <section
        id="info"
        className="grain-overlay relative overflow-hidden bg-primary py-24 text-primary-foreground lg:py-36"
      >
        {/* Watermark outline angka */}
        <span
          aria-hidden
          className="pointer-events-none absolute -top-8 right-0 select-none font-display text-[clamp(10rem,24vw,22rem)] font-extralight leading-none text-transparent"
          style={{
            WebkitTextStroke: "1px hsl(var(--primary-foreground) / 0.12)",
          }}
        >
          48
        </span>

        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
            {/* Kiri: judul + ticker live */}
            <div>
              <Reveal delay={0.05}>
                <p className="flex items-center gap-3 font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-primary-foreground/50">
                  Fakta food loss &amp; food waste
                  <span className="h-px w-8 bg-primary-foreground/30" />
                </p>
              </Reveal>

              <Reveal delay={0.1}>
                <h2 className="mt-6 font-display text-[clamp(2rem,4vw,3.5rem)] font-light leading-[1.02] tracking-[-0.02em]">
                  <RevealWords text="Setiap hari, jutaan porsi" />{" "}
                  <span className="italic">
                    <RevealWords text="terbuang" />
                  </span>{" "}
                  <RevealWords text="begitu saja." />
                </h2>
              </Reveal>

              <Reveal delay={0.2}>
                <p className="mt-6 max-w-sm font-sans text-sm leading-relaxed text-primary-foreground/70">
                  Data Bappenas mencatat skala food loss &amp; food waste di
                  Indonesia mencapai angka yang sulit diabaikan. Hal ini
                  berdampak pada ekonomi, ketahanan pangan, dan lingkungan.
                </p>
              </Reveal>

              <Reveal delay={0.25}>
                <div className="mt-8 rounded-[var(--radius)] border border-primary-foreground/15 bg-primary-foreground/[0.05] p-6">
                  <p className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-primary-foreground/50">
                    Food loss &amp; waste Indonesia per tahun
                  </p>

                  <p className="mt-3 flex items-baseline gap-1.5 font-display text-[clamp(2.1rem,4vw,3.2rem)] font-light leading-none tracking-tight">
                    <Counter
                      to={46_350_000}
                      className="tabular-nums"
                      duration={10}
                    />
                    <span className="font-sans text-sm text-primary-foreground/50">
                      ton
                    </span>
                  </p>

                  <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1 border-t border-dashed border-primary-foreground/15 pt-4 font-sans text-xs text-primary-foreground/50">
                    <span>≈ 91 ton / menit</span>
                    <span>≈ 1,5 ton / detik</span>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Kanan: statistik */}
            <div className="grid gap-4">
              <Reveal delay={0.1}>
                <div className="flex flex-col items-center gap-8 rounded-[var(--radius)] border border-primary-foreground/15 bg-primary-foreground/[0.04] p-8 sm:flex-row sm:items-center lg:p-10">
                  <WasteRing progress={0.82}>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <p className="font-display text-[clamp(2.6rem,4vw,3.6rem)] font-light leading-none tracking-tight text-center">
                        <Counter
                          to={7.3}
                          decimals={1}
                          suffix="%"
                          duration={5}
                        />
                      </p>
                    </div>
                  </WasteRing>

                  <div className="text-center sm:text-left">
                    <h3 className="font-display text-2xl font-medium">
                      Emisi gas rumah kaca
                    </h3>

                    <p className="mt-3 font-sans text-sm leading-relaxed text-primary-foreground/70">
                      Sisa pangan yang terbuang ikut menyumbang emisi gas rumah
                      kaca yang mempercepat perubahan iklim.
                    </p>

                    <p className="mt-4 font-sans text-xs text-primary-foreground/40">
                      Setara 1.702 juta ton CO₂e per tahun
                    </p>
                  </div>
                </div>
              </Reveal>

              <div className="grid gap-4 sm:grid-cols-3">
                <Reveal delay={0.15}>
                  <StatTile
                    icon={<Scale className="h-5 w-5" />}
                    counter={<Counter to={184} suffix=" kg" duration={2.4} />}
                    label="per kapita per tahun"
                    sub="115–184 kg/kapita/tahun"
                  />
                </Reveal>

                <Reveal delay={0.2}>
                  <StatTile
                    icon={<Wallet className="h-5 w-5" />}
                    counter={
                      <Counter
                        prefix="Rp "
                        to={551}
                        suffix=" T"
                        duration={2.4}
                      />
                    }
                    label="kerugian ekonomi per tahun"
                    sub="Rp213–551 triliun"
                  />
                </Reveal>

                <Reveal delay={0.25}>
                  <StatTile
                    icon={<Users className="h-5 w-5" />}
                    counter={<Counter to={125} suffix=" jt" duration={2.4} />}
                    label="setara kebutuhan pangan penduduk"
                    sub="61–125 juta penduduk"
                  />
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CARA KERJA ─────────────────────────────────────── */}
      <HowItWorks />

      {/* ── MARQUEE: MITRA UMKM ─────────────────────────────── */}
      <section className="border-y border-border/60 bg-background py-5">
        <Marquee reverse pauseOnHover>
          {PARTNERS.map((p, i) => (
            <span
              key={i}
              className="mx-8 flex items-center gap-3 font-display text-lg font-light tracking-tight text-foreground/50 lg:text-xl"
            >
              <Store className="h-4 w-4 text-primary/40" />
              {p}
            </span>
          ))}
        </Marquee>
      </section>

      {/* ── REKOMENDASI MAKANAN ────────────────────────────── */}
      <section
        id="rekomendasi"
        className="grain-overlay relative overflow-hidden bg-secondary py-24 lg:py-32"
      >
        {/* Soft radial glow */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-3xl" />

        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="mx-auto max-w-3xl text-center">
            <Reveal delay={0.1}>
              <h2 className="font-display text-[clamp(2.2rem,5vw,4rem)] font-light leading-[1.02] tracking-[-0.02em] text-primary">
                Rekomendasi{" "}
                <span className="italic font-extralight">Makanan</span>
              </h2>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="mx-auto mt-5 max-w-md font-sans text-sm leading-relaxed text-muted-foreground">
                Yang lagi laris dari dapur tetangga
              </p>
            </Reveal>
          </div>

          <div className="mt-12 grid items-center gap-14 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:gap-16 xl:gap-20">
            {/* Info makanan terpilih */}
            <div className="mx-auto w-full max-w-[520px] text-center lg:max-w-none lg:text-left">
              <AnimatePresence mode="wait">
                <motion.div
                  key={foodIndex}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  {(food.original || food.tag) && (
                    <Badge variant="outline" className="mb-5">
                      <Sparkles className="h-3 w-3" />
                      {food.original
                        ? `Hemat ${Math.round((1 - food.price / food.original) * 100)}%`
                        : food.tag}
                    </Badge>
                  )}

                  <h3 className="font-display text-[clamp(2.2rem,3.5vw,3.4rem)] font-medium leading-[1.05] tracking-[-0.02em] text-primary">
                    {food.name}
                  </h3>

                  <p className="mx-auto mt-5 max-w-[46ch] font-sans text-sm leading-relaxed text-muted-foreground lg:mx-0">
                    {food.desc}
                  </p>

                  <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 lg:justify-start">
                    <span className="font-display text-4xl font-light tracking-tight text-primary lg:text-5xl">
                      Rp{food.price.toLocaleString("id-ID")}
                    </span>

                    {food.original && (
                      <span className="font-sans text-sm text-muted-foreground line-through">
                        Rp{food.original.toLocaleString("id-ID")}
                      </span>
                    )}
                  </div>

                  <div className="mt-8 flex flex-wrap items-center justify-center gap-5 lg:justify-start">
                    <Link
                      href="/#cta"
                      className="group inline-flex items-center gap-2 rounded-full border border-hairline bg-white px-6 py-3 font-inter text-sm font-semibold text-forest-dark shadow-[0_14px_30px_-20px_rgba(47,66,53,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:border-forest/40 hover:text-forest"
                    >
                      Pesan Sekarang
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>

                    <p className="font-sans text-xs tabular-nums text-muted-foreground/70">
                      {foodIndex + 1} / {FOODS.length}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Roda piring berputar */}
            <div className="relative mx-auto w-full max-w-[560px]">
              <div className="relative h-[520px] w-full sm:h-[600px]">
                <OptionWheel
                  items={FOODS.map((f) => f.name)}
                  defaultSelected={0}
                  side="right"
                  fontSize={8}
                  spacing={1.4}
                  curve={20}
                  tilt={6}
                  blur={3}
                  fade={0.32}
                  minOpacity={0.02}
                  smoothing={160}
                  loop
                  draggable
                  autoRotate
                  autoRotateInterval={3000}
                  plateSize={330}
                  onChange={(index) => setFoodIndex(index)}
                  renderItem={(i) => <FoodPlate image={FOODS[i].image} />}
                />

                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-secondary to-transparent sm:h-24"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-secondary to-transparent sm:h-24"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LANGGANAN / DAMPAK ─────────────────────────────── */}
      <section
        id="dampak"
        className="grain-overlay relative overflow-hidden bg-background py-24 lg:py-32"
      >
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Reveal delay={0.1}>
                <h2 className="max-w-2xl font-display text-[clamp(2rem,4.5vw,3.5rem)] font-light leading-[1.02] tracking-[-0.02em] text-primary">
                  Pilih paket yang tumbuh bersama usaha Anda.
                </h2>
              </Reveal>
            </div>

            <Reveal delay={0.15}>
              <div className="flex items-center gap-3 rounded-[var(--radius)] border border-primary/20 bg-secondary px-5 py-3">
                <Clock className="h-5 w-5 text-primary" />

                <p className="font-sans text-sm text-primary">
                  Semua paket dimulai dengan{" "}
                  <span className="font-medium">trial gratis 1 bulan</span>.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-4 lg:grid-cols-3">
            {[
              {
                name: "Starter",
                monthly: 0,
                yearly: 0,
                features: [
                  "Maksimal 5 produk",
                  "Kelola stok & harga",
                  "Riwayat penjualan 30 hari",
                  "Dasbor UMKM",
                ],
                popular: false,
              },
              {
                name: "Berkembang",
                monthly: 49000,
                yearly: 490000,
                features: [
                  "Maksimal 25 produk",
                  "Riwayat tanpa batas",
                  "Prioritas tampil di marketplace",
                  "Laporan penjualan lanjutan",
                  "Lencana UMKM Terverifikasi",
                ],
                popular: true,
              },
              {
                name: "Premium",
                monthly: 99000,
                yearly: 990000,
                features: [
                  "Produk tak terbatas",
                  "Semua fitur Berkembang",
                  "Promosi posisi unggulan",
                  "Analitik tren permintaan",
                  "Dukungan prioritas",
                ],
                popular: false,
              },
            ].map((plan, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div
                  className={`relative flex h-full flex-col rounded-[var(--radius)] border p-8 transition-all duration-300 hover:-translate-y-1 ${
                    plan.popular
                      ? "border-primary bg-primary text-primary-foreground shadow-[0_30px_60px_-25px_hsl(var(--primary)/0.5)]"
                      : "border-border bg-secondary hover:border-primary/30"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-8">
                      <Badge className="bg-secondary text-primary">
                        <Sparkles className="h-3 w-3" />
                        Paling populer
                      </Badge>
                    </div>
                  )}

                  <h3
                    className={`font-display text-2xl font-medium ${
                      plan.popular ? "text-primary-foreground" : "text-primary"
                    }`}
                  >
                    {plan.name}
                  </h3>

                  <div className="mt-5 flex items-baseline gap-1">
                    <span
                      className={`font-display text-4xl font-light ${
                        plan.popular
                          ? "text-primary-foreground"
                          : "text-primary"
                      }`}
                    >
                      {plan.monthly === 0
                        ? "Gratis"
                        : `Rp${plan.monthly.toLocaleString("id-ID")}`}
                    </span>

                    {plan.monthly !== 0 && (
                      <span
                        className={`font-sans text-sm ${
                          plan.popular
                            ? "text-primary-foreground/60"
                            : "text-muted-foreground"
                        }`}
                      >
                        /bulan
                      </span>
                    )}
                  </div>

                  <p
                    className={`mt-2 font-sans text-xs ${
                      plan.popular
                        ? "text-primary-foreground/60"
                        : "text-muted-foreground"
                    }`}
                  >
                    {plan.yearly !== 0
                      ? `atau Rp${plan.yearly.toLocaleString("id-ID")}/tahun`
                      : "tanpa biaya, selamanya"}
                  </p>

                  <div
                    className={`mt-6 flex items-center gap-2 rounded-[var(--radius)] px-3 py-2.5 text-xs ${
                      plan.popular
                        ? "bg-primary-foreground/10 text-primary-foreground"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Trial gratis 1 bulan
                  </div>

                  <ul className="mt-7 flex-1 space-y-3">
                    {plan.features.map((f, j) => (
                      <li
                        key={j}
                        className={`flex items-start gap-3 font-sans text-sm ${
                          plan.popular
                            ? "text-primary-foreground/85"
                            : "text-foreground/75"
                        }`}
                      >
                        <Check
                          className={`mt-0.5 h-4 w-4 shrink-0 ${
                            plan.popular
                              ? "text-primary-foreground"
                              : "text-primary"
                          }`}
                        />

                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <Link
                      href="/register"
                      className={`flex items-center justify-center gap-2 rounded-[var(--radius)] py-3 font-sans text-sm font-medium transition-all duration-300 ${
                        plan.popular
                          ? "bg-secondary text-primary hover:bg-secondary/80"
                          : "bg-primary text-primary-foreground-strong hover:bg-primary/90"
                      }`}
                    >
                      Mulai trial gratis
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </SmoothScroll>
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
      className="h-full w-full drop-shadow-[0_16px_22px_-14px_rgba(47,66,53,0.55)]"
    >
      <defs>
        <radialGradient id={gradId} cx="50%" cy="42%">
          <stop offset="0%" stopColor="#F7F6EE" />
          <stop offset="72%" stopColor="#E9E7D9" />
          <stop offset="100%" stopColor="#D5D2C1" />
        </radialGradient>

        <clipPath id={clipId}>
          <circle cx="100" cy="100" r="84" />
        </clipPath>
      </defs>

      {/* Outer plate */}
      <circle cx="100" cy="100" r="92" fill={`url(#${gradId})`} />

      {/* Outer rim */}
      <circle
        cx="100"
        cy="100"
        r="92"
        fill="none"
        stroke="#C8C5B5"
        strokeWidth="2.5"
      />

      {/* Inner rim */}
      <circle
        cx="100"
        cy="100"
        r="88"
        fill="none"
        stroke="#D8D5C6"
        strokeWidth="1.5"
      />

      {/* Inner plate */}
      <circle cx="100" cy="100" r="86" fill="#F5F3E9" />

      {/* Food image */}
      <image
        href={image}
        x="0"
        y="0"
        width="200"
        height="200"
        preserveAspectRatio="xMidYMid slice"
        clipPath={`url(#${clipId})`}
      />

      {/* Foto border */}
      <circle
        cx="100"
        cy="100"
        r="84"
        fill="none"
        stroke="#F5F3E9"
        strokeWidth="4"
      />

      {/* Plate highlight */}
      <ellipse cx="80" cy="66" rx="46" ry="22" fill="#FFFFFF" opacity="0.16" />
    </svg>
  );
}

function WasteRing({
  progress,
  children,
}: {
  progress: number;
  children: React.ReactNode;
}) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative h-44 w-44 shrink-0">
      <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="hsl(var(--primary-foreground) / 0.12)"
          strokeWidth="10"
        />

        <motion.circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="hsl(var(--primary-foreground) / 0.85)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: circumference * (1 - progress) }}
          viewport={{ once: true, margin: "-20% 0px" }}
          transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

function StatTile({
  icon,
  counter,
  label,
  sub,
}: {
  icon: React.ReactNode;
  counter: React.ReactNode;
  label: string;
  sub: string;
}) {
  return (
    <div className="group flex h-full flex-col rounded-[var(--radius)] border border-primary-foreground/15 bg-primary-foreground/[0.04] p-6 transition-colors duration-300 hover:bg-primary-foreground/10">
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/20 text-primary-foreground/70 transition-transform duration-500 group-hover:scale-110">
        {icon}
      </span>

      <p className="mt-6 font-display text-[clamp(1.9rem,3vw,2.6rem)] font-light leading-none tracking-tight">
        {counter}
      </p>

      <p className="mt-3 font-sans text-sm leading-relaxed text-primary-foreground/70">
        {label}
      </p>

      <p className="mt-3 border-t border-dashed border-primary-foreground/15 pt-2 font-sans text-xs text-primary-foreground/40">
        {sub}
      </p>
    </div>
  );
}
