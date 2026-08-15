"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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
  Check,
  Sparkles,
} from "lucide-react";

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

        <VendorSection />

        {/* ── LANGGANAN / PAKET UMKM ───────────────────────────── */}
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
                  Pilih paket yang <span>sesuai</span> dengan kebutuhan usaha
                  Anda.
                </h2>
              </Reveal>

              <Reveal delay={0.15}>
                <p className="mx-auto mt-5 max-w-md font-sans text-sm leading-relaxed text-muted-foreground">
                  Coba semua fitur secara gratis selama 1 bulan. Lanjutkan
                  langganan atau berhenti kapan saja, tanpa ribet.
                </p>
              </Reveal>

              {/* Billing toggle */}
              <Reveal delay={0.2}>
                <div className="mt-8 flex justify-center">
                  <div className="relative inline-flex items-center rounded-full border border-border bg-white p-1">
                    {[
                      {
                        key: "monthly",
                        label: "Bulanan",
                      },
                      {
                        key: "yearly",
                        label: "Tahunan",
                      },
                    ].map((mode) => {
                      const active = billing === mode.key;

                      return (
                        <button
                          key={mode.key}
                          type="button"
                          onClick={() =>
                            setBilling(
                              mode.key as "monthly" | "yearly"
                            )
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

                          <span className="relative z-10">
                            {mode.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Pricing cards */}
            <div className="mt-14 grid gap-5 lg:mt-16 lg:grid-cols-3">
              {PLANS.map((plan, i) => {
                const yearlyMode = billing === "yearly";

                const priceLabel =
                  plan.monthly === 0
                    ? "Gratis"
                    : `Rp${(
                        yearlyMode ? plan.yearly : plan.monthly
                      ).toLocaleString("id-ID")}`;

                const priceSuffix =
                  plan.monthly === 0
                    ? ""
                    : yearlyMode
                      ? "/tahun"
                      : "/bulan";

                const subLine =
                  plan.monthly === 0
                    ? "Khusus penjual baru"
                    : yearlyMode
                      ? `Hemat 2 bulan · setara Rp${Math.round(
                          plan.yearly / 12
                        ).toLocaleString("id-ID")} / bulan`
                      : `atau Rp${plan.yearly.toLocaleString(
                          "id-ID"
                        )} / tahun`;

                const capacityPct =
                  plan.capacity === Infinity
                    ? 100
                    : Math.max(
                        12,
                        (plan.capacity / 25) * 100
                      );

                return (
                  <Reveal
                    key={plan.name}
                    delay={i * 0.1}
                    className="h-full"
                  >
                    <div className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius)] border border-border bg-background p-8 shadow-[0_10px_30px_-24px_rgba(34,81,56,0.3)] transition-all duration-300 hover:-translate-y-1 hover:border-caramel/40 lg:p-9">
                      {/* Number */}
                      <div className="relative flex items-center justify-between">
                        <span className="font-display text-sm italic tracking-[0.2em] text-caramel/50">
                          0{i + 1}
                        </span>

                        {plan.popular && (
                          <span className="rounded-full bg-caramel px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                            Paling populer
                          </span>
                        )}
                      </div>

                      {/* Name */}
                      <h3 className="mt-4 font-display text-2xl font-light tracking-tight text-primary">
                        {plan.name}
                      </h3>

                      {/* Tagline */}
                      <p className="mt-1 font-sans text-xs italic text-muted-foreground">
                        {plan.tagline}
                      </p>

                      {/* Price */}
                      <div className="mt-6 flex items-baseline gap-1.5 text-primary">
                        <div className="relative h-[3rem] overflow-hidden">
                          <AnimatePresence
                            mode="wait"
                            initial={false}
                          >
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
                                ease: [
                                  0.22,
                                  1,
                                  0.36,
                                  1,
                                ],
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

                      {/* Annual information */}
                      <p className="mt-1 font-sans text-xs text-muted-foreground">
                        {subLine}
                      </p>

                      {/* Capacity */}
                      <div className="mt-6">
                        <div className="flex items-center justify-between font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                          <span>Kapasitas produk</span>

                          <span>
                            {plan.capacity === Infinity
                              ? "Tak terbatas"
                              : `${plan.capacity} produk`}
                          </span>
                        </div>

                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-primary/10">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{
                              width: `${capacityPct}%`,
                            }}
                            viewport={{
                              once: true,
                              amount: 0.8,
                            }}
                            transition={{
                              duration: 0.8,
                              delay: i * 0.1,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="h-full rounded-full bg-caramel"
                          />
                        </div>
                      </div>

                      {/* Trial notice */}
                      <div className="mt-6 flex items-center gap-2 rounded-[var(--radius)] bg-primary/[0.06] px-3 py-2.5 text-xs text-primary">
                        <Sparkles className="h-3.5 w-3.5 shrink-0" />
                        Trial gratis 1 bulan
                      </div>

                      {/* Features */}
                      <ul className="mt-7 flex-1 space-y-3">
                        {plan.features.map((feature, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-3 font-sans text-sm text-foreground/75"
                          >
                            <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border border-caramel/30 text-caramel">
                              <Check className="h-2.5 w-2.5" />
                            </span>

                            {feature}
                          </li>
                        ))}
                      </ul>

                      {/* CTA */}
                      <div className="relative mt-8">
                        <MagneticButton
                          href="/register"
                          variant={
                            plan.popular
                              ? "default"
                              : "outline"
                          }
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
      </main>

      <SiteFooter />
    </div>
  );
}