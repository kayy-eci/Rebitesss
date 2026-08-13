'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Calendar,
  Check,
  Clock,
  Crown,
  Leaf,
  Mail,
  MapPin,
  Package,
  Pencil,
  Phone,
  PiggyBank,
  Receipt,
  Search,
  Sparkles,
  User,
  Utensils,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─────────────────────────  Data mock  ───────────────────────── */

const BANNER_IMAGE =
  'https://images.pexels.com/photos/406152/pexels-photo-406152.jpeg?auto=compress&cs=tinysrgb&w=1600';

type OrderStatus = 'Selesai' | 'Diambil' | 'Diproses';

interface Order {
  id: string;
  merchant: string;
  item: string;
  date: string;
  price: number;
  status: OrderStatus;
}

const ORDERS: Order[] = [
  {
    id: 'RR-2491',
    merchant: 'Dapur Bu Tini',
    item: 'Paket Nasi Surplus',
    date: '12 Agustus 2026',
    price: 25000,
    status: 'Selesai',
  },
  {
    id: 'RR-2487',
    merchant: 'Roti Bakar Bang Johan',
    item: 'Paket Roti Campur',
    date: '10 Agustus 2026',
    price: 18000,
    status: 'Diambil',
  },
  {
    id: 'RR-2480',
    merchant: 'Kopi Nusantara',
    item: 'Paket Kopi Barista',
    date: '8 Agustus 2026',
    price: 15000,
    status: 'Diproses',
  },
  {
    id: 'RR-2472',
    merchant: 'Segar Bahari',
    item: 'Paket Ikan Segar',
    date: '6 Agustus 2026',
    price: 32000,
    status: 'Selesai',
  },
];

interface Stat {
  icon: LucideIcon;
  value: string;
  unit?: string;
  label: string;
  chip: string;
}

const STATS: Stat[] = [
  {
    icon: Utensils,
    value: '128',
    unit: 'porsi',
    label: 'Porsi Diselamatkan',
    chip: 'bg-green-50 text-green-700',
  },
  {
    icon: Receipt,
    value: '46',
    unit: 'x',
    label: 'Total Pesanan',
    chip: 'bg-sage-100 text-sage-600',
  },
  {
    icon: PiggyBank,
    value: 'Rp 742.000',
    label: 'Penghematan',
    chip: 'bg-gold-100 text-gold-600',
  },
];

const STATUS_STYLE: Record<
  OrderStatus,
  { icon: LucideIcon; className: string }
> = {
  Selesai: { icon: Check, className: 'bg-green-50 text-green-700' },
  Diambil: { icon: Package, className: 'bg-sage-100 text-sage-600' },
  Diproses: { icon: Clock, className: 'bg-gold-100 text-gold-600' },
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50';

/* ─────────────────────────  Sub-komponen  ───────────────────────── */

function ProfileNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline/70 bg-cream-50/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest text-white">
            <Leaf className="h-4 w-4" />
          </span>
          <span className="font-display text-2xl font-bold tracking-tight text-forest-deep">
            ReBites
          </span>
        </Link>

        <Link
          href="/#menu"
          className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 font-inter text-sm font-semibold text-white transition-colors duration-300 hover:bg-forest-dark"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Cari Makanan Terselamatkan</span>
          <span className="sm:hidden">Cari</span>
        </Link>
      </div>
    </header>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const { icon: Icon, className } = STATUS_STYLE[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-inter text-xs font-semibold',
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {status}
    </span>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  chip,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  chip: string;
}) {
  return (
    <li className="flex items-center gap-3.5">
      <span
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
          chip
        )}
      >
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <div className="min-w-0">
        <p className="font-inter text-[11px] font-medium uppercase tracking-wider text-stone">
          {label}
        </p>
        <p className="truncate font-inter text-sm font-medium text-forest-deep">
          {value}
        </p>
      </div>
    </li>
  );
}

/* ─────────────────────────  Sidebar kiri  ───────────────────────── */

