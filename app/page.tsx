"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Search,
  Store,
  ShoppingCart,
  Trash2,
  TrendingDown,
  MapPin,
  Clock,
  Check,
  Sparkles,
  ArrowUpRight,
  CircleDot,
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

const HERO_IMG =
  "https://images.pexels.com/photos/32938736/pexels-photo-32938736.jpeg?auto=compress&cs=tinysrgb&h=900&w=600";
const HERO_IMG_2 =
  "https://images.pexels.com/photos/37189123/pexels-photo-37189123.jpeg?auto=compress&cs=tinysrgb&h=900&w=600";

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

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  useEffect(() => {
    if (loaded) document.body.style.overflow = "";
  }, [loaded]);

  return (
    <SmoothScroll>
      <Preloader onDone={() => setLoaded(true)} />
      <SiteNav />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="grain-overlay relative flex min-h-[100svh] items-center overflow-hidden bg-secondary pt-28 pb-16 lg:pt-32">
        {/* centered headline */}
        <div className="mx-auto w-full max-w-[1100px] px-5 text-center sm:px-8 lg:px-12">
          <motion.div style={{ y: heroY, opacity: heroOpacity }}>
            <RevealStagger stagger={0.06}>
              <RevealItem>
                <Badge variant="outline" className="mb-7">
                  <CircleDot className="h-2.5 w-2.5" />
                  Marketplace makanan surplus Indonesia
                </Badge>
              </RevealItem>
              <h1 className="mx-auto max-w-5xl pb-[0.12em] font-display text-[clamp(2.8rem,8vw,7.5rem)] font-light leading-[1.11] tracking-[-0.03em] text-primary">
                <RevealWords text="Selamatkan" />
                <br />
                <RevealWords text="makanan" delay={0.1} />{" "}
                <span className="italic font-extralight">
                  <RevealWords text="sebelum" delay={0.2} />
                </span>
                <br />
                <RevealWords text="terbuang." delay={0.3} />
              </h1>
              <RevealItem>
                <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                  <MagneticButton href="/register" variant="default" className="text-white">
                    Daftar ReBites
                    <ArrowRight className="h-4 w-4" />
                  </MagneticButton>
                  <MagneticButton href="/#pembeli" variant="cream">
                    Cari Makanan
                    <Search className="h-4 w-4" />
                  </MagneticButton>
                </div>
              </RevealItem>
            </RevealStagger>
          </motion.div>
        </div>

        {/* scroll cue */}
        <motion.div
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={{ delay: 1.2 }}
        >
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Gulir
          </span>
          <motion.div
            className="h-10 w-px bg-primary/40"
            animate={{ scaleY: [0.3, 1, 0.3] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            style={{ originY: 0 }}
          />
        </motion.div>
      </section>

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
                  01 — Masalah
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
                  Indonesia mencapai angka yang sulit diabaikan — berdampak pada
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
              &ldquo;Makanan yang terbuang bukan hanya uang yang hilang — tapi
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
                  02 — Cara Kerja
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
            {/* step 1 — large */}
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

            {/* step 4 — accent */}
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
                  03 — Untuk UMKM
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

      {/* ── UNTUK PEMBELI ────────────────────────────────── */}
      <section
        id="pembeli"
        className="grain-overlay relative overflow-hidden bg-background py-24 lg:py-32"
      >
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
            {/* visual-first column */}
            <Reveal>
              <div className="relative">
                <div className="relative aspect-[5/4] overflow-hidden rounded-[var(--radius)]">
                  <Image
                    src="https://images.pexels.com/photos/7543099/pexels-photo-7543099.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                    alt="Roti surplus"
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
                </div>
                {/* floating product card mockup */}
                <motion.div
                  className="absolute -bottom-8 -right-4 w-60 rounded-[var(--radius)] border border-border bg-background p-4 shadow-[0_24px_60px_-20px_hsl(var(--primary)/0.4)] sm:-right-8"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-[var(--radius)]">
                      <Image
                        src="https://images.pexels.com/photos/11570705/pexels-photo-11570705.jpeg?auto=compress&cs=tinysrgb&h=120&w=120"
                        alt="Roti"
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-sans text-[13px] font-medium text-primary">
                        Roti Surplus Subuh
                      </p>
                      <p className="font-sans text-[11px] text-muted-foreground">
                        Roti &amp; Bakeri
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-end justify-between">
                    <div>
                      <span className="font-sans text-[10px] text-muted-foreground line-through">
                        Rp25.000
                      </span>
                      <p className="font-display text-lg font-medium text-primary">
                        Rp8.000
                      </p>
                    </div>
                    <Badge variant="success">Hemat 68%</Badge>
                  </div>
                </motion.div>
              </div>
            </Reveal>

            <div className="lg:pt-8">
              <Reveal>
                <Badge variant="outline" className="mb-5">
                  04 — Untuk Pembeli
                </Badge>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] font-light leading-[1.02] tracking-[-0.02em] text-primary">
                  Makan enak, hemat, berdampak.
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-6 max-w-md font-sans text-sm leading-relaxed text-foreground/70">
                  Telusuri makanan surplus dari UMKM terdekat, pesan dalam
                  hitungan menit, dan ambil atau terima pengantaran.
                </p>
              </Reveal>

              <RevealStagger
                className="mt-10 space-y-px bg-border"
                stagger={0.08}
              >
                {[
                  ["Cari & filter", "Kategori, lokasi, dan harga"],
                  ["Detail produk", "Foto, deskripsi, stok, opsi pengambilan"],
                  ["Checkout Midtrans", "Pembayaran aman dalam Rupiah"],
                  ["Catatan pesanan", "Tambah instruksi khusus untuk UMKM"],
                  [
                    "Riwayat transaksi",
                    "Pantau setiap makanan yang terselamatkan",
                  ],
                ].map(([title, desc], i) => (
                  <RevealItem key={i}>
                    <div className="flex items-center gap-5 bg-background px-5 py-4 transition-colors duration-300 hover:bg-secondary">
                      <span className="font-display text-2xl font-light text-primary/30">
                        {(i + 1).toString().padStart(2, "0")}
                      </span>
                      <div>
                        <p className="font-sans text-sm font-medium text-primary">
                          {title}
                        </p>
                        <p className="font-sans text-xs text-muted-foreground">
                          {desc}
                        </p>
                      </div>
                    </div>
                  </RevealItem>
                ))}
              </RevealStagger>

              <Reveal delay={0.1}>
                <div className="mt-8">
                  <MagneticButton href="/register" variant="cream">
                    Mulai berbelanja
                    <ArrowRight className="h-4 w-4" />
                  </MagneticButton>
                </div>
              </Reveal>
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
                  05 — Paket Langganan
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
