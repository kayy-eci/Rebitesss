"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
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
import { UrgentDealsSection } from "@/app/components/UrgentDealsSection";
import { ProductDetailModal } from "@/app/components/ProductDetailModal";
import { getProductById } from "@/app/detailProduct/data";
import { HeroSection } from "@/app/components/hero-section";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/app/components/ui/carousel";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/app/components/ui/avatar";

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

const PLANS = [
  {
    name: "Basic",
    tagline: "Gunakan ReBites secara gratis selamanya.",
    monthly: 0,
    yearly: 0,
    features: [
      "Maksimal 5 produk",
      "Riwayat penjualan 30 hari",
      "Dashboard penjualan",
    ],
    cta: "Gunakan Gratis",
    popular: false,
  },
  {
    name: "Standar",
    tagline: "Untuk UMKM yang mulai aktif berjualan di ReBites.",
    monthly: 49000,
    yearly: 490000,
    features: [
      "Maksimal 25 produk",
      "Riwayat penjualan tanpa batas",
      "Prioritas di marketplace",
      "Laporan penjualan detail",
      "Badge UMKM Terverifikasi",
    ],
    cta: "Pilih Standar",
    popular: true,
  },
  {
    name: "Premium",
    tagline: "Untuk usaha yang ingin berkembang lebih jauh.",
    monthly: 99000,
    yearly: 990000,
    features: [
      "Produk tanpa batas",
      "Semua fitur Standar",
      "Promosi unggulan",
      "Analitik permintaan",
      "Dukungan prioritas",
    ],
    cta: "Pilih Premium",
    popular: false,
  },
];

type Testimonial = {
  name: string;
  role: string;
  quote: string;
  rating: number;
  initials: string;
  photo: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Rina Astuti",
    role: "Pemilik Dapur Ibu Sri",
    quote:
      "Awalnya coba-coba daftar Trial karena penasaran. Ternyata kepake banget. Makanan yang biasanya masih sisa sekarang lebih cepat habis, dan laporan penjualannya juga gampang dipahami.",
    rating: 5,
    initials: "RA",
    photo:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
  },
  {
    name: "Arga Zanuar",
    role: "Pembeli setia",
    quote:
      "Sekarang kalau jam makan siang biasanya cek ReBites dulu. Harganya lebih hemat, tapi makanannya tetap enak dan kondisinya juga oke. Lumayan banget buat sehari-hari.",
    rating: 5,
    initials: "BS",
    photo:
      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
  },
  {
    name: "Dewi Lestari",
    role: "Kue Mbok Darmi",
    quote:
      "Sejak pakai paket Standar, produk saya jadi lebih sering dilihat orang. Ada beberapa pembeli baru yang awalnya nemu dari ReBites, jadi lumayan banget buat kenalin usaha juga.",
    rating: 5,
    initials: "DL",
    photo:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
  },
  {
    name: "Abdurrahman Kaysan",
    role: "Pelanggan rutin",
    quote:
      "Paling sering pesen kalau lagi males keluar rumah. Soto Mie Bogornya enak, harganya juga nggak bikin mikir dua kali. Udah beberapa kali beli dan sejauh ini selalu puas.",
    rating: 5,
    initials: "AF",
    photo:
      "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
  },
  {
    name: "Mang Teten",
    role: "Warung Mang Teten",
    quote:
      "Dulu kalau ada makanan yang nggak habis biasanya bingung mau diapain. Sekarang bisa ditawarkan lewat ReBites. Lumayan, makanan nggak kebuang dan masih bisa jadi tambahan pemasukan.",
    rating: 5,
    initials: "SW",
    photo:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
  },
  {
    name: "Falen Darmawan",
    role: "Mahasiswa",
    quote:
      "Sebagai anak kos, ReBites cukup ngebantu sih. Bisa dapet makanan yang masih bagus dengan harga lebih murah. Biasanya sebelum beli makan saya cek sini dulu.",
    rating: 5,
    initials: "RP",
    photo:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
  },
];