function ProfileSidebar() {
  const [editing, setEditing] = useState(false);

  return (
    <aside className="space-y-5 lg:sticky lg:top-24 lg:h-fit">
      {/* Card profil utama */}
      <section className="rounded-3xl border border-hairline/70 bg-white p-6 text-center shadow-[0_24px_48px_-32px_rgba(42,55,49,0.35)]">
        <div className="relative mx-auto h-24 w-24">
          <span className="absolute -inset-1.5 rounded-full border border-sage-500/40" />
          <span className="absolute -inset-3 rounded-full border border-dashed border-sage-500/30" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-forest to-forest-deep font-display text-2xl font-semibold text-white ring-4 ring-cream-100">
            AI
          </div>
        </div>

        <h2 className="mt-4 font-display text-xl font-semibold text-forest-deep">
          Alta Irecom
        </h2>
        <p className="mt-1 flex items-center justify-center gap-1.5 font-inter text-sm text-stone">
          <MapPin className="h-3.5 w-3.5 text-sage-600" />
          Depok, Jawa Barat
        </p>

        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-sage-100 px-3.5 py-1 font-inter text-xs font-semibold text-sage-600">
          <User className="h-3.5 w-3.5" />
          Akun Pembeli
        </span>

        <button
          type="button"
          onClick={() => setEditing((v) => !v)}
          className={cn(
            'mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border px-5 py-2.5 font-inter text-sm font-semibold transition-colors duration-300',
            editing
              ? 'bg-forest text-white'
              : 'border-forest/30 text-forest hover:bg-forest hover:text-white',
            FOCUS_RING
          )}
        >
          <Pencil className="h-4 w-4" />
          {editing ? 'Menyimpan…' : 'Edit Profil'}
        </button>
        {editing && (
          <p className="mt-3 font-inter text-xs text-stone">
            Mode edit (simulasi) — lengkapi di pengembangan berikutnya.
          </p>
        )}
      </section>

      {/* Card data akun */}
      <section className="rounded-3xl border border-hairline/70 bg-white p-6 shadow-[0_24px_48px_-32px_rgba(42,55,49,0.35)]">
        <h3 className="font-display text-base font-semibold text-forest-deep">
          Data Akun
        </h3>
        <ul className="mt-4 space-y-4">
          <InfoRow
            icon={Mail}
            label="Email"
            value="alta@rebites.id"
            chip="bg-green-50 text-green-700"
          />
          <InfoRow
            icon={Phone}
            label="No. HP"
            value="+62 812-3456-7890"
            chip="bg-sage-100 text-sage-600"
          />
          <InfoRow
            icon={Calendar}
            label="Tanggal Bergabung"
            value="14 Maret 2026"
            chip="bg-gold-100 text-gold-600"
          />
        </ul>
      </section>
    </aside>
  );
}

/* ─────────────────────────  Kolom utama  ───────────────────────── */

function EcoImpactBanner() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-hairline/70 shadow-[0_32px_64px_-40px_rgba(42,55,49,0.6)]">
      <Image
        src={BANNER_IMAGE}
        alt="Sayuran segar hasil penyelamatan makanan, tampilan dekat di atas meja krem"
        fill
        priority
        sizes="(min-width: 1024px) 70vw, 100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-forest-deep/95 via-forest-deep/75 to-forest-deep/25" />

      {/* ornamen lembut */}
      <Sparkles className="pointer-events-none absolute right-10 top-8 h-5 w-5 text-gold-500/60" />
      <Leaf className="pointer-events-none absolute -bottom-8 -right-6 h-40 w-40 text-white/10" strokeWidth={1.2} />

      <div className="relative px-7 py-12 sm:px-10 sm:py-16 lg:px-14">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 font-inter text-xs font-semibold tracking-wide text-cream-100 backdrop-blur-sm">
          <Leaf className="h-3.5 w-3.5 text-gold-500" />
          Dampak Pribadimu
        </span>
        <h2 className="mt-5 max-w-2xl font-display text-[clamp(1.6rem,3vw,2.4rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-cream-50 [text-shadow:0_2px_24px_rgba(15,26,20,0.5)]">
          &ldquo;Setiap porsi yang kamu selamatkan adalah napas baru bagi
          bumi.&rdquo;
        </h2>
        <p className="mt-4 max-w-xl font-inter text-sm leading-relaxed text-cream-100/80 sm:text-[0.95rem]">
          Dalam 6 bulan terakhir, kamu membantu mengurangi ratusan porsi
          makanan terbuang sia-sia — berhemat sambil menjaga planet.
        </p>
      </div>
    </section>
  );
}

function ImpactStats() {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {STATS.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-hairline/70 bg-white p-5 shadow-[0_20px_40px_-32px_rgba(42,55,49,0.35)]"
        >
          <span
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full',
              stat.chip
            )}
          >
            <stat.icon className="h-5 w-5" />
          </span>
          <p className="mt-4 font-display text-3xl font-semibold text-forest-deep">
            {stat.value}
            {stat.unit && (
              <span className="ml-1 text-base font-medium text-stone">
                {stat.unit}
              </span>
            )}
          </p>
          <p className="mt-1 font-inter text-sm text-stone">{stat.label}</p>
        </div>
      ))}
    </section>
  );
}

