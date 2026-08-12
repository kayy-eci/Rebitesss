"use client";

import { useEffect, useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Search,
  Store,
  ShoppingCart,
  TrendingDown,
  MapPin,
  Clock,
  Check,
  Sparkles,
} from "lucide-react";
import { SmoothScroll } from "@/app/components/smooth-scroll";
import { Preloader } from "@/app/components/preloader";
import { SiteFooter } from "@/app/components/site-footer";
import { Reveal } from "@/app/components/reveal";
import { Counter } from "@/app/components/counter";
import { Marquee } from "@/app/components/marquee";
import { MagneticButton, ArrowLink } from "@/app/components/magnetic-button";
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
  "Warung Nusantara",
  "Roti Subuh",
  "Dapur Ibu Tini",
  "Kue Mbok Ndari",
  "Segar Bahari",
  "Satay Pak Budi",
  "Toko Sehat Jaya",
  "Kopi Pagi",
];

const FOODS = [
  {
    name: "Pizza Sayap Zaitun",
    desc: "Pizza tipis dengan mozzarella leleh, arugula segar, dan zaitun hitam di atas saus tomat rumahan.",
    price: 45000,
    original: 95000,
    image: "/makanan1.jpeg",
  },
  {
    name: "Sayap Ayam Panggang",
    desc: "Sayap ayam panggang renyah dengan bumbu rosemary dan bawang putih, cocok untuk lauk atau cemilan.",
    price: 28000,
    original: 58000,
    image: "/makanan2.jpeg",
  },
  {
    name: "Pasta Basil Tomat",
    desc: "Pasta gandum utuh dengan tomat ceri, bayam, dan feta yang dimasak dengan minyak zaitun.",
    price: 32000,
    original: 65000,
    image: "/makanan3.jpeg",
  },
  {
    name: "Kari & Naan Hangat",
    desc: "Perpaduan kari rempah khas India dengan roti naan lembut dan pakora renyah dalam satu set.",
    price: 38000,
    original: 75000,
    image: "/makanan4.jpeg",
  },
  {
    name: "Pancake Stroberi",
    desc: "Pancake lembut bertumpuk dengan stroberi segar, sirup, dan taburan kacang untuk akhir yang manis.",
    price: 25000,
    original: 52000,
    image: "/makanan5.jpeg",
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
    if (loaded) document.body.style.overflow = "";
  }, [loaded]);

  return (
    <SmoothScroll>
      <Preloader onDone={() => setLoaded(true)} />

      {/* ── HERO ─────────────────────────────────────────── */}
      <HeroSection />

      {/* ── MARQUEE: kategori ────────────────────────────── */}
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

      {/* ── MASALAH: Food Waste ──────────────────────────── */}
      <section
        id="masalah"
        className="grain-overlay relative overflow-hidden bg-primary py-24 text-primary-foreground lg:py-36"
      >
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
            <div>
              <Reveal>
                <Badge className="mb-6 bg-primary-foreground/10 text-primary-foreground">
                  01 - Masalah
                </Badge>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-light leading-[1.02] tracking-[-0.02em]">
                  Setiap hari, jutaan porsi{" "}
                  <span className="italic">terbuang</span> begitu saja.
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-6 max-w-sm font-sans text-sm leading-relaxed text-primary-foreground/70">
                  Data Bappenas mencatat skala food loss &amp; food waste di
                  Indonesia mencapai angka yang sulit diabaikan - berdampak pada
                  ekonomi, ketahanan pangan, dan lingkungan.
                </p>
              </Reveal>
            </div>

            <div className="grid gap-px bg-primary-foreground/15 sm:grid-cols-2">
              <StatCard
                prefix=""
                to={48}
                suffix=" jt"
                label="ton food loss & food waste per tahun"
                sub="23–48 juta ton"
              />
              <StatCard
                to={184}
                suffix=" kg"
                label="per kapita per tahun"
                sub="115–184 kg/kapita/tahun"
              />
              <StatCard
                prefix="Rp "
                to={551}
                suffix=" T"
                label="kerugian ekonomi per tahun"
                sub="Rp213–551 triliun"
              />
              <StatCard
                to={125}
                suffix=" jt"
                label="setara kebutuhan pangan penduduk"
                sub="61–125 juta penduduk"
              />
            </div>
          </div>

          <Reveal delay={0.15}>
            <p className="mt-16 max-w-2xl border-l-2 border-primary-foreground/30 pl-6 font-display text-xl font-light italic leading-relaxed text-primary-foreground/80">
              &ldquo;Makanan yang terbuang bukan hanya uang yang hilang - tapi
              tenaga, lahan, dan kesempatan untuk mengenyangkan sesama.&rdquo;
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-4 font-sans text-xs text-primary-foreground/40">
              Sumber: Studi Bappenas &amp; Ministry of National Development
              Planning (2023)
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── CARA KERJA ───────────────────────────────────── */}
      <section
        id="cara-kerja"
        className="grain-overlay relative overflow-hidden bg-background py-24 lg:py-32"
      >
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Reveal>
                <Badge variant="outline" className="mb-5">
                  02 - Cara Kerja
                </Badge>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="max-w-2xl font-display text-[clamp(2rem,4.5vw,3.5rem)] font-light leading-[1.02] tracking-[-0.02em] text-primary">
                  Empat langkah, dari dapur ke piring.
                </h2>
              </Reveal>
            </div>
            <Reveal delay={0.15}>
              <p className="max-w-xs font-sans text-sm leading-relaxed text-muted-foreground">
                Sederhana, transparan, dan dirancang untuk pelaku UMKM kuliner
                skala kecil hingga menengah.
              </p>
            </Reveal>
          </div>

          {/* bento grid */}
          <div className="mt-14 grid gap-4 md:grid-cols-6 md:grid-rows-[auto_auto]">
            {/* step 1 - large */}
            <Reveal className="md:col-span-3" delay={0.05}>
              <div className="group h-full rounded-[var(--radius)] border border-border bg-secondary p-8 transition-colors duration-300 hover:border-primary/30">
                <div className="flex items-center justify-between">
                  <span className="font-display text-5xl font-light text-primary/30">
                    01
                  </span>
                  <Store className="h-7 w-7 text-primary/40 transition-transform duration-500 group-hover:scale-110" />
                </div>
                <h3 className="mt-10 font-display text-2xl font-medium text-primary">
                  UMKM daftar &amp; unggah surplus
                </h3>
                <p className="mt-3 max-w-sm font-sans text-sm leading-relaxed text-muted-foreground">
                  Pelaku usaha membuat akun, melengkapi profil, lalu mengunggah
                  makanan surplus beserta stok, harga diskon, dan waktu jual.
                </p>
              </div>
            </Reveal>

            {/* step 2 */}
            <Reveal className="md:col-span-3" delay={0.1}>
              <div className="group h-full rounded-[var(--radius)] border border-border bg-background p-8 transition-colors duration-300 hover:border-primary/30">
                <div className="flex items-center justify-between">
                  <span className="font-display text-5xl font-light text-primary/30">
                    02
                  </span>
                  <Search className="h-7 w-7 text-primary/40 transition-transform duration-500 group-hover:scale-110" />
                </div>
                <h3 className="mt-10 font-display text-2xl font-medium text-primary">
                  Pembeli cari &amp; pesan
                </h3>
                <p className="mt-3 max-w-sm font-sans text-sm leading-relaxed text-muted-foreground">
                  Pembeli menelusuri makanan surplus terdekat, memfilter
                  kategori dan lokasi, lalu memesan dengan catatan.
                </p>
              </div>
            </Reveal>

            {/* step 3 */}
            <Reveal className="md:col-span-2" delay={0.15}>
              <div className="group h-full rounded-[var(--radius)] border border-border bg-background p-8 transition-colors duration-300 hover:border-primary/30">
                <span className="font-display text-5xl font-light text-primary/30">
                  03
                </span>
                <MapPin className="mt-6 h-6 w-6 text-primary/40" />
                <h3 className="mt-6 font-display text-xl font-medium text-primary">
                  Ambil atau diantar
                </h3>
                <p className="mt-2 font-sans text-[13px] leading-relaxed text-muted-foreground">
                  Pembeli memilih pickup di lokasi atau diantar.
                </p>
              </div>
            </Reveal>

            {/* step 4 - accent */}
            <Reveal className="md:col-span-4" delay={0.2}>
              <div className="group flex h-full flex-col justify-between rounded-[var(--radius)] bg-primary p-8 text-primary-foreground">
                <div className="flex items-center justify-between">
                  <span className="font-display text-5xl font-light text-primary-foreground/30">
                    04
                  </span>
                  <Sparkles className="h-7 w-7 text-primary-foreground/60 transition-transform duration-500 group-hover:rotate-12" />
                </div>
                <div className="mt-10">
                  <h3 className="font-display text-2xl font-medium">
                    Makanan terselamatkan
                  </h3>
                  <p className="mt-3 max-w-md font-sans text-sm leading-relaxed text-primary-foreground/70">
                    Satu pesanan = satu porsi yang tidak jadi sampah. UMKM dapat
                    pemasukan tambahan, pembeli hemat, bumi lega.
                  </p>
                  <ArrowLink
                    href="/#dampak"
                    className="mt-5 text-primary-foreground"
                  >
                    Lihat dampaknya
                  </ArrowLink>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── UNTUK UMKM ───────────────────────────────────── */}
      <section
        id="umkm"
        className="grain-overlay relative overflow-hidden bg-secondary py-24 lg:py-32"
      >
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Reveal>
                <Badge variant="outline" className="mb-5">
                  03 - Untuk UMKM
                </Badge>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] font-light leading-[1.02] tracking-[-0.02em] text-primary">
                  Kelola surplus, tambah pemasukan.
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-6 max-w-md font-sans text-sm leading-relaxed text-foreground/70">
                  Alat yang dirancang khusus untuk pelaku kuliner skala kecil.
                  Kelola produk, stok, pesanan, dan langganan dari satu dasbor.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <div className="mt-8 flex items-center gap-4 rounded-[var(--radius)] border border-primary/15 bg-background p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground-strong">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-sans text-sm font-medium text-primary">
                      Trial gratis 1 bulan
                    </p>
                    <p className="font-sans text-xs text-muted-foreground">
                      Tanpa kartu kredit. Batalkan kapan saja.
                    </p>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.35}>
                <div className="mt-8">
                  <MagneticButton href="/register" variant="default">
                    Daftar sebagai UMKM
                    <ArrowRight className="h-4 w-4" />
                  </MagneticButton>
                </div>
              </Reveal>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: Store,
                  title: "Profil usaha",
                  desc: "Kelola nama, deskripsi, logo, dan lokasi dapur yang terlihat di marketplace.",
                },
                {
                  icon: ShoppingCart,
                  title: "Stok, harga & status",
                  desc: "Atur stok harian, harga surplus, status ketersediaan, dan waktu jual.",
                },
                {
                  icon: Sparkles,
                  title: "Langganan dengan trial",
                  desc: "Coba 1 bulan gratis, lalu pilih paket sesuai skala usaha.",
                },
                {
                  icon: Check,
                  title: "Kelola pesanan masuk",
                  desc: "Terima, proses, dan tandai pesanan siap diambil atau dikirim.",
                },
                {
                  icon: TrendingDown,
                  title: "Riwayat penjualan",
                  desc: "Pantau performa produk dan pemasukan dari makanan yang diselamatkan.",
                },
                {
                  icon: MapPin,
                  title: "Peta pickup",
                  desc: "Tampilkan titik lokasi agar pembeli mudah menemukan dapur Anda.",
                },
              ].map((f, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="group h-full rounded-[var(--radius)] border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_20px_40px_-20px_hsl(var(--primary)/0.3)]">
                    <f.icon className="h-6 w-6 text-primary/50 transition-transform duration-500 group-hover:scale-110 group-hover:text-primary" />
                    <h3 className="mt-5 font-display text-lg font-medium text-primary">
                      {f.title}
                    </h3>
                    <p className="mt-2 font-sans text-[13px] leading-relaxed text-muted-foreground">
                      {f.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE: mitra UMKM ──────────────────────────── */}
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

      {/* ── REKOMENDASI MAKANAN ───────────────────────────────── */}
      <section
        id="pembeli"
        className="grain-overlay relative overflow-hidden bg-secondary py-24 lg:py-32"
      >
        {/* soft radial glow */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-3xl" />

        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          {/* centered header */}
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <Badge variant="outline" className="mb-5">
                04 - Rekomendasi Makanan
              </Badge>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display text-[clamp(2.2rem,5vw,4rem)] font-light leading-[1.02] tracking-[-0.02em] text-primary">
                Rekomendasi{" "}
                <span className="italic font-extralight">Makanan</span>
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mx-auto mt-5 max-w-md font-sans text-sm leading-relaxed text-muted-foreground">
                Beberapa makanan unggulan untuk anda
              </p>
            </Reveal>
          </div>

          <div className="mt-16 grid items-center gap-14 lg:mt-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:gap-16 xl:gap-20">
            {/* info makanan terpilih */}
            <div className="mx-auto w-full max-w-[520px] text-center lg:max-w-none lg:text-left">
              <AnimatePresence mode="wait">
                <motion.div
                  key={foodIndex}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Badge variant="outline" className="mb-5">
                    <Sparkles className="h-3 w-3" />
                    Hemat {Math.round((1 - food.price / food.original) * 100)}%
                  </Badge>
                  <h3 className="font-display text-[clamp(2.2rem,3.5vw,3.4rem)] font-medium leading-[1.05] tracking-[-0.02em] text-primary">
                    {food.name}
                  </h3>
                  <p className="mt-5 font-sans text-sm leading-relaxed text-muted-foreground">
                    {food.desc}
                  </p>
                  <div className="mt-7 flex flex-wrap items-end gap-x-4 gap-y-2">
                    <span className="font-display text-4xl font-light tracking-tight text-primary lg:text-5xl">
                      Rp{food.price.toLocaleString("id-ID")}
                    </span>
                    <span className="pb-1 font-sans text-sm text-muted-foreground line-through">
                      Rp{food.original.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <Link
                    href="/#cta"
                    className="group mt-8 inline-flex items-center gap-2 rounded-full border border-hairline bg-white px-6 py-3 font-inter text-sm font-semibold text-forest-dark shadow-[0_14px_30px_-20px_rgba(47,66,53,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:border-forest/40 hover:text-forest"
                  >
                    Pesan Sekarang
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* piring berputar */}
            <div className="mx-auto w-full max-w-[560px]">
              <div className="relative h-[480px] w-full sm:h-[540px]">
                <OptionWheel
                  items={FOODS.map((f) => f.name)}
                  defaultSelected={0}
                  side="right"
                  fontSize={8}
                  spacing={1.4}
                  curve={1}
                  tilt={7}
                  blur={3}
                  fade={0.32}
                  minOpacity={0.02}
                  smoothing={160}
                  loop
                  draggable
                  autoRotate
                  autoRotateInterval={2600}
                  plateSize={210}
                  onChange={(index) => setFoodIndex(index)}
                  renderItem={(i) => <FoodPlate image={FOODS[i].image} />}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DAMPAK ──────────────────────────────────────── */}
      <section
        id="dampak"
        className="grain-overlay relative overflow-hidden bg-secondary py-24 lg:py-32"
      >
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-3">
            {[
              {
                tag: "Ekonomi",
                title: "Pemasukan tambahan untuk UMKM",
                desc: "Makanan yang tadinya terbuang berubah menjadi pendapatan. Pembeli mendapat harga lebih terjangkau.",
                stat: <Counter to={30} suffix="%" />,
                statLabel: "potensi tambahan pendapatan UMKM",
              },
              {
                tag: "Sosial",
                title: "Pangan terjangkau untuk lebih banyak orang",
                desc: "Makanan layak konsumsi tersedia dengan harga diskon, memperluas akses pangan bagi lebih banyak keluarga.",
                stat: <Counter to={125} suffix=" jt" />,
                statLabel: "potensi porsi yang bisa diselamatkan",
              },
              {
                tag: "Lingkungan",
                title: "Mengurangi emsi dari food waste",
                desc: "Setiap porsi yang tidak jadi sampah mengurangi emisi gas rumah kaca dari tempat pembuangan akhir.",
                stat: <Counter to={8} suffix="%" />,
                statLabel: "emisi global berasal dari food waste",
              },
            ].map((d, i) => (
              <Reveal key={i} delay={i * 0.12}>
                <div className="h-full rounded-[var(--radius)] border border-border bg-background p-8">
                  <Badge variant="secondary" className="mb-6">
                    {d.tag}
                  </Badge>
                  <h3 className="font-display text-2xl font-medium leading-snug text-primary">
                    {d.title}
                  </h3>
                  <p className="mt-4 font-sans text-sm leading-relaxed text-muted-foreground">
                    {d.desc}
                  </p>
                  <div className="mt-8 border-t border-border pt-6">
                    <p className="font-display text-4xl font-light text-primary">
                      {d.stat}
                    </p>
                    <p className="mt-1 font-sans text-xs text-muted-foreground">
                      {d.statLabel}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <p className="mt-10 font-sans text-xs text-muted-foreground">
              * Angka merupakan proyeksi potensi dampak berdasarkan data food
              waste nasional, bukan klaim data riil ReBites.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── PAKET LANGGANAN ──────────────────────────────── */}
      <section
        id="langganan"
        className="grain-overlay relative overflow-hidden bg-background py-24 lg:py-32"
      >
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Reveal>
                <Badge variant="outline" className="mb-5">
                  05 - Paket Langganan
                </Badge>
              </Reveal>
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
                        <Sparkles className="h-3 w-3" /> Paling populer
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
          <circle cx="100" cy="100" r="62" />
        </clipPath>
      </defs>

      {/* Outer plate */}
      <circle cx="100" cy="100" r="92" fill={`url(#${gradId})`} />

      {/* Outer rim */}
      <circle cx="100" cy="100" r="92" fill="none" stroke="#C8C5B5" strokeWidth="2.5" />

      {/* Inner rim */}
      <circle cx="100" cy="100" r="78" fill="none" stroke="#D8D5C6" strokeWidth="1.5" />

      {/* Inner plate */}
      <circle cx="100" cy="100" r="66" fill="#F5F3E9" />

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
      <circle cx="100" cy="100" r="62" fill="none" stroke="#F5F3E9" strokeWidth="4" />

      {/* Plate highlight */}
      <ellipse cx="80" cy="66" rx="46" ry="22" fill="#FFFFFF" opacity="0.16" />
    </svg>
  );
}

function StatCard({
  to,
  suffix,
  prefix,
  label,
  sub,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  label: string;
  sub: string;
}) {
  return (
    <div className="bg-primary p-8 lg:p-10">
      <p className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-none tracking-tight text-primary-foreground">
        <Counter to={to} prefix={prefix} suffix={suffix} duration={2.4} />
      </p>
      <p className="mt-4 font-sans text-sm leading-relaxed text-primary-foreground/70">
        {label}
      </p>
      <p className="mt-2 font-sans text-xs text-primary-foreground/40">{sub}</p>
    </div>
  );
}