export default function Home() {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [testimonialApi, setTestimonialApi] = useState<CarouselApi>();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const handleViewDetail = (id: string) => {
    setSelectedProductId(id);
  };

  const handleCloseModal = () => {
    setSelectedProductId(null);
  };

  const handleRequireLogin = () => {
    router.push("/login");
  };

  const selectedProduct = selectedProductId
    ? getProductById(selectedProductId)
    : undefined;

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
      <div id="top">
        <HeroSection />
      </div>

      <UrgentDealsSection onViewDetail={handleViewDetail} />

      <HowItWorks />

      <section
        id="about"
        data-nav="green"
        className="grain-overlay relative overflow-hidden bg-primary py-20 lg:py-28"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-[32rem] w-[32rem] rounded-full bg-[#C8A882]/10 blur-3xl"
        />

        <div
          aria-hidden
          className="pointer-events-none absolute right-20 top-32 h-32 w-32 rounded-full border border-[#C8A882]/20"
        />

        <div className="relative mx-auto max-w-[1400px]">
          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
            <div>
              <Reveal delay={0.15}>
                <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-light leading-[1.02] tracking-[-0.02em] text-primary-foreground">
                  <RevealWords text="Bukan sekadar" />{" "}
                  <RevealWords text="menyelamatkan" />{" "}
                  <RevealWords text="makanan." />
                </h2>
              </Reveal>

              <Reveal delay={0.2}>
                <p className="mt-6 max-w-lg font-sans text-sm leading-[1.85] text-primary-foreground">
                  <span className="font-semibold text-[#C8A882]">ReBites</span>{" "}
                  hadir sebagai marketplace makanan surplus yang mempertemukan
                  pelaku UMKM dengan masyarakat. Makanan yang sebelumnya
                  berpotensi terbuang dapat kembali memiliki nilai, sementara
                  pelaku usaha memperoleh peluang tambahan pendapatan dan
                  pembeli mendapatkan makanan berkualitas dengan harga yang
                  lebih terjangkau.
                </p>
              </Reveal>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: Scale,
                  value: 184,
                  suffix: " kg",
                  label: "rata-rata pangan terbuang",
                  subtext: "115–184 kg per kapita/tahun",
                },
                {
                  icon: Wallet,
                  value: 551,
                  prefix: "Rp ",
                  suffix: " T",
                  label: "kerugian ekonomi per tahun",
                  subtext: "Rp213–551 triliun",
                },
                {
                  icon: Users,
                  value: 125,
                  suffix: " jt",
                  label: "orang berpotensi makan",
                  subtext: "61–125 juta orang",
                },
              ].map((stat, i) => (
                <Reveal key={stat.label} delay={0.15 + i * 0.08}>
                  <div className="group flex h-full cursor-pointer flex-col rounded-[var(--radius)] border border-white bg-primary-foreground/[0.05] p-5 transition-colors duration-300 hover:bg-primary-foreground/[0.10] sm:p-6">
                    <stat.icon className="mb-3 h-5 w-5 text-[#C8A882]" />

                    <p className="flex items-baseline gap-1 font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-light leading-none tracking-tight text-primary-foreground">
                      <Counter
                        to={stat.value}
                        prefix={stat.prefix ?? ""}
                        suffix={stat.suffix}
                        className="tabular-nums"
                        duration={8}
                      />
                    </p>

                    <p className="mt-2 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-primary-foreground">
                      {stat.label}
                    </p>

                    <p className="mt-1 font-sans text-xs text-primary-foreground">
                      {stat.subtext}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.1}>
            <h3 className="mt-14 font-display text-[clamp(1.5rem,2.8vw,2.2rem)] font-light leading-[1.1] tracking-[-0.02em] text-primary-foreground lg:mt-20">
              Untuk <span className="text-[#C8A882]">UMKM</span>. Untuk{" "}
              <span className="text-[#C8A882]">masyarakat</span>. Untuk{" "}
              <span className="text-[#C8A882]">lingkungan</span>.
            </h3>
          </Reveal>

          <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:mt-10">
            {[
              {
                num: "01",
                title: "UMKM",
                desc: "Memberi peluang tambahan pendapatan dari makanan surplus yang masih layak konsumsi.",
              },
              {
                num: "02",
                title: "Masyarakat",
                desc: "Memudahkan menemukan makanan berkualitas dengan harga yang lebih terjangkau.",
              },
              {
                num: "03",
                title: "Lingkungan",
                desc: "Membantu mengurangi potensi food waste dengan memperpanjang pemanfaatan makanan.",
              },
            ].map((item, i) => (
              <Reveal key={item.num} delay={0.1 + i * 0.08}>
                <div className="group flex h-full cursor-pointer flex-col rounded-[var(--radius)] border border-white bg-primary-foreground/[0.06] p-7 transition-colors duration-300 hover:bg-primary-foreground/[0.12] sm:p-8">
                  <span className="font-sans text-sm italic tracking-[0.2em] text-[#C8A882]">
                    {item.num}
                  </span>

                  <h3 className="mt-5 font-sans text-xl font-semibold tracking-tight text-primary-foreground">
                    {item.title}
                  </h3>

                  <p className="mt-3 max-w-xs font-sans text-sm leading-[1.8] text-primary-foreground">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section
        id="langganan"
        data-nav="cream"
        className="grain-overlay relative overflow-hidden bg-cream py-24 lg:py-32"
      >
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-3xl" />

        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal delay={0.1}>
              <h2 className="mt-6 font-sans text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[1.02] tracking-[-0.02em] text-primary">
                Kembangkan usaha bersama{" "}
                <span className="text-caramel">ReBites.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="mx-auto mt-5 max-w-xl font-sans text-sm leading-relaxed text-muted-foreground">
                Pilih paket penjual yang sesuai dengan kebutuhan usaha Anda.
                Kelola produk, pantau penjualan, dan dapatkan lebih banyak
                kesempatan untuk menjangkau pelanggan melalui ReBites.
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

              const priceValue = yearlyMode ? plan.yearly : plan.monthly;

              const priceLabel =
                priceValue === 0
                  ? "Gratis"
                  : `Rp${priceValue.toLocaleString("id-ID")}`;

              const priceSuffix =
                priceValue === 0 ? "" : yearlyMode ? "/tahun" : "/bulan";

              const subLine =
                plan.monthly === 0
                  ? "Gratis selama 1 bulan"
                  : yearlyMode
                    ? `Setara Rp${Math.round(plan.yearly / 12).toLocaleString(
                        "id-ID",
                      )} / bulan`
                    : `atau Rp${plan.yearly.toLocaleString("id-ID")} / tahun`;

              return (
                <Reveal key={plan.name} delay={i * 0.1} className="h-full">
                  <div
                    className={`relative flex h-full flex-col overflow-hidden rounded-[var(--radius)] border bg-background p-8 shadow-[0_10px_30px_-24px_rgba(34,81,56,0.3)] transition-all duration-300 hover:-translate-y-1 lg:p-9 ${
                      plan.popular
                        ? "border-caramel shadow-[0_15px_40px_-20px_rgba(200,168,130,0.35)]"
                        : "border-border hover:border-caramel"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute right-5 top-5 rounded-full bg-white px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                        Paling Populer
                      </div>
                    )}

                    <div className="relative flex items-center justify-between">
                      <span className="font-sans text-sm italic tracking-[0.2em] text-caramel">
                        0{i + 1}
                      </span>
                    </div>

                    <h3 className="mt-4 font-sans text-2xl font-bold tracking-tight text-primary">
                      ReBites {plan.name}
                    </h3>

                    <p className="mt-2 min-h-[2.5rem] max-w-[250px] font-sans text-xs leading-relaxed italic text-muted-foreground">
                      {plan.tagline}
                    </p>

                    <div className="mt-6 flex min-h-[3.5rem] items-end gap-2 text-primary">
                      <div className="relative flex h-[3.5rem] shrink-0 flex-col items-start">
                        <div className="mt-auto overflow-hidden">
                          <AnimatePresence mode="wait" initial={false}>
                            <motion.span
                              key={priceLabel}
                              initial={{
                                opacity: 0,
                                y: 16,
                              }}
                              animate={{
                                opacity: 1,
                                y: 0,
                              }}
                              exit={{
                                opacity: 0,
                                y: -16,
                              }}
                              transition={{
                                duration: 0.3,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                              className="block whitespace-nowrap font-sans text-[clamp(2.4rem,3vw,3rem)] font-light leading-[3rem] tracking-tight tabular-nums"
                            >
                              {priceLabel}
                            </motion.span>
                          </AnimatePresence>
                        </div>
                      </div>

                      {priceSuffix && (
                        <span className="mb-1 shrink-0 whitespace-nowrap font-sans text-sm text-muted-foreground">
                          {priceSuffix}
                        </span>
                      )}
                    </div>

                    <p className="mt-1 min-h-[2rem] font-sans text-xs text-muted-foreground">
                      {subLine}
                    </p>

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
                        {plan.features.map((feature, j) => (
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

                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="relative mt-auto pt-8">
                      <MagneticButton
                        href="/register"
                        className={`group w-full border transition-all duration-300 ${
                          plan.popular
                            ? "border-caramel bg-caramel text-white hover:bg-[#A06B45]"
                            : "border-primary/40 bg-white text-primary hover:border-caramel hover:bg-caramel hover:text-white"
                        }`}
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

          <Reveal delay={0.2}>
            <p className="mx-auto mt-8 max-w-2xl text-center font-sans text-xs leading-relaxed text-muted-foreground">
              Semua paket ditujukan untuk penjual dan UMKM yang ingin
              memanfaatkan ReBites sebagai kanal tambahan untuk menjual makanan
              surplus yang masih layak konsumsi.
            </p>
          </Reveal>
        </div>
      </section>

      <section
        id="testimoni"
        data-nav="green"
        className="grain-overlay relative overflow-hidden bg-primary py-24 lg:py-32"
      >
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-primary-foreground/[0.06] blur-3xl" />

        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left">
              <Reveal delay={0.1}>
                <h2 className="mt-6 font-display text-[clamp(2rem,4.5vw,3.5rem)] font-light leading-[1.02] tracking-[-0.02em] text-primary-foreground">
                  <RevealWords text="Apa kata mereka setelah" />{" "}
                  <span>menggunakan</span> ReBites.
                </h2>
              </Reveal>

              <Reveal delay={0.15}>
                <p className="mx-auto mt-5 max-w-md font-sans text-sm leading-relaxed text-primary-foreground/70 lg:mx-0">
                  Pengalaman dari UMKM dan pembeli yang sudah menemukan cara
                  baru untuk menjual, membeli, dan menikmati makanan dengan
                  lebih hemat.
                </p>
              </Reveal>
            </div>
          </div>

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
                        <span
                          aria-hidden
                          className="pointer-events-none absolute -top-3 right-4 select-none font-display text-[6rem] font-extralight leading-none text-caramel/[0.08] transition-colors duration-300 group-hover:text-caramel/15"
                        >
                          &ldquo;
                        </span>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: t.rating }).map((_, s) => (
                            <Star
                              key={s}
                              className="h-4 w-4 fill-amber text-amber"
                            />
                          ))}
                        </div>

                        <Quote className="mt-5 h-5 w-5 text-caramel/40" />

                        <blockquote className="mt-3 flex-1 font-sans text-sm leading-relaxed text-foreground/80">
                          &ldquo;{t.quote}&rdquo;
                        </blockquote>

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
                            <AvatarImage
                              src={t.photo}
                              alt={t.name}
                              className="object-cover"
                            />

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

      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            onClose={handleCloseModal}
            onRequireLogin={handleRequireLogin}
          />
        )}
      </AnimatePresence>

      <SiteFooter />
    </SmoothScroll>
  );
}
