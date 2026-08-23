'use client';

import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { SellerShell } from '@/app/components/dashboardPenjual/SellerShell';
import { SalesActivityChartCard } from '@/app/components/dashboardPenjual/SalesActivityChartCard';
import { TopCategoryCard } from '@/app/components/dashboardPenjual/TopCategoryCard';
import { PartnerScoreGaugeCard } from '@/app/components/dashboardPenjual/PartnerScoreGaugeCard';
import { AchievementBadgesCard } from '@/app/components/dashboardPenjual/AchievementBadgesCard';
import { BestSellingMenuRow } from '@/app/components/dashboardPenjual/BestSellingMenuRow';

/**
 * Performa Toko — versi lengkap dari statistik dashboard: grafik
 * periode 7/14/30 hari, kategori terlaris (bulan di luar jendela
 * riwayat Basic terkunci), skor mitra, pencapaian, dan menu terlaris.
 */
export default function PerformaTokoPage() {
  return (
    <SellerShell>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-500">
          Dashboard Penjual
        </p>
        <h1 className="mt-1 font-display text-[clamp(1.8rem,4vw,2.6rem)] font-medium leading-tight tracking-[-0.02em] text-forest-900">
          Performa Toko
        </h1>
        <p className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-sage-500">
          <TrendingUp className="h-3.5 w-3.5" />
          Pantau tren penjualan dan capaian tokomu secara lengkap.
        </p>
      </motion.div>

      <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
        <div className="space-y-5 lg:col-span-8 lg:space-y-6">
          <SalesActivityChartCard />
          <TopCategoryCard />
          <PartnerScoreGaugeCard />
        </div>

        <div className="space-y-5 lg:col-span-4 lg:space-y-6">
          <BestSellingMenuRow />
          <AchievementBadgesCard />
        </div>
      </div>
    </SellerShell>
  );
}
