'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { SellerShell } from '@/app/components/dashboardPenjual/SellerShell';
import { AddMenuForm } from '@/app/components/tambahMenu/AddMenuForm';

export default function TambahMenuPage() {
  return (
    <SellerShell>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <Link
          href="/dashboard/penjual/menu"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-sage-500 transition-colors hover:text-charcoal-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Kembali ke Menu Saya
        </Link>

        <div className="mt-4 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sage-100 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-500">
              Menu Saya
            </p>
            <h1 className="mt-0.5 font-display text-[clamp(1.8rem,4vw,2.6rem)] font-medium leading-tight tracking-[-0.02em] text-primary">
              Tambah Menu Baru
            </h1>
            <p className="mt-1 text-sm text-sage-500">
              Tawarkan porsi surplus dengan harga hemat agar tidak ada makanan terbuang
              hari ini.
            </p>
          </div>
        </div>
      </motion.div>

      <AddMenuForm />
    </SellerShell>
  );
}
