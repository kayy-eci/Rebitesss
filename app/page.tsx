"use client";

import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  Search,
  Store,
  ShoppingCart,
  Trash2,
  TrendingDown,
  MapPin,
  Clock,
  Clock3,
  Check,
  Sparkles,
  ArrowUpRight,
  CircleDot,
  Heart,
  Globe,
  Pizza,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";
import { SmoothScroll } from "@/app/components/smooth-scroll";
import { Preloader } from "@/app/components/preloader";
import { SiteNav } from "@/app/components/site-nav";
import { SiteFooter } from "@/app/components/site-footer";
import {
  Reveal,
  RevealStagger,
  RevealItem,
  RevealWords,
} from "@/app/components/reveal";
import { Counter } from "@/app/components/counter";
import { Marquee } from "@/app/components/marquee";
import { MagneticButton, ArrowLink } from "@/app/components/magnetic-button";
import { Badge } from "@/app/components/ui/badge";

const HERO_ITEMS = [
  {
    image:
      "https://images.pexels.com/photos/8697516/pexels-photo-8697516.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    label: "Italian Pasta",
    title: "With Special",
    accent: "Sauce",
    priceOld: "$9.90",
    price: "$7.90",
  },
  {
    image:
      "https://images.pexels.com/photos/32938736/pexels-photo-32938736.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    label: "Truffle Pasta",
    title: "Rich Truffle",
    accent: "Cream",
    priceOld: "$11.90",
    price: "$9.40",
  },
  {
    image:
      "https://images.pexels.com/photos/37189123/pexels-photo-37189123.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    label: "Mushroom Risotto",
    title: "Creamy",
    accent: "Forest",
    priceOld: "$10.90",
    price: "$8.40",
  },
  {
    image:
      "https://images.pexels.com/photos/5602477/pexels-photo-5602477.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    label: "Spicy Penne",
    title: "Fiery",
    accent: "Arrabbiata",
    priceOld: "$8.90",
    price: "$6.90",
  },
  {
    image:
      "https://images.pexels.com/photos/8697516/pexels-photo-8697516.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    label: "Carbonara",
    title: "Classic",
    accent: "Roman",
    priceOld: "$12.90",
    price: "$9.90",
  },
];

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

