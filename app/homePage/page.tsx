import { Navbar } from "@/app/components/Navbar";
import { Hero } from "@/app/components/Hero";
import { ExploreSection } from "@/app/components/ExploreSection";
import { UrgentDealsSection } from "@/app/components/UrgentDealsSection";
import { VendorSection } from "@/app/components/VendorSection";
import { SiteFooter } from "@/app/components/Footer";
import { Reveal } from "@/app/components/reveal";
import { MagneticButton } from "@/app/components/magnetic-button";
import {
  ArrowRight,
  ShoppingCart,
  Sparkles,
  Store,
  TrendingDown,
  type LucideIcon,
} from "lucide-react";

const UMKM_GROUPS: {
  icon: LucideIcon;
  title: string;
  tagline: string;
  features: string[];
}[] = [
  {
    icon: Store,
    title: "Katalog Usaha",
    tagline: "Tampilkan dapurmu di marketplace",
    features: [
      "Profil usaha, logo, dan lokasi dapur yang terlihat jelas",
      "Stok harian, harga surplus, status, dan waktu jual",
    ],
  },
  {
    icon: ShoppingCart,
    title: "Pesanan & Langganan",
    tagline: "Semua pesanan dari satu dasbor",
    features: [
      "Terima, proses, dan tandai pesanan siap diambil atau dikirim",
      "Coba 1 bulan gratis, lalu pilih paket sesuai skala usaha",
    ],
  },
  {
    icon: TrendingDown,
    title: "Analitik & Lokasi",
    tagline: "Pantau performa dan jangkauan",
    features: [
      "Riwayat penjualan dan pemasukan dari surplus yang diselamatkan",
      "Peta pickup agar pembeli mudah menemukan dapur Anda",
    ],
  },
];

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <main className="bg-cream-50">
        <Hero />
        <ExploreSection />
        <UrgentDealsSection />
        <VendorSection />
        <section
          id="umkm"
          className="grain-overlay relative overflow-hidden bg-cream py-24 lg:py-32"
        >
          {/* Soft radial glow */}
          <div className="pointer-events-none absolute -top-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-3xl" />

          <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
            {/* Header */}
            <div className="mx-auto max-w-3xl text-center">
              <Reveal delay={0.1}>
                <h2 className="mt-6 font-display text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[1.02] tracking-[-0.02em] text-primary">
                  Kelola surplus, <span>tambah pemasukan.</span>
                </h2>
              </Reveal>

              <Reveal delay={0.15}>
                <p className="mx-auto mt-5 max-w-md font-sans text-sm leading-relaxed text-muted-foreground">
                  Alat yang dirancang khusus untuk pelaku kuliner skala kecil.
                  Kelola produk, stok, pesanan, dan langganan dari satu dasbor.
                </p>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="mt-8 flex justify-center">
                  <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-6 py-3">
                    <Sparkles className="h-4 w-4 text-caramel" />
                    <span className="font-sans text-xs font-medium tracking-tight text-primary">
                      Trial gratis 1 bulan · tanpa kartu kredit
                    </span>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Fitur UMKM */}
            <div className="mt-14 grid gap-5 lg:mt-16 lg:grid-cols-3">
              {UMKM_GROUPS.map((group, i) => (
                <Reveal key={group.title} delay={i * 0.1} className="h-full">
                  <div className="relative flex h-full flex-col overflow-hidden rounded-[var(--radius)] border border-border bg-background p-8 shadow-[0_10px_30px_-24px_rgba(34,81,56,0.3)] transition-all duration-300 hover:-translate-y-1 hover:border-caramel/40 lg:p-9">
                    <div className="relative flex items-center justify-between">
                      <span className="font-display text-sm italic tracking-[0.2em] text-caramel/50">
                        0{i + 1}
                      </span>
                      <group.icon className="h-5 w-5 text-caramel/70" />
                    </div>

                    <h3 className="mt-4 font-display text-2xl font-light tracking-tight text-primary">
                      {group.title}
                    </h3>

                    <p className="mt-1 font-sans text-xs italic text-muted-foreground">
                      {group.tagline}
                    </p>

                    <div className="relative mt-7 flex-1 pt-7 text-foreground/75">
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
                        {group.features.map((f, j) => (
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
                        variant="default"
                        className="w-full"
                      >
                        Daftar sebagai UMKM
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </MagneticButton>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
