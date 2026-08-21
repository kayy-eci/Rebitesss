'use client';

import { useState } from 'react';
import { motion, MotionConfig } from 'framer-motion';
import { Reveal } from '@/app/components/reveal';
import { VENDOR } from '@/app/components/dashboardPenjual/data';
import { DashboardDecor } from '@/app/components/dashboardPenjual/decor';
import { Sidebar } from '@/app/components/dashboardPenjual/Sidebar';
import { Topbar } from '@/app/components/dashboardPenjual/Topbar';
import { SalesActivityChartCard } from '@/app/components/dashboardPenjual/SalesActivityChartCard';
import { VendorStatCardStack } from '@/app/components/dashboardPenjual/VendorStatCardStack';
import { StoreCard } from '@/app/components/dashboardPenjual/StoreCard';
import { BestSellingMenuRow } from '@/app/components/dashboardPenjual/BestSellingMenuRow';
import { IncomingOrderListCard } from '@/app/components/dashboardPenjual/IncomingOrderListCard';
import { MonthlySalesTargetCard } from '@/app/components/dashboardPenjual/MonthlySalesTargetCard';
import { TipsCard } from '@/app/components/dashboardPenjual/TipsCard';
import { TopCategoryCard } from '@/app/components/dashboardPenjual/TopCategoryCard';
import { PartnerScoreGaugeCard } from '@/app/components/dashboardPenjual/PartnerScoreGaugeCard';
import { AchievementBadgesCard } from '@/app/components/dashboardPenjual/AchievementBadgesCard';

export default function VendorDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
            </motion.div>

            <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
              {/* Wilayah kanan — tampil lebih dulu di mobile agar kartu toko & pesanan dekat atas */}
              <div className="order-1 space-y-5 lg:order-2 lg:col-span-4 lg:space-y-6">
                <Reveal delay={0.05}>
                  <StoreCard />
                </Reveal>
                <Reveal delay={0.1}>
                  <BestSellingMenuRow />
                </Reveal>
                <Reveal delay={0.15}>
                  <IncomingOrderListCard />
                </Reveal>
              </div>

              {/* Wilayah kiri */}
              <div className="order-2 space-y-5 lg:order-1 lg:col-span-8 lg:space-y-6">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-6">
                  <Reveal delay={0.05} className="md:col-span-2">
                    <SalesActivityChartCard />
                  </Reveal>
                  <Reveal delay={0.1} className="md:col-span-1">
                    <VendorStatCardStack />
                  </Reveal>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6">
                  <Reveal delay={0.1}>
                    <MonthlySalesTargetCard />
                  </Reveal>
                  <Reveal delay={0.15}>
                    <TipsCard />
                  </Reveal>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-6">
                  <Reveal delay={0.15}>
                    <TopCategoryCard />
                  </Reveal>
                  <Reveal delay={0.2}>
                    <PartnerScoreGaugeCard />
                  </Reveal>
                  <Reveal delay={0.25}>
                    <AchievementBadgesCard />
                  </Reveal>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </MotionConfig>
  );
}
