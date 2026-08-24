'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, MotionConfig } from 'framer-motion';
import { Crown } from 'lucide-react';
import { Reveal } from '@/app/components/reveal';
import { VENDOR } from '@/app/components/dashboardPenjual/data';
import { DashboardDecor } from '@/app/components/dashboardPenjual/decor';
import { Sidebar } from '@/app/components/dashboardPenjual/Sidebar';
import { Topbar } from '@/app/components/dashboardPenjual/Topbar';
import { SalesStatsCard } from '@/app/components/dashboardPenjual/SalesStatsCard';
import { DetailedReportCard, type StatsPeriod } from '@/app/components/dashboardPenjual/DetailedReportCard';
import { DemandAnalyticsCard } from '@/app/components/dashboardPenjual/DemandAnalyticsCard';
import { FeaturedPromoCard } from '@/app/components/dashboardPenjual/FeaturedPromoCard';
import { StoreCard } from '@/app/components/dashboardPenjual/StoreCard';
import { StoreRatingCard } from '@/app/components/dashboardPenjual/StoreRatingCard';
import { useSellerPlan } from '@/lib/seller-plan';

export default function VendorDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [period, setPeriod] = useState<StatsPeriod>('7-hari');
  const { plan } = useSellerPlan();

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-screen bg-cream-50 font-sans text-charcoal-900">
        <DashboardDecor />

        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="relative z-10 lg:pl-[280px]">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />

          <main className="mx-auto max-w-[1400px] px-4 pb-20 pt-6 sm:px-6 lg:px-10">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-500">
                    Dashboard Penjual
                  </p>
                  <h1 className="mt-1 font-display text-[clamp(1.8rem,4vw,2.6rem)] font-medium leading-tight tracking-[-0.02em] text-forest-900">
                    Halo, <span className="font-extralight italic">{VENDOR.firstName}</span>
                  </h1>
                  <p className="mt-1 text-sm text-sage-500">
                    Pantau penjualan, pesanan masuk, dan limbah tokomu dari tiap porsi yang
                    terselamatkan.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-100 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-charcoal-900">
                    <Crown className="h-3.5 w-3.5 text-gold-500" />
                    Paket Aktif · ReBites {plan.label}
                  </span>
                  { }
                  <Link
                    href="/dashboard/penjual/langganan"
                    className="inline-flex items-center gap-1.5 rounded-full border border-green-700 px-3.5 py-1.5 text-[11px] font-semibold text-green-700 transition-colors hover:bg-green-700/10"
                  >
                    Kelola Paket Langganan
                  </Link>
                </div>
              </div>
            </motion.div>

            <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
              { }
              <div className="order-1 space-y-5 lg:order-2 lg:col-span-4 lg:space-y-6">
                <Reveal delay={0.05}>
                  <StoreCard />
                </Reveal>
                <Reveal delay={0.1}>
                  <StoreRatingCard />
                </Reveal>
              </div>

              { }
              <div className="order-2 space-y-5 lg:order-1 lg:col-span-8 lg:space-y-6">
                <Reveal delay={0.05}>
                  <SalesStatsCard period={period} onPeriodChange={setPeriod} />
                </Reveal>

                <Reveal delay={0.1}>
                  <DetailedReportCard period={period} />
                </Reveal>

                <Reveal delay={0.15}>
                  <DemandAnalyticsCard />
                </Reveal>

                <Reveal delay={0.2}>
                  <FeaturedPromoCard />
                </Reveal>
              </div>
            </div>
          </main>
        </div>
      </div>
    </MotionConfig>
  );
}
