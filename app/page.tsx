"use client";

import { useEffect, useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Store,
  Scale,
  Wallet,
  Users,
  Star,
  Quote,
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/app/components/ui/carousel";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";

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

const PLANS = [
  {
    name: "Trial",
    tagline: "Mulai jualan di ReBites tanpa biaya",
    monthly: 0,
    yearly: 0,
    features: [
      "Gratis tanpa biaya langganan",
      "Maksimal 5 produk",
      "Kelola stok & harga",
      "Riwayat penjualan 30 hari",
      "Dasbor UMKM",
    ],
    capacity: 5,
    popular: false,
    cta: "Mulai Gratis",
  },
  {
    name: "Standar",
    tagline: "Bikin jualan makin laris dan dikenal",
    monthly: 49000,
    yearly: 490000,
    features: [
      "Maksimal 25 produk",
      "Riwayat penjualan tanpa batas",
      "Prioritas tampil di marketplace",
      "Laporan penjualan lanjutan",
      "Lencana UMKM Terverifikasi",
    ],
    capacity: 25,
    popular: true,
    cta: "Naik Kelas",
  },
  {
    name: "Premium",
    tagline: "Maksimalkan penjualan dengan fitur terlengkap",
    monthly: 99000,
    yearly: 990000,
    features: [
      "Produk tanpa batas",
      "Semua fitur Standar",
      "Promosi posisi unggulan",
      "Analitik tren permintaan",
      "Dukungan prioritas",
    ],
    capacity: Infinity,
    popular: false,
    cta: "Maksimalkan Jualan",
  },
];

type Testimonial = {
  name: string;
  role: string;
  quote: string;
  rating: number;
  initials: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Rina Astuti",
    role: "Pemilik Dapur Ibu Sri",
    quote:
      "Awalnya cuma iseng daftar paket Trial, eh malah kebantu banget. Stok yang biasanya sisa di akhir hari sekarang ludes, laporan penjualannya juga gampang dibaca.",
    rating: 5,
    initials: "RA",
  },
  {
    name: "Budi Santoso",
    role: "Pembeli setia",
    quote:
      "Tiap jam istirahat pasti cek ReBites dulu. Makan siang jadi lebih hemat, tapi rasa dan kebersihannya nggak kalah dari yang dijual normal.",
    rating: 5,
    initials: "BS",
  },
  {
    name: "Dewi Lestari",
    role: "Kue Mbok Darmi",
    quote:
      "Setelah naik ke paket Standar, kue saya makin sering ketampil di marketplace. Nama Mbok Darmi sekarang dikenal sampai luar kelurahan!",
    rating: 5,
    initials: "DL",
  },
  {
    name: "Ahmad Fauzi",
    role: "Pelanggan rutin",
    quote:
      "Pas hujan, pesan Soto Mie Bogor tinggal diantar. Harganya ringan, porsinya banyak, rasanya juara. Sudah langganan tiga bulan ini.",
    rating: 5,
    initials: "AF",
  },
  {
    name: "Sri Wahyuni",
    role: "Warung Mang Teten",
    quote:
      "Sebelumnya banyak makanan terbuang sia-sia. Sekarang hampir nggak ada yang bersisa, jadi warung lebih untung dan nggak bikin sampah makanan.",
    rating: 5,
    initials: "SW",
  },
  {
    name: "Rizky Pratama",
    role: "Mahasiswa",
    quote:
      "Anak kos kayak saya jadi bisa makan enak tiap hari tanpa bongkar dompet. Banyak promo yang bikin nagih, pokoknya ReBites mantap!",
    rating: 5,
    initials: "RP",
  },
];

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [foodIndex, setFoodIndex] = useState(0);
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [testimonialApi, setTestimonialApi] = useState<CarouselApi>();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
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

  useEffect(() => {
    if (!testimonialApi) return;

    const onSelect = () =>
      setActiveTestimonial(testimonialApi.selectedScrollSnap());

    onSelect();
    testimonialApi.on("select", onSelect);
    testimonialApi.on("reInit", onSelect);

    return () => {
      testimonialApi.off("select", onSelect);
      testimonialApi.off("reInit", onSelect);
    };
  }, [testimonialApi]);

  return (
    <SmoothScroll>
      <Preloader onDone={() => setLoaded(true)} />

      {/* ── HERO / BERANDA ─────────────────────────────────── */}
      <div id="top">
        <HeroSection />
      </div>

      {/* ── INFO: FOOD WASTE ───────────────────────────────── */}
      <section
        id="info"
        data-nav="green"
        className="grain-overlay relative overflow-hidden bg-primary py-28 lg:py-40"
      >
        {/* Watermark outline angka */}
        <span
          aria-hidden
          className="pointer-events-none absolute -top-8 right-0 select-none font-display text-[clamp(10rem,24vw,22rem)] font-extralight leading-none text-transparent"
          style={{
            WebkitTextStroke: "1px hsl(var(--primary-foreground) / 0.14)",
          }}
        >
          48
        </span>

        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
            {/* Kiri: judul + ticker live */}
            <div>
              <Reveal delay={0.05}>
                <p className="flex items-center gap-3 font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-primary-foreground/60">
                  Fakta food loss &amp; food waste
                  <span className="h-px w-8 bg-primary-foreground/30" />
                </p>
              </Reveal>

              <Reveal delay={0.1}>
                <h2 className="mt-6 font-display text-[clamp(2rem,4vw,3.5rem)] font-light leading-[1.02] tracking-[-0.02em] text-primary-foreground">
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
                <div className="mt-8 rounded-[var(--radius)] border border-primary-foreground/15 bg-primary-foreground/[0.08] p-6">
                  <p className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-primary-foreground/60">
                    Food loss &amp; waste Indonesia per tahun
                  </p>

                  <p className="mt-3 flex items-baseline gap-1.5 font-display text-[clamp(2.1rem,4vw,3.2rem)] font-light leading-none tracking-tight text-primary-foreground">
                    <Counter
                      to={46_350_000}
                      className="tabular-nums"
                      duration={10}
                    />
                    <span className="font-sans text-sm text-primary-foreground/70">
                      ton
                    </span>
                  </p>

                  <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1 border-t border-dashed border-primary-foreground/20 pt-4 font-sans text-xs text-primary-foreground/70">
                    <span>≈ 91 ton / menit</span>
                    <span>≈ 1,5 ton / detik</span>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Kanan: statistik */}
            <div className="grid gap-4">
              <Reveal delay={0.1}>
                <div className="flex flex-col items-center gap-8 rounded-[var(--radius)] border border-primary-foreground/15 bg-primary-foreground/[0.08] p-8 sm:flex-row sm:items-center lg:p-10">
                  <WasteRing progress={0.82}>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <p className="font-display text-[clamp(2.6rem,4vw,3.6rem)] font-light leading-none tracking-tight text-center text-primary-foreground">
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
                    <h3 className="font-display text-2xl font-medium text-primary-foreground">
                      Emisi gas rumah kaca
                    </h3>

                    <p className="mt-3 font-sans text-sm leading-relaxed text-primary-foreground/70">
                      Sisa pangan yang terbuang ikut menyumbang emisi gas rumah
                      kaca yang mempercepat perubahan iklim.
                    </p>

                    <p className="mt-4 font-sans text-xs text-primary-foreground/60">
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


      {/* ── REKOMENDASI MAKANAN ────────────────────────────── */}
      <section
        id="rekomendasi"
        data-nav="green"
        className="grain-overlay relative overflow-hidden bg-primary py-24 lg:py-32"
      >
        {/* Soft radial glow */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-primary-foreground/[0.06] blur-3xl" />

        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="mx-auto max-w-3xl text-center">
            <Reveal delay={0.1}>
              <h2 className="font-display text-[clamp(2.2rem,5vw,4rem)] font-light leading-[1.02] tracking-[-0.02em] text-primary-foreground">
                Rekomendasi{" "}
                <span className="italic font-extralight">Makanan</span>
              </h2>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="mx-auto mt-5 max-w-md font-sans text-sm leading-relaxed text-primary-foreground/70">
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
                    <Badge
                      variant="outline"
                      className="mb-5 border-primary-foreground/30 text-primary-foreground"
                    >
                      {food.original
                        ? `Hemat ${Math.round((1 - food.price / food.original) * 100)}%`
                        : food.tag}
                    </Badge>
                  )}

                  <h3 className="font-display text-[clamp(2.2rem,3.5vw,3.4rem)] font-medium leading-[1.05] tracking-[-0.02em] text-primary-foreground">
                    {food.name}
                  </h3>

                  <p className="mx-auto mt-5 max-w-[46ch] font-sans text-sm leading-relaxed text-primary-foreground/70 lg:mx-0">
                    {food.desc}
                  </p>

                  <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 lg:justify-start">
                    <span className="font-display text-4xl font-light tracking-tight text-primary-foreground lg:text-5xl">
                      Rp{food.price.toLocaleString("id-ID")}
                    </span>

                    {food.original && (
                      <span className="font-sans text-sm text-primary-foreground/50 line-through">
                        Rp{food.original.toLocaleString("id-ID")}
                      </span>
                    )}
                  </div>

                  <div className="mt-8 flex flex-wrap items-center justify-center gap-5 lg:justify-start">
                    <Link
                      href="/#cta"
                      className="group inline-flex items-center gap-2 rounded-full border border-hairline bg-white px-6 py-3 font-inter text-sm font-semibold text-forest-dark shadow-[0_14px_30px_-20px_rgba(34,81,56,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:border-caramel/50 hover:text-caramel"
                    >
                      Pesan Sekarang
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>

                    <p className="font-sans text-xs tabular-nums text-primary-foreground/50">
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
                  className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-primary to-transparent sm:h-24"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-primary to-transparent sm:h-24"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LANGGANAN / PAKET ──────────────────────────────── */}
      <section
        id="langganan"
        data-nav="cream"
        className="grain-overlay relative overflow-hidden bg-cream py-24 lg:py-32"
      >
        {/* Soft radial glow */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-3xl" />

        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal delay={0.05}>
              <p className="flex items-center justify-center gap-3 font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                Paket langganan
                <span className="h-px w-8 bg-primary/30" />
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="mt-6 font-display text-[clamp(2rem,4.5vw,3.5rem)] font-light leading-[1.02] tracking-[-0.02em] text-primary">
                Pilih paket yang{" "}
                <span className="italic font-extralight">tumbuh</span> bersama
                usaha Anda.
              </h2>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="mx-auto mt-5 max-w-md font-sans text-sm leading-relaxed text-muted-foreground">
                Semua paket bisa dicoba gratis 1 bulan penuh. Upgrade atau
                berhenti kapan saja.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-8 flex justify-center">
                <div className="relative inline-flex items-center rounded-full border border-border bg-white p-1">
                  {[
                    { key: "monthly", label: "Bulanan" },
                    { key: "yearly", label: "Tahunan" },
                  ].map((mode) => {
                    const active = billing === mode.key;
                    return (
                      <button
                        key={mode.key}
                        type="button"
                        onClick={() =>
                          setBilling(mode.key as "monthly" | "yearly")
                        }
                        className={`relative z-10 flex items-center gap-2 rounded-full px-5 py-2 font-sans text-xs font-medium tracking-tight transition-colors duration-300 ${
                          active
                            ? "text-primary-foreground"
                            : "text-muted-foreground hover:text-caramel"
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="billing-pill"
                            className="absolute inset-0 rounded-full bg-caramel"
                            transition={{
                              type: "spring",
                              stiffness: 320,
                              damping: 28,
                            }}
                          />
                        )}
                        <span className="relative z-10">{mode.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-5 lg:mt-16 lg:grid-cols-3">
            {PLANS.map((plan, i) => {
              const yearlyMode = billing === "yearly";
              const priceLabel =
                plan.monthly === 0
                  ? "Gratis"
                  : `Rp${(yearlyMode
                      ? plan.yearly
                      : plan.monthly
                    ).toLocaleString("id-ID")}`;
              const priceSuffix =
                plan.monthly === 0 ? "" : yearlyMode ? "/tahun" : "/bulan";
              const subLine =
                plan.monthly === 0
                  ? "tanpa biaya, selamanya"
                  : yearlyMode
                    ? `Hemat 2 bulan · setara Rp${Math.round(
                        plan.yearly / 12,
                      ).toLocaleString("id-ID")} / bulan`
                    : `atau Rp${plan.yearly.toLocaleString("id-ID")} / tahun`;
              const capacityPct =
                plan.capacity === Infinity
                  ? 100
                  : Math.max(12, (plan.capacity / 25) * 100);

              return (
                <Reveal key={plan.name} delay={i * 0.1} className="h-full">
                  <div
                      className={`relative flex h-full flex-col overflow-hidden rounded-[var(--radius)] bg-background p-8 transition-all duration-300 lg:p-9 border border-border shadow-[0_10px_30px_-24px_rgba(34,81,56,0.3)] hover:-translate-y-1 hover:border-caramel/40`}
                  >
                    <div className="relative flex items-center justify-between">
                      <span className="font-display text-sm italic tracking-[0.2em] text-caramel/50">
                        0{i + 1}
                      </span>

                      {!plan.popular && (
                        <span className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/70">
                          {plan.name === "Starter"
                            ? "Untuk pemula"
                            : "Skala penuh"}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-4 font-display text-2xl font-light tracking-tight text-primary">
                      {plan.name}
                    </h3>

                    <p className="mt-1 font-sans text-xs italic text-muted-foreground">
                      {plan.tagline}
                    </p>

                    <div className="mt-6 flex items-baseline gap-1.5 text-primary">
                      <div className="relative h-[3rem] overflow-hidden">
                        <AnimatePresence mode="wait" initial={false}>
                          <motion.span
                            key={priceLabel}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{
                              duration: 0.3,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="block font-display text-[clamp(2.4rem,3vw,3rem)] font-light leading-[3rem] tracking-tight tabular-nums"
                          >
                            {priceLabel}
                          </motion.span>
                        </AnimatePresence>
                      </div>

                      {priceSuffix && (
                        <span className="font-sans text-sm text-muted-foreground">
                          {priceSuffix}
                        </span>
                      )}
                    </div>

                    <p className="mt-1 font-sans text-xs text-muted-foreground">
                      {subLine}
                    </p>

                    <div className="mt-6">
                      <div className="flex items-center justify-between font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        <span>Kapasitas produk</span>
                        <span>
                          {plan.capacity === Infinity
                            ? "Tak terbatas"
                            : `${plan.capacity} produk`}
                        </span>
                      </div>
                      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-caramel/10">
                        <motion.div
                          className="h-full rounded-full bg-caramel"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${capacityPct}%` }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 1.1,
                            delay: 0.3 + i * 0.15,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        />
                      </div>
                    </div>

                    <div className="relative mt-7 pt-7 text-foreground/75">
                      <span
                        aria-hidden
                        className="absolute inset-x-0 top-0 h-px"
                        style={{
                          background:
                            "repeating-linear-gradient(90deg, currentColor 0 5px, transparent 5px 10px)",
                          opacity: 0.35,
                        }}
                      />
                      <span
                        aria-hidden
                        className="absolute left-1/2 top-0 h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-caramel/50"
                      />

                      <ul className="space-y-3">
                        {plan.features.map((f, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-3 font-sans text-sm"
                          >
                            <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border border-caramel/30 text-caramel">
                              <svg
                                viewBox="0 0 10 10"
                                className="h-2 w-2"
                                aria-hidden
                              >
                                <path
                                  d="M2 5.2l2 2 3.8-4"
                                  stroke="currentColor"
                                  strokeWidth="1.6"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="relative mt-8">
                      <MagneticButton
                        href="/register"
                        variant={plan.popular ? "white" : "outline"}
                        className="w-full"
                      >
                        {plan.cta}
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </MagneticButton>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONI ───────────────────────────────────────── */}
      <section
        id="testimoni"
        data-nav="green"
        className="grain-overlay relative overflow-hidden bg-primary py-24 lg:py-32"
      >
        {/* Soft radial glow */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-primary-foreground/[0.06] blur-3xl" />

        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          {/* Header */}
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left">
              <Reveal delay={0.05}>
                <p className="flex items-center justify-center gap-3 font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-primary-foreground/60 lg:justify-start">
                  Testimoni
                  <span className="h-px w-8 bg-primary-foreground/30" />
                </p>
              </Reveal>

              <Reveal delay={0.1}>
                <h2 className="mt-6 font-display text-[clamp(2rem,4.5vw,3.5rem)] font-light leading-[1.02] tracking-[-0.02em] text-primary-foreground">
                  <RevealWords text="Apa kata mereka yang sudah" />{" "}
                  <span className="italic">
                    <RevealWords text="berhemat" />
                  </span>{" "}
                  <RevealWords text="di ReBites." />
                </h2>
              </Reveal>

              <Reveal delay={0.15}>
                <p className="mx-auto mt-5 max-w-md font-sans text-sm leading-relaxed text-primary-foreground/70 lg:mx-0">
                  Cerita nyata dari UMKM dan pembeli yang sudah merasakan
                  manfaat menyelamatkan makanan bersama ReBites.
                </p>
              </Reveal>
            </div>
          </div>

          {/* Slider kartu */}
          <Reveal delay={0.1}>
            <div className="relative mt-12 lg:mt-16">
              <button
                type="button"
                onClick={() => testimonialApi?.scrollPrev()}
                aria-label="Testimoni sebelumnya"
                className="absolute -left-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-primary shadow-[0_10px_30px_-24px_rgba(34,81,56,0.3)] transition-all duration-300 hover:-translate-y-1/2 hover:border-caramel hover:bg-caramel hover:text-white sm:flex"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => testimonialApi?.scrollNext()}
                aria-label="Testimoni berikutnya"
                className="absolute -right-4 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-primary shadow-[0_10px_30px_-24px_rgba(34,81,56,0.3)] transition-all duration-300 hover:-translate-y-1/2 hover:border-caramel hover:bg-caramel hover:text-white sm:flex"
              >
                <ArrowRight className="h-4 w-4" />
              </button>

              <Carousel
                opts={{ align: "start", loop: true }}
                setApi={setTestimonialApi}
              >
                <CarouselContent className="-ml-4 lg:-ml-5">
                {TESTIMONIALS.map((t, i) => (
                  <CarouselItem
                    key={t.name}
                    className="basis-full pl-4 sm:basis-1/2 sm:pl-4 lg:basis-1/3 lg:pl-5"
                  >
                    <div className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius)] border border-border bg-white p-8 shadow-[0_10px_30px_-24px_rgba(34,81,56,0.3)] transition-all duration-300 hover:-translate-y-1 hover:border-caramel/40 hover:shadow-[0_30px_60px_-28px_rgba(34,81,56,0.35)] lg:p-9">
                      {/* Watermark tanda kutip */}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute -top-3 right-4 select-none font-display text-[6rem] font-extralight leading-none text-caramel/[0.08] transition-colors duration-300 group-hover:text-caramel/15"
                      >
                        &ldquo;
                      </span>

                      {/* Rating */}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: t.rating }).map((_, s) => (
                          <Star
                            key={s}
                            className="h-4 w-4 fill-amber text-amber"
                          />
                        ))}
                      </div>

                      {/* Kutipan */}
                      <Quote className="mt-5 h-5 w-5 text-caramel/40" />
                      <blockquote className="mt-3 flex-1 font-sans text-sm leading-relaxed text-foreground/80">
                        &ldquo;{t.quote}&rdquo;
                      </blockquote>

                      {/* Penulis */}
                      <div className="relative mt-7 flex items-center gap-3 pt-6">
                        <span
                          aria-hidden
                          className="absolute inset-x-0 top-0 h-px"
                          style={{
                            background:
                              "repeating-linear-gradient(90deg, currentColor 0 5px, transparent 5px 10px)",
                            opacity: 0.35,
                          }}
                        />
                        <Avatar className="h-11 w-11 border border-caramel/30">
                          <AvatarFallback className="bg-caramel font-display text-sm font-medium text-white">
                            {t.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-display text-base font-medium text-primary">
                            {t.name}
                          </p>
                          <p className="mt-0.5 font-sans text-xs text-muted-foreground">
                            {t.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            </div>
          </Reveal>

          {/* Dots */}
          <Reveal delay={0.15}>
            <div className="mt-9 flex justify-center gap-2">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  aria-label={`Ke testimoni ${i + 1}`}
                  onClick={() => testimonialApi?.scrollTo(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeTestimonial === i
                      ? "w-8 bg-primary-foreground"
                      : "w-1.5 bg-primary-foreground/25 hover:bg-primary-foreground/50"
                  }`}
                />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── MARQUEE: MITRA UMKM (PEMISAH TESTIMONI ↔ FOOTER) ─── */}
      <section
        data-nav="green"
        className="border-y border-white/15 bg-caramel py-5"
      >
        <Marquee reverse pauseOnHover>
          {PARTNERS.map((p, i) => (
            <span
              key={i}
              className="mx-8 flex items-center gap-3 font-display text-lg font-light tracking-tight text-white lg:text-xl"
            >
              <Store className="h-4 w-4 text-white/60" />
              {p}
            </span>
          ))}
        </Marquee>
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
      className="h-full w-full drop-shadow-[0_16px_22px_-14px_rgba(34,81,56,0.55)]"
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
          stroke="hsl(var(--primary-foreground) / 0.15)"
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
    <div className="group flex h-full flex-col rounded-[var(--radius)] border border-primary-foreground/15 bg-primary-foreground/[0.08] p-6 transition-colors duration-300 hover:bg-primary-foreground/15">
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/25 text-primary-foreground transition-transform duration-500 group-hover:scale-110">
        {icon}
      </span>

      <p className="mt-6 font-display text-[clamp(1.9rem,3vw,2.6rem)] font-light leading-none tracking-tight text-primary-foreground">
        {counter}
      </p>

      <p className="mt-3 font-sans text-sm leading-relaxed text-primary-foreground/70">
        {label}
      </p>

      <p className="mt-3 border-t border-dashed border-primary-foreground/20 pt-2 font-sans text-xs text-primary-foreground/60">
        {sub}
      </p>
    </div>
  );
}
