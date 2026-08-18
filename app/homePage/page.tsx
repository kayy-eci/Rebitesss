"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "@/app/components/Navbar";
import { Hero } from "@/app/components/Hero";
import { ExploreSection } from "@/app/components/ExploreSection";
import { UrgentDealsSection } from "@/app/components/UrgentDealsSection";
import { CategorySection } from "@/app/components/CategorySection";
import { FoodRecommendationSection } from "@/app/components/FoodRecommendationSection";
import { VendorSection } from "@/app/components/VendorSection";
import { SiteFooter } from "@/app/components/Footer";
import { Reveal } from "@/app/components/reveal";
import { MagneticButton } from "@/app/components/magnetic-button";

import { ArrowRight } from "lucide-react";

const PLANS = [
  {
    name: "Trial",
    tagline: "Mulai jualan di ReBites tanpa biaya langganan",
    monthly: 0,
    yearly: 0,
    features: [
      "Gratis tanpa biaya langganan",
      "Maksimal 5 produk",
      "Kelola stok dan harga",
      "Riwayat penjualan hingga 30 hari",
      "Dasbor penjualan UMKM",
    ],
    capacity: 5,
    popular: false,
    cta: "Mulai Gratis",
  },
  {
    name: "Standar",
    tagline: "Kembangkan usaha dan jangkau lebih banyak pembeli",
    monthly: 49000,
    yearly: 490000,
    features: [
      "Maksimal 25 produk",
      "Riwayat penjualan tanpa batas",
      "Prioritas tampil di marketplace",
      "Laporan penjualan lebih lengkap",
      "Lencana UMKM Terverifikasi",
    ],
    capacity: 25,
    popular: true,
    cta: "Pilih Paket",
  },
  {
    name: "Premium",
    tagline: "Kelola penjualan dengan fitur yang lebih lengkap",
    monthly: 99000,
    yearly: 990000,
    features: [
      "Produk tanpa batas",
      "Semua fitur Paket Standar",
      "Promosi di posisi unggulan",
      "Analitik tren permintaan",
      "Dukungan prioritas",
    ],
    capacity: Infinity,
    popular: false,
    cta: "Pilih Paket",
  },
];

export default function HomePage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <div>
      <Navbar />

      <main className="bg-cream-50">
        <Hero />
        <ExploreSection />
        <UrgentDealsSection />
        <CategorySection />
        <FoodRecommendationSection />
        <VendorSection />

        <section
          id="langganan"
          data-nav="cream"
          className="grain-overlay relative overflow-hidden bg-cream py-24 lg:py-32"
        >
          {/* Soft radial glow */}
          <div className="pointer-events-none absolute -top-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-3xl" />

          <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-3xl text-center">
              <Reveal delay={0.1}>
                <h2 className="mt-6 font-sans text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[1.02] tracking-[-0.02em] text-primary">
                  Pilih paket yang <span>sesuai</span> dengan kebutuhan usaha
                  Anda.
                </h2>
              </Reveal>

              <Reveal delay={0.15}>
                <p className="mx-auto mt-5 max-w-md font-sans text-sm leading-relaxed text-muted-foreground">
                  Nikmati 1 paket gratis selama 1 bulan untuk mencoba fitur
                  ReBites. Setelah masa percobaan berakhir, lanjutkan langganan
                  atau berhenti kapan saja.
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
                              : "text-muted-foreground hover:text-[#8C5A3C]"
                          }`}
                        >
                          {active && (
                            <motion.span
                              layoutId="billing-pill"
                              className="absolute inset-0 rounded-full bg-[#8C5A3C]"
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
                    ? "Khusus penjual baru"
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
                        <span className="font-sans text-sm italic tracking-[0.2em] text-[#8C5A3C]">
                          0{i + 1}
                        </span>
                      </div>

                      <h3 className="mt-4 font-sans text-2xl font-semibold tracking-tight text-primary">
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
                              className="block font-sans text-[clamp(2.4rem,3vw,3rem)] font-light leading-[3rem] tracking-tight tabular-nums"
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
                          className="w-full border border-primary/40 bg-white text-primary hover:border-[#8C5A3C] hover:bg-[#8C5A3C] hover:text-white"
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
      </main>

      <SiteFooter />
    </div>
  );
}
