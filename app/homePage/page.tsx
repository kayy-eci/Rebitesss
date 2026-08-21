"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "@/app/components/navbar";
import { Hero } from "@/app/components/Hero";
import { ExploreSection } from "@/app/components/ExploreSection";
import { FlashSaleSection } from "@/app/components/FlashSaleSection";
import { CategorySection } from "@/app/components/CategorySection";
import { FoodRecommendationSection } from "@/app/components/FoodRecommendationSection";
import { VendorSection } from "@/app/components/VendorSection";
import { SiteFooter } from "@/app/components/Footer";
import { Reveal } from "@/app/components/reveal";
import { MagneticButton } from "@/app/components/magnetic-button";
import { ProductDetailModal } from "@/app/components/ProductDetailModal";
import { getProductById } from "@/app/detail/product/data";

import { ArrowRight } from "lucide-react";

const PLANS = [
  {
    name: "Saver",
    tagline: "Hemat lebih banyak dan dapatkan prioritas saat berbelanja",
    monthly: 14999,
    yearly: 149999,
    originalYearly: null,
    features: [
      "Prioritas pesanan dibanding pengguna non-member",
      "5x Diskon biaya pengantaran",
      "Dapatkan kompensasi khusus saat pesanan mengalami kendala",
    ],
    popular: false,
    cta: "Mulai Berlangganan",
  },
  {
    name: "Plus",
    tagline: "Pilihan tepat untuk pembeli yang lebih sering bertransaksi",
    monthly: 29999,
    yearly: 269999,
    originalYearly: 299999,
    features: [
      "Prioritas pesanan lebih tinggi",
      "10x Diskon biaya pengantaran",
      "Dapatkan kompensasi khusus saat pesanan mengalami kendala",
      "Gratis biaya pengantaran hingga 3 transaksi setiap bulan",
    ],
    popular: true,
    cta: "Pilih ReBites Plus",
  },
  {
    name: "Max",
    tagline: "Maksimalkan keuntungan di setiap pembelian",
    monthly: 49999,
    yearly: 469999,
    originalYearly: 499999,
    features: [
      "Prioritas pesanan lebih tinggi",
      "20x Diskon biaya pengantaran",
      "Dapatkan kompensasi khusus saat pesanan mengalami kendala",
      "Gratis biaya pengantaran hingga 10 transaksi setiap bulan",
      "Gratis biaya layanan hingga 3 transaksi setiap bulan",
    ],
    popular: false,
    cta: "Pilih ReBites Max",
  },
];

export default function HomePage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );

  const handleViewDetail = useCallback((id: string) => {
    setSelectedProductId(id);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProductId(null);
  }, []);

  const selectedProduct = selectedProductId
    ? getProductById(selectedProductId)
    : undefined;

  return (
    <div>
      <Navbar />

      <main className="bg-cream-50">
        <Hero />
        <ExploreSection from="home" />
        <FlashSaleSection onViewDetail={handleViewDetail} />
        <CategorySection />
        <FoodRecommendationSection onViewDetail={handleViewDetail} />
        <VendorSection />

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
                  Dapatkan lebih banyak <span>keuntungan</span> sebagai member
                  ReBites.
                </h2>
              </Reveal>

              <Reveal delay={0.15}>
                <p className="mx-auto mt-5 max-w-xl font-sans text-sm leading-relaxed text-muted-foreground">
                  Pilih paket membership yang sesuai dengan kebiasaan belanja
                  Anda. Nikmati prioritas pesanan, potongan biaya pengantaran,
                  kompensasi saat terjadi kendala, dan berbagai keuntungan
                  layanan eksklusif selama menjadi member ReBites.
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
                              : "text-muted-foreground hover:text-[#C8A882]"
                          }`}
                        >
                          {active && (
                            <motion.span
                              layoutId="billing-pill"
                              className="absolute inset-0 rounded-full bg-[#C8A882]"
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

                const subLine = yearlyMode
                  ? "Bayar sekali untuk masa membership 1 tahun"
                  : `atau Rp${plan.yearly.toLocaleString("id-ID")} / tahun`;

                return (
                  <Reveal key={plan.name} delay={i * 0.1} className="h-full">
                    <div className="relative flex h-full flex-col overflow-hidden rounded-[var(--radius)] border border-border bg-background p-8 shadow-[0_10px_30px_-24px_rgba(34,81,56,0.3)] transition-all duration-300 hover:-translate-y-1 hover:border-[#C8A882] hover:shadow-[0_15px_40px_-20px_rgba(200,168,130,0.35)] lg:p-9">
                      {plan.popular && (
                        <div className="absolute right-5 top-5 rounded-full bg-[#C8A882] px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
                          Paling Populer
                        </div>
                      )}

                      <div className="relative flex items-center justify-between">
                        <span className="font-sans text-sm italic tracking-[0.2em] text-[#C8A882]">
                          0{i + 1}
                        </span>
                      </div>

                      <h3 className="mt-4 font-sans text-2xl font-semibold tracking-tight text-primary">
                        ReBites {plan.name}
                      </h3>

                      <p className="mt-1 min-h-[2rem] max-w-[250px] font-sans text-xs italic text-muted-foreground">
                        {plan.tagline}
                      </p>

                      <div className="mt-6 flex min-h-[3.5rem] items-end gap-2 text-primary">
                        <div className="relative flex h-[3.5rem] shrink-0 flex-col items-start">
                          {yearlyMode && plan.originalYearly && (
                            <span className="absolute left-0 top-0 whitespace-nowrap font-sans text-xs font-medium leading-none text-muted-foreground line-through tabular-nums">
                              Rp
                              {plan.originalYearly.toLocaleString("id-ID")}
                            </span>
                          )}

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

                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="relative mt-auto pt-8">
                        <MagneticButton
                          href="/auth/register"
                          className="group w-full border border-primary/40 bg-white text-primary transition-all duration-300 hover:border-[#C8A882] hover:bg-[#C8A882] hover:text-white"
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

      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