const WHY_FEATURES: {
  icon: LucideIcon;
  heartBadge?: boolean;
  title: string;
}[] = [
  {
    icon: ShoppingBag,
    heartBadge: true,
    title: "Nikmati makanan enak dengan harga ½ atau kurang",
  },
  {
    icon: Globe,
    title: "Bantu lingkungan dengan mengurangi food waste",
  },
  {
    icon: Pizza,
    title: "Selamatkan makanan di dekatmu",
  },
  {
    icon: Store,
    title: "Coba hal baru dari kafe, toko roti, atau restoran lokal",
  },
];

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [notice, setNotice] = useState("");
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  const heroItem = HERO_ITEMS[heroIndex];

  const heroGoTo = (i: number) =>
    setHeroIndex((i + HERO_ITEMS.length) % HERO_ITEMS.length);
  const heroNext = () => heroGoTo(heroIndex + 1);
  const heroPrev = () => heroGoTo(heroIndex - 1);

  useEffect(() => {
    if (heroPaused) return;
    const id = window.setInterval(
      () => setHeroIndex((i) => (i + 1) % HERO_ITEMS.length),
      4000,
    );
    return () => window.clearInterval(id);
  }, [heroPaused]);

  const handleBuy = () => {
    setNotice(`${heroItem.label} ditambahkan ke pesanan.`);
    window.setTimeout(() => setNotice(""), 3000);
  };

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
      <SiteNav />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section id="top" className="relative grid min-h-[760px] overflow-hidden border-t border-[#1b2d2a]/10 bg-[#f3efe8]">
        <div className="absolute inset-0 opacity-80 [background-image:radial-gradient(rgba(18,31,28,0.08)_0.7px,transparent_0.7px)] [background-size:12px_12px]" />

        <div className="relative z-10 grid lg:grid-cols-[1.12fr_1fr]">
          <div className="flex flex-col justify-center pb-8 pl-6 pt-20 md:pl-12 lg:pl-20 xl:pl-28">


            <AnimatePresence mode="wait">
              <motion.p
                key={heroIndex}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35 }}
                className="mt-4 font-[var(--font-display)] text-[clamp(1.2rem,2vw,2rem)] italic font-medium text-[#1b2d2a]/85"
              >
                {heroItem.label}
              </motion.p>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.h1
                key={heroIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="mt-2 max-w-[620px] font-[var(--font-display)] text-[clamp(4.5rem,6vw,9.1rem)] font-extrabold leading-[0.88] tracking-[-0.06em] text-[#12312e]"
              >
                {heroItem.title}
                <span className="mt-1 block text-[#d0af4f]">{heroItem.accent}</span>
              </motion.h1>
            </AnimatePresence>

            <p className="mt-6 max-w-[420px] text-[1.05rem] leading-[1.7] tracking-[-0.01em] text-[#1b2d2a]/70">
              Italian pasta with special sauce is a
              <br className="hidden lg:block" /> Price you can find only in <b className="font-bold text-[#12312e]">ReBites.</b>
            </p>

            <div className="mt-7 flex items-center gap-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={heroIndex}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="flex items-end gap-3 font-[var(--font-display)] text-[#12312e]"
                >
                  <del className="mb-1 text-[1.1rem] font-semibold text-[#12312e]/40">{heroItem.priceOld}</del>
                  <strong className="text-[clamp(2.4rem,2vw,3.5rem)] font-extrabold tracking-[-0.05em]">{heroItem.price}</strong>
                </motion.div>
              </AnimatePresence>

              <button
                type="button"
                onClick={handleBuy}
                className="inline-flex items-center gap-3 rounded-full bg-[#0d2d2b] px-5 py-3.5 text-[1.15rem] font-semibold text-[#f5f0e7] shadow-[0_10px_18px_rgba(10,36,30,0.18)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white/10">
                  <ShoppingBag size={17} />
                </span>
                Buy Now
              </button>
            </div>
          </div>

          <div
            className="relative flex min-h-[760px] items-start justify-center pt-6 pr-0"
            onMouseEnter={() => setHeroPaused(true)}
            onMouseLeave={() => setHeroPaused(false)}
          >
            <div className="absolute -right-28 top-0 h-[110%] w-[110%] bg-[linear-gradient(130deg,#0c2f2f_0%,#183f3a_42%,#102f2d_100%)] [clip-path:polygon(28%_0,_100%_0,_100%_100%,_0_100%)] shadow-[inset_-30px_20px_40px_rgba(0,0,0,0.12)]" />
            <div className="absolute right-[120px] top-[60px] h-[220px] w-[220px] rotate-[-12deg] rounded-full border border-[#d4af4d]/70" />
            <div className="absolute bottom-14 left-[10%] h-[82px] w-[520px] translate-x-[30px] rounded-full bg-[#12312e]/20 blur-[20px]" />

            <div className="relative z-10 mt-6 mr-4 aspect-square w-[min(460px,58%)] translate-x-2 translate-y-36 overflow-hidden rounded-full border-[12px] border-[#d9b55d] bg-[#f2e8d8] shadow-[0_0_0_18px_rgba(217,181,93,0.16)]">
              <AnimatePresence>
                <motion.img
                  key={heroIndex}
                  src={heroItem.image}
                  alt={heroItem.label}
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>

              <button
                type="button"
                onClick={heroPrev}
                aria-label="Makanan sebelumnya"
                className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#d9b55d]/60 bg-[#0d2d2b]/70 text-[#f5f0e7] backdrop-blur-sm transition-colors hover:bg-[#0d2d2b]"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                type="button"
                onClick={heroNext}
                aria-label="Makanan berikutnya"
                className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#d9b55d]/60 bg-[#0d2d2b]/70 text-[#f5f0e7] backdrop-blur-sm transition-colors hover:bg-[#0d2d2b]"
              >
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="absolute bottom-16 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
              {HERO_ITEMS.map((item, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Slide ${i + 1} dari ${HERO_ITEMS.length}`}
                  aria-current={i === heroIndex}
                  onClick={() => heroGoTo(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === heroIndex
                      ? "w-8 bg-[#d9b55d]"
                      : "w-2.5 bg-white/35 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </div>

        </div>
      </section>

      {notice && (
        <div className="toast" role="status">
          {notice}
        </div>
      )}

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

      {/* ── KENAPA REBITES ───────────────────────────────── */}
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
                04 - Kenapa ReBites
              </Badge>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display text-[clamp(2.2rem,5vw,4rem)] font-light leading-[1.02] tracking-[-0.02em] text-primary">
                Kenapa <span className="italic font-extralight">ReBites?</span>
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mx-auto mt-5 max-w-md font-sans text-sm leading-relaxed text-muted-foreground">
                Satu platform untuk makan enak, menyelamatkan surplus, dan
                membantu lingkungan - sekaligus.
              </p>
            </Reveal>
          </div>

          {/* fitur mengelilingi tas belanja */}
          <div className="mt-16 grid items-center gap-14 lg:mt-24 lg:grid-cols-[1fr_auto_1fr] lg:gap-10 xl:gap-16">
            {/* tas belanja sentral */}
            <Reveal className="order-first mx-auto w-full max-w-[320px] sm:max-w-[380px] lg:order-none lg:max-w-[420px]">
              <GroceryBag />
            </Reveal>

            {/* kolom kiri */}
            <div className="flex flex-col items-center gap-12 text-center sm:grid sm:grid-cols-2 sm:items-start sm:justify-items-center sm:gap-10 lg:flex lg:items-start lg:gap-16 lg:text-left">
              {WHY_FEATURES.slice(0, 2).map((f, i) => (
                <WhyFeature
                  key={i}
                  icon={f.icon}
                  heartBadge={f.heartBadge}
                  title={f.title}
                  delay={0.1 + i * 0.08}
                />
              ))}
            </div>

            {/* kolom kanan */}
            <div className="flex flex-col items-center gap-12 text-center sm:grid sm:grid-cols-2 sm:items-start sm:justify-items-center sm:gap-10 lg:flex lg:items-end lg:gap-16 lg:text-right">
              {WHY_FEATURES.slice(2, 4).map((f, i) => (
                <WhyFeature
                  key={i}
                  icon={f.icon}
                  heartBadge={f.heartBadge}
                  title={f.title}
                  delay={0.1 + i * 0.08}
                />
              ))}
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

      {/* ── CTA PENUTUP ──────────────────────────────────── */}
      <section
        id="cta"
        className="relative overflow-hidden bg-primary py-28 text-primary-foreground lg:py-40"
      >
        <div className="grain-overlay absolute inset-0" />
        {/* animated blobs */}
        <motion.div
          className="absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-primary-foreground/5 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -right-20 bottom-1/4 h-80 w-80 rounded-full bg-primary-foreground/5 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <div className="relative mx-auto max-w-[1400px] px-5 text-center sm:px-8 lg:px-12">
          <Reveal>
            <p className="font-sans text-[11px] uppercase tracking-[0.35em] text-primary-foreground/50">
              Bergabung sekarang
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mx-auto mt-6 max-w-4xl font-display text-[clamp(2.4rem,6vw,5rem)] font-light leading-[0.98] tracking-[-0.03em]">
              Setiap makanan punya cerita.
              <br />
              <span className="italic font-extralight">
                Bantu agar tidak usai di tempat sampah.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <MagneticButton href="/register" variant="cream">
                Daftar gratis sekarang
                <ArrowUpRight className="h-4 w-4" />
              </MagneticButton>
              <Link
                href="/login"
                className="font-sans text-sm text-primary-foreground/70 underline-offset-4 transition-colors hover:text-primary-foreground hover:underline"
              >
                Sudah punya akun? Masuk
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </SmoothScroll>
  );
}

function WhyFeature({
  icon: Icon,
  heartBadge = false,
  title,
  delay = 0,
}: {
  icon: LucideIcon;
  heartBadge?: boolean;
  title: string;
  delay?: number;
}) {
  return (
    <Reveal delay={delay}>
      <div className="group max-w-[280px]">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-primary/20 bg-background text-primary shadow-[0_10px_28px_-14px_hsl(var(--primary)/0.45)] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/40 group-hover:bg-primary group-hover:text-primary-foreground-strong">
          <span className="relative">
            <Icon className="h-7 w-7" strokeWidth={1.5} />
            {heartBadge && (
              <Heart className="absolute -bottom-2 -right-2.5 h-3.5 w-3.5 fill-primary stroke-background transition-colors duration-300 group-hover:fill-primary-foreground-strong group-hover:stroke-primary" />
            )}
          </span>
        </div>
        <h3 className="mt-4 font-sans text-sm font-bold uppercase leading-snug tracking-[0.06em] text-primary">
          {title}
        </h3>
      </div>
    </Reveal>
  );
}

function GroceryBag() {
  return (
    <motion.div
      className="relative w-full"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden
    >
      <svg
        viewBox="0 0 360 430"
        className="h-auto w-full drop-shadow-[0_24px_40px_-20px_hsl(var(--primary)/0.35)]"
      >
        {/* sayuran di belakang tas */}
        {/* daun bawang */}
        <g
          stroke="#2f5d43"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        >
          <path d="M112 205 C110 155 106 115 100 88" />
          <path d="M128 205 C127 155 124 115 120 82" />
          <path d="M144 205 C144 157 142 117 140 90" />
        </g>
        {/* brokoli */}
        <rect x="157" y="150" width="11" height="55" rx="5" fill="#3e7d57" />
        <g fill="#2c5e42">
          <circle cx="152" cy="146" r="13" />
          <circle cx="173" cy="142" r="14" />
          <circle cx="162" cy="130" r="14" />
          <circle cx="182" cy="148" r="12" />
        </g>
        <g fill="#4c8f66">
          <circle cx="160" cy="137" r="5" />
          <circle cx="174" cy="149" r="5" />
        </g>
        {/* wortel */}
        <path d="M205 205 L188 100 L222 100 Z" fill="#e2793b" />
        <g stroke="#3e7d57" strokeWidth="3" strokeLinecap="round">
          <path d="M191 100 L183 80" />
          <path d="M205 100 L205 76" />
          <path d="M219 100 L227 80" />
        </g>
        {/* paprika merah */}
        <path
          d="M250 205 C246 168 254 140 275 129 C296 140 304 168 300 205 Z"
          fill="#cf5340"
        />
        <path
          d="M273 131 L273 116"
          stroke="#2f5d43"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* bawang merah */}
        <circle cx="316" cy="158" r="33" fill="#b06b8f" />
        <path
          d="M316 129 A 26 26 0 0 0 313 186"
          stroke="#8a4f6d"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M316 192 L316 205"
          stroke="#8a4f6d"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* bayangan */}
        <ellipse
          cx="190"
          cy="404"
          rx="95"
          ry="8"
          fill="hsl(135 21% 26%)"
          opacity="0.12"
        />

        {/* badan tas */}
        <path
          d="M70 195
             L90 181 L110 195 L130 181 L150 195 L170 181 L190 195 L210 181 L230 195 L250 181 L270 195 L290 181 L310 195
             L310 352
             Q310 400 262 400
             L118 400
             Q70 400 70 352
             Z"
          className="fill-primary"
        />

        {/* kerutan tas */}
        <g
          className="stroke-primary-foreground"
          strokeOpacity="0.12"
          strokeWidth="1.5"
          fill="none"
        >
          <path d="M95 210 C92 280 96 340 100 382" />
          <path d="M132 205 C127 272 134 334 142 384" />
          <path d="M185 200 C185 262 182 324 187 386" />
          <path d="M245 205 C243 280 248 340 254 384" />
          <path d="M290 212 C292 268 288 330 292 378" />
        </g>
        {/* lipatan samping */}
        <g
          className="stroke-primary-foreground"
          strokeOpacity="0.1"
          strokeWidth="1.5"
          fill="none"
        >
          <path d="M108 202 C104 260 110 320 112 392" />
          <path d="M252 202 C256 260 250 320 248 392" />
        </g>

        {/* emblem */}
        <circle
          cx="190"
          cy="282"
          r="54"
          fill="hsl(40 30% 96%)"
          fillOpacity="0.06"
          stroke="hsl(40 30% 96%)"
          strokeOpacity="0.85"
          strokeWidth="2.5"
        />
        {/* daun */}
        <g
          stroke="hsl(40 30% 96%)"
          strokeOpacity="0.9"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <path d="M190 240 C210 250 216 268 190 290 C164 268 170 250 190 240 Z" />
          <path d="M190 244 C190 262 190 272 190 286" />
        </g>
        {/* teks melengkung */}
        <defs>
          <path id="rebites-arc" d="M150 306 A50 50 0 0 0 230 306" />
        </defs>
        <text
          fontSize="14"
          fontWeight="600"
          letterSpacing="3"
          fill="hsl(40 30% 96%)"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          <textPath href="#rebites-arc" startOffset="50%" textAnchor="middle">
            REBITES
          </textPath>
        </text>
      </svg>
    </motion.div>
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