function AddressAndSubscription() {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {/* Alamat utama */}
      <div className="rounded-2xl border border-hairline/70 bg-white p-6 shadow-[0_20px_40px_-32px_rgba(42,55,49,0.35)]">
        <div className="flex items-start justify-between gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-700">
            <MapPin className="h-5 w-5" />
          </span>
          <span className="rounded-full bg-sage-100 px-3 py-1 font-inter text-xs font-semibold text-sage-600">
            Utama
          </span>
        </div>
        <h3 className="mt-4 font-display text-base font-semibold text-forest-deep">
          Alamat Pengiriman Utama
        </h3>
        <p className="mt-1.5 font-inter text-sm leading-relaxed text-stone">
          Jl. Melati No. 12, Kec. Beji, Kota Depok, Jawa Barat 16422
        </p>
        <Link
          href="#"
          className="mt-4 inline-flex items-center gap-1.5 font-inter text-sm font-semibold text-forest hover:text-forest-dark"
        >
          <Pencil className="h-3.5 w-3.5" />
          Ubah Alamat
        </Link>
      </div>

      {/* Langganan ReBites Plus */}
      <div className="grain-overlay relative overflow-hidden rounded-2xl bg-forest-deep p-6 text-cream-50 shadow-[0_20px_40px_-32px_rgba(42,55,49,0.7)]">
        <Sparkles className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 text-white/10" />
        <div className="flex items-center justify-between">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-100/20 text-gold-500">
            <Crown className="h-5 w-5" />
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 font-inter text-xs font-semibold text-gold-500">
            <Sparkles className="h-3 w-3" />
            Aktif
          </span>
        </div>
        <h3 className="mt-4 font-display text-lg font-semibold">ReBites Plus</h3>
        <p className="mt-1 font-inter text-sm text-cream-100/80">
          Berlaku hingga{' '}
          <span className="font-semibold text-cream-50">21 September 2026</span>
        </p>
        <p className="mt-3 font-inter text-xs leading-relaxed text-cream-100/60">
          Perpanjangan otomatis setiap bulan. Batalkan kapan saja di
          pengaturan.
        </p>
        <button
          type="button"
          className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-gold-500/50 px-4 py-2 font-inter text-xs font-semibold text-gold-500 transition-colors duration-300 hover:bg-gold-500 hover:text-forest-deep"
        >
          Kelola Langganan
        </button>
      </div>
    </section>
  );
}

function OrderHistory() {
  return (
    <section className="rounded-3xl border border-hairline/70 bg-white shadow-[0_24px_48px_-32px_rgba(42,55,49,0.35)]">
      <div className="flex items-center justify-between px-6 pt-6">
        <h3 className="font-display text-lg font-semibold text-forest-deep">
          Riwayat Pesanan
        </h3>
        <Link
          href="#"
          className="inline-flex items-center gap-1.5 font-inter text-sm font-semibold text-forest hover:text-forest-dark"
        >
          Lihat Semua
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Tabel — layar md ke atas */}
      <div className="hidden overflow-x-auto px-6 pb-6 md:block">
        <table className="mt-3 w-full text-left">
          <thead>
            <tr className="border-b border-hairline font-inter text-xs font-semibold uppercase tracking-wider text-stone">
              <th className="pb-3 pr-4">No. Pesanan</th>
              <th className="pb-3 pr-4">Merchant &amp; Paket</th>
              <th className="pb-3 pr-4">Tanggal</th>
              <th className="pb-3 pr-4">Harga</th>
              <th className="pb-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {ORDERS.map((order) => (
              <tr
                key={order.id}
                className="border-b border-hairline/60 transition-colors duration-200 last:border-b-0 hover:bg-cream-100/60"
              >
                <td className="py-4 pr-4 font-inter text-sm font-semibold text-forest-deep">
                  {order.id}
                </td>
                <td className="py-4 pr-4">
                  <p className="font-inter text-sm font-medium text-forest-deep">
                    {order.merchant}
                  </p>
                  <p className="font-inter text-xs text-stone">{order.item}</p>
                </td>
                <td className="py-4 pr-4 font-inter text-sm text-stone">
                  {order.date}
                </td>
                <td className="py-4 pr-4 font-inter text-sm font-semibold text-forest-deep">
                  Rp {order.price.toLocaleString('id-ID')}
                </td>
                <td className="py-4 text-right">
                  <StatusBadge status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Kartu — layar di bawah md */}
      <ul className="divide-y divide-hairline/60 px-6 pb-6 md:hidden">
        {ORDERS.map((order) => (
          <li key={order.id} className="flex items-center justify-between gap-4 py-4">
            <div className="min-w-0">
              <p className="font-inter text-sm font-semibold text-forest-deep">
                {order.id}
              </p>
              <p className="truncate font-inter text-sm text-forest-deep">
                {order.merchant}
              </p>
              <p className="font-inter text-xs text-stone">
                {order.item} · {order.date}
              </p>
              <p className="mt-1 font-inter text-sm font-semibold text-forest-deep">
                Rp {order.price.toLocaleString('id-ID')}
              </p>
            </div>
            <StatusBadge status={order.status} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ─────────────────────────  Halaman  ───────────────────────── */

export function UserProfile() {
  return (
    <div className="min-h-screen bg-cream-50">
      <ProfileNavbar />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pt-12">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <p className="font-inter text-xs font-semibold uppercase tracking-widest text-sage-600">
            Akun Saya
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-[-0.02em] text-forest-deep sm:text-4xl">
            Profil Pengguna
          </h1>
          <p className="mt-2 max-w-2xl font-inter text-sm leading-relaxed text-stone">
            Kelola profil, alamat pengiriman, langganan, dan pantau dampak
            penyelamatan makanan yang sudah kamu lakukan.
          </p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          className="mt-8 grid gap-6 lg:grid-cols-[300px_1fr] xl:grid-cols-[340px_1fr]"
        >
          <ProfileSidebar />

          <div className="min-w-0 space-y-6">
            <EcoImpactBanner />
            <ImpactStats />
            <AddressAndSubscription />
            <OrderHistory />
          </div>
        </motion.div>
      </main>
    </div>
  );
}
