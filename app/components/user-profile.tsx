'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  Clock,
  Coins,
  Leaf,
  Mail,
  MapPin,
  Package,
  Phone,
  Receipt,
  Sparkles,
  Star,
  Store,
  User,
  Utensils,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useSellerStatus } from '@/hooks/use-seller-status';
import { useCurrentUser } from '@/lib/current-user';
import { getUserOrders } from '@/lib/order-storage';
import { useAddresses } from '@/hooks/use-addresses';
import { useRebitesCoins } from '@/hooks/use-rebites-coins';
import { useFollowedStores } from '@/hooks/use-followed-stores';
import { formatOrderDateTime } from '@/lib/order-utils';
import { formatRupiah } from '@/lib/data';
import type { StoredOrder } from '@/lib/types';
import { ProfileNavbar } from './navbar';
import { SmartImage } from './SmartImage';
import {
  ArcLines,
  DotPattern,
  FloatingLeaf,
  LeafSprig,
  SoftBlob,
} from './ornaments';

const BANNER_IMAGE =
  'https://images.pexels.com/photos/406152/pexels-photo-406152.jpeg?auto=compress&cs=tinysrgb&w=1600';

type OrderBadgeStatus = 'Selesai' | 'Diproses';

const STATUS_STYLE: Record<
  OrderBadgeStatus,
  { icon: LucideIcon; className: string }
> = {
  Selesai: { icon: Check, className: 'bg-green-50 text-green-700' },
  Diproses: { icon: Clock, className: 'bg-gold-100 text-gold-600' },
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const VIEWPORT = { once: true, amount: 0.15 } as const;

function StatusBadge({ order }: { order: StoredOrder }) {
  const status: OrderBadgeStatus =
    order.status === 'completed' ? 'Selesai' : 'Diproses';
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

function SectionSkeletonRows({ rows = 3 }: { rows?: number }) {
  return (
    <div aria-hidden className="space-y-2.5">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-4 w-full animate-pulse rounded-full bg-cream-100" />
      ))}
    </div>
  );
}

interface InfoRowProps {
  icon: LucideIcon;
  label: string;
  value: string;
  chip: string;
}

function InfoRow({ icon: Icon, label, value, chip }: InfoRowProps) {
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

function ProfileSidebar() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [joinedAt, setJoinedAt] = useState('');
  const { isSeller } = useSellerStatus();
  const { selectedAddress, addresses, loading: addressLoading } = useAddresses();

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      const user = data.session?.user;
      if (!user) return;
      setFullName(user.user_metadata?.full_name ?? '');
      setEmail(user.email ?? '');
      if (user.created_at) {
        setJoinedAt(
          new Date(user.created_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        );
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const displayName = fullName.trim() || 'Akun ReBites';
  const initials = fullName.trim()
    ? fullName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('')
    : '';

  return (
    <aside className="space-y-5 lg:sticky lg:top-28 lg:h-fit">
      <section className="relative overflow-hidden rounded-3xl border border-hairline/70 bg-white p-6 text-center shadow-[0_24px_48px_-32px_rgba(42,55,49,0.35)]">
        <FloatingLeaf
          className="right-5 top-5 hidden h-4 w-4 text-sage-500/50 lg:block"
          delay={0.8}
        />
        <div className="relative mx-auto h-24 w-24">
          <span className="absolute -inset-1.5 rounded-full border border-sage-500/40" />
          <span className="absolute -inset-3 rounded-full border border-dashed border-sage-500/30" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-forest to-forest-deep font-display text-2xl font-semibold text-white ring-4 ring-cream-100">
            {initials || <User className="h-8 w-8" />}
          </div>
        </div>

        <h2 className="mt-4 font-display text-xl font-semibold text-forest-deep">
          {displayName}
        </h2>
        <p className="mt-1 flex items-center justify-center gap-1.5 font-inter text-sm text-stone">
          <MapPin className="h-3.5 w-3.5 text-sage-600" />
          {addressLoading
            ? 'Memuat…'
            : selectedAddress?.city
              ? `${selectedAddress.city}, Indonesia`
              : 'Depok, Jawa Barat'}
        </p>

        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-sage-100 px-3.5 py-1 font-inter text-xs font-semibold text-sage-600">
          {isSeller ? (
            <>
              <Store className="h-3.5 w-3.5" />
              Akun Penjual
            </>
          ) : (
            <>
              <User className="h-3.5 w-3.5" />
              Akun Pembeli
            </>
          )}
        </span>
      </section>

      <section className="relative overflow-hidden rounded-3xl border border-hairline/70 bg-white p-6 shadow-[0_24px_48px_-32px_rgba(42,55,49,0.35)]">
        <SoftBlob className="-right-10 -top-12 h-32 w-32 bg-sage-100/70" />
        <h3 className="relative font-display text-base font-semibold text-forest-deep">
          Data Akun
        </h3>
        <ul className="relative mt-4 space-y-4">
          <InfoRow
            icon={Mail}
            label="Email"
            value={email || '—'}
            chip="bg-green-50 text-green-700"
          />
          <InfoRow
            icon={Phone}
            label="No. HP"
            value={
              addressLoading ? 'Memuat…' : selectedAddress?.phone || '—'
            }
            chip="bg-sage-100 text-sage-600"
          />
          <InfoRow
            icon={Package}
            label="Tanggal Bergabung"
            value={joinedAt || '—'}
            chip="bg-gold-100 text-gold-600"
          />
        </ul>
      </section>
    </aside>
  );
}

function EcoImpactBanner({ savedPorsi }: { savedPorsi: number }) {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="relative overflow-hidden rounded-3xl border border-hairline/70 shadow-[0_32px_64px_-40px_rgba(42,55,49,0.6)]"
    >
      <Image
        src={BANNER_IMAGE}
        alt="Sayuran segar hasil penyelamatan makanan, tampilan dekat di atas meja krem"
        fill
        priority
        sizes="(min-width: 1024px) 70vw, 100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-forest-deep/95 via-forest-deep/75 to-forest-deep/25" />

      <Sparkles className="pointer-events-none absolute right-10 top-8 h-5 w-5 text-gold-500/60" />
      <FloatingLeaf className="bottom-10 right-16 hidden h-5 w-5 text-gold-500/50 lg:block" delay={1.4} />
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
          {savedPorsi > 0
            ? `Sejauh ini kamu sudah menyelamatkan ${savedPorsi.toLocaleString('id-ID')} porsi makanan — berhemat sambil menjaga planet.`
            : 'Belum ada porsi terselamatkan. Pesanan pertamamu adalah langkah kecil yang berarti bagi bumi.'}
        </p>
      </div>
    </motion.section>
  );
}

interface ImpactStat {
  icon: LucideIcon;
  value: string;
  unit?: string;
  label: string;
  chip: string;
}

function ImpactStats({
  porsi,
  totalPesanan,
  co2eKg,
  loading,
}: {
  porsi: number;
  totalPesanan: number;
  co2eKg: number;
  loading: boolean;
}) {
  const stats: ImpactStat[] = [
    {
      icon: Utensils,
      value: loading ? '…' : porsi.toLocaleString('id-ID'),
      unit: 'porsi',
      label: 'Porsi Diselamatkan',
      chip: 'bg-gold-500/15 text-gold-500',
    },
    {
      icon: Receipt,
      value: loading ? '…' : totalPesanan.toLocaleString('id-ID'),
      unit: 'x',
      label: 'Total Pesanan',
      chip: 'bg-sage-500/20 text-sage-500',
    },
    {
      icon: Leaf,
      value: loading
        ? '…'
        : co2eKg.toLocaleString('id-ID', { maximumFractionDigits: 1 }),
      unit: 'kg',
      label: 'CO₂e Terselamatkan',
      chip: 'bg-green-50/15 text-green-50',
    },
  ];

  return (
    <motion.section
      id="dampak"
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      className="grain-overlay relative scroll-mt-28 overflow-hidden rounded-3xl bg-forest-deep p-6 shadow-[0_32px_64px_-40px_rgba(42,55,49,0.7)] sm:p-8"
    >
      <SoftBlob className="-left-20 -top-20 h-64 w-64 bg-white/5" />
      <SoftBlob className="-bottom-24 -right-20 h-72 w-72 bg-green-700/25" />
      <DotPattern className="right-8 top-8 hidden h-20 w-20 text-white/10 lg:block" />
      <FloatingLeaf className="left-6 top-6 hidden h-5 w-5 text-gold-500/60 lg:block" />

      <motion.div variants={fadeUp} className="relative">
        <p className="font-inter text-xs font-semibold uppercase tracking-widest text-gold-500">
          Dampak Lingkungan
        </p>
        <h3 className="mt-2 font-display text-xl font-semibold text-cream-50 sm:text-2xl">
          Dampakmu untuk Bumi
        </h3>
        <p className="mt-1 max-w-xl font-inter text-sm leading-relaxed text-cream-100/70">
          Setiap pesanan mengurangi sisa pangan yang berakhir di tempat
          pembuangan akhir.
        </p>
      </motion.div>

      {loading ? (
        <div className="relative mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              aria-hidden
              className="h-36 animate-pulse rounded-2xl border border-white/10 bg-white/5"
            />
          ))}
        </div>
      ) : (
        <>
          <motion.div
            variants={stagger}
            className="relative mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
              >
                <span
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full',
                    stat.chip
                  )}
                >
                  <stat.icon className="h-5 w-5" />
                </span>
                <p className="mt-4 font-display text-3xl font-semibold text-white">
                  {stat.value}
                  {stat.unit && (
                    <span className="ml-1 text-base font-medium text-white/60">
                      {stat.unit}
                    </span>
                  )}
                </p>
                <p className="mt-1 font-inter text-sm text-cream-100/70">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
          {totalPesanan === 0 && (
            <p className="relative mt-4 font-inter text-xs text-cream-100/60">
              Belum ada pesanan — statistik akan terisi otomatis begitu kamu
              memesan.
            </p>
          )}
        </>
      )}
    </motion.section>
  );
}

function CoinsAndAddress() {
  const { balance, totalEarned } = useRebitesCoins();
  const { selectedAddress, addresses, loading } = useAddresses();

  return (
    <div className="relative">
      <SoftBlob className="-bottom-16 -left-16 hidden h-56 w-56 bg-gold-100/50 lg:block" />
      <motion.section
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        className="relative grid gap-4 md:grid-cols-2"
      >
        <motion.div
          variants={fadeUp}
          className="grain-overlay relative overflow-hidden rounded-2xl bg-forest-deep p-6 text-cream-50 shadow-[0_20px_40px_-32px_rgba(42,55,49,0.7)]"
        >
          <Sparkles className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 text-white/10" />
          <FloatingLeaf
            className="right-8 bottom-8 hidden h-5 w-5 text-gold-500/50 lg:block"
            delay={1.1}
          />
          <div className="flex items-start justify-between gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-100/20 text-gold-500">
              <Coins className="h-5 w-5" />
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 font-inter text-xs font-semibold text-gold-500">
              <Sparkles className="h-3 w-3" />
              ReBites Coins
            </span>
          </div>
          <p className="mt-4 font-display text-3xl font-semibold tabular-nums text-cream-50">
            {balance.toLocaleString('id-ID')}
          </p>
          <p className="mt-1 font-inter text-sm text-cream-100/80">
            Total didapat:{' '}
            <span className="font-semibold text-cream-50">
              {totalEarned.toLocaleString('id-ID')} Coin
            </span>
          </p>
          <p className="mt-3 font-inter text-xs leading-relaxed text-cream-100/60">
            Koin didapat dari tiap pesanan selesai dan bisa dipakai untuk
            memotong harga checkout berikutnya.
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="rounded-2xl border border-hairline/70 bg-white p-6 shadow-[0_20px_40px_-32px_rgba(42,55,49,0.35)]"
        >
          <div className="flex items-start justify-between gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-700">
              <MapPin className="h-5 w-5" />
            </span>
            {selectedAddress && (
              <span className="rounded-full bg-sage-100 px-3 py-1 font-inter text-xs font-semibold text-sage-600 capitalize">
                {selectedAddress.label}
              </span>
            )}
          </div>
          <h3 className="mt-4 font-display text-base font-semibold text-forest-deep">
            Alamat Pengiriman Utama
          </h3>
          {loading ? (
            <div className="mt-3">
              <SectionSkeletonRows rows={2} />
            </div>
          ) : selectedAddress ? (
            <>
              <p className="mt-1.5 font-inter text-sm font-medium text-charcoal-900">
                {selectedAddress.receiverName}
                {selectedAddress.phone ? (
                  <span className="ml-2 font-normal text-stone">
                    · {selectedAddress.phone}
                  </span>
                ) : null}
              </p>
              <p className="mt-1 font-inter text-sm leading-relaxed text-stone">
                {selectedAddress.fullAddress}
              </p>
              {addresses.length > 1 && (
                <p className="mt-2 font-inter text-xs text-sage-500">
                  +{addresses.length - 1} alamat lainnya tersimpan
                </p>
              )}
            </>
          ) : (
            <p className="mt-1.5 font-inter text-sm leading-relaxed text-stone">
              Belum ada alamat tersimpan. Alamat ditambahkan otomatis saat kamu
              melakukan checkout pengiriman pertama.
            </p>
          )}
        </motion.div>
      </motion.section>
    </div>
  );
}

function OrderHistory({
  orders,
  loading,
}: {
  orders: StoredOrder[] | null;
  loading: boolean;
}) {
  return (
    <div className="relative">
      <LeafSprig className="-right-6 -top-8 hidden h-36 w-36 rotate-12 text-sage-500/25 lg:block" />
      <motion.section
        id="riwayat"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.12 }}
        className="relative scroll-mt-28 rounded-3xl border border-hairline/70 bg-white shadow-[0_24px_48px_-32px_rgba(42,55,49,0.35)]"
      >
        <div className="flex items-center justify-between px-6 pt-6">
          <h3 className="font-display text-lg font-semibold text-forest-deep">
            Riwayat Pesanan
          </h3>
          {!loading && orders && orders.length > 0 && (
            <Link
              href="/riwayatPesanan"
              className="inline-flex items-center gap-1.5 font-inter text-sm font-semibold text-forest hover:text-forest-dark"
            >
              Lihat Semua
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="px-6 pb-6 pt-4">
            <SectionSkeletonRows rows={4} />
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="mx-6 mb-6 mt-4 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-sage-100 bg-cream-50/70 px-6 py-10 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sage-100 text-sage-500">
              <Receipt className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-charcoal-900">
                Belum ada pesanan
              </p>
              <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-sage-500">
                Riwayat pesananmu akan tampil di sini setelah checkout
                pertama.
              </p>
            </div>
            <Link
              href="/home#umkm"
              className="inline-flex items-center gap-1.5 rounded-full bg-green-700 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-green-700/25 transition-colors hover:bg-green-600"
            >
              Jelajahi Toko
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto px-6 pb-6 md:block">
              <table className="mt-3 w-full text-left">
                <thead>
                  <tr className="border-b border-hairline font-inter text-xs font-semibold uppercase tracking-wider text-stone">
                    <th className="pb-3 pr-4">No. Pesanan</th>
                    <th className="pb-3 pr-4">Toko &amp; Paket</th>
                    <th className="pb-3 pr-4">Tanggal</th>
                    <th className="pb-3 pr-4">Harga</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.orderId}
                      className="border-b border-hairline/60 transition-colors duration-200 last:border-b-0 hover:bg-cream-100/60"
                    >
                      <td className="py-4 pr-4 font-inter text-sm font-semibold text-forest-deep">
                        {order.orderId}
                      </td>
                      <td className="py-4 pr-4">
                        <p className="font-inter text-sm font-medium text-forest-deep">
                          {order.vendorName}
                        </p>
                        <p className="font-inter text-xs text-stone">
                          {order.productName}
                        </p>
                      </td>
                      <td className="py-4 pr-4 font-inter text-sm text-stone">
                        {formatOrderDateTime(order.createdAt)}
                      </td>
                      <td className="py-4 pr-4 font-inter text-sm font-semibold text-forest-deep">
                        {formatRupiah(order.total)}
                      </td>
                      <td className="py-4 text-right">
                        <StatusBadge order={order} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-hairline/60 px-6 pb-6 md:hidden">
              {orders.map((order) => (
                <li
                  key={order.orderId}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div className="min-w-0">
                    <p className="font-inter text-sm font-semibold text-forest-deep">
                      {order.orderId}
                    </p>
                    <p className="truncate font-inter text-sm text-forest-deep">
                      {order.vendorName}
                    </p>
                    <p className="font-inter text-xs text-stone">
                      {order.productName} ·{' '}
                      {formatOrderDateTime(order.createdAt)}
                    </p>
                    <p className="mt-1 font-inter text-sm font-semibold text-forest-deep">
                      {formatRupiah(order.total)}
                    </p>
                  </div>
                  <StatusBadge order={order} />
                </li>
              ))}
            </ul>
          </>
        )}
      </motion.section>
    </div>
  );
}

function FollowedStoresSection() {
  const { stores, hydrated } = useFollowedStores();

  return (
    <motion.section
      id="toko-diikuti"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      className="relative scroll-mt-28 rounded-3xl border border-hairline/70 bg-white p-6 shadow-[0_24px_48px_-32px_rgba(42,55,49,0.35)]"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold text-forest-deep">
            Toko Diikuti
          </h3>
          <p className="mt-0.5 font-inter text-xs text-stone">
            Toko yang kamu ikuti lewat tombol “Ikuti Toko” di halaman detail
            toko.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-sage-100 px-3 py-1 font-inter text-xs font-semibold text-sage-600">
          {hydrated ? stores.length : '…'} toko
        </span>
      </div>

      {!hydrated ? (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              aria-hidden
              className="h-28 animate-pulse rounded-2xl bg-cream-50"
            />
          ))}
        </div>
      ) : stores.length === 0 ? (
        <div className="mt-4 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-sage-100 bg-cream-50/70 px-6 py-10 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sage-100 text-sage-500">
            <Store className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-bold text-charcoal-900">
              Belum ada toko yang diikuti
            </p>
            <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-sage-500">
              Tekan tombol “Ikuti Toko” pada halaman detail toko favoritmu agar
              tampil di sini.
            </p>
          </div>
          <Link
            href="/home#umkm"
            className="inline-flex items-center gap-1.5 rounded-full border border-green-700 px-4 py-2 text-xs font-semibold text-green-700 transition-colors hover:bg-green-700 hover:text-white"
          >
            Jelajahi Toko
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <li key={store.umkmId}>
              <Link
                href={`/detail/toko?id=${store.slug ?? store.umkmId}`}
                className="group flex h-full items-center gap-3.5 rounded-2xl border border-hairline/70 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-caramel/40 hover:shadow-lg hover:shadow-forest-900/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-sage-100 ring-1 ring-sage-100">
                  {store.logoUrl ? (
                    <SmartImage src={store.logoUrl} alt={`Logo ${store.name}`} />
                  ) : (
                    <span className="font-display text-lg font-semibold text-green-700">
                      {store.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-inter text-sm font-bold text-charcoal-900">
                    {store.name}
                  </span>
                  {store.category && (
                    <span className="mt-0.5 block truncate font-inter text-xs text-stone">
                      {store.category}
                    </span>
                  )}
                  <span className="mt-1 flex items-center gap-1 font-inter text-xs font-semibold text-charcoal-900">
                    <Star className="h-3 w-3 fill-gold-500 text-gold-500" />
                    {store.rating.toFixed(1)}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-sage-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-green-700" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </motion.section>
  );
}

export function UserProfile() {
  const { userId } = useCurrentUser();
  const [orders, setOrders] = useState<StoredOrder[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    getUserOrders(userId).then((list) => {
      if (!cancelled) setOrders(list);
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const { savedPorsi, totalPesanan, co2eKg } = useMemo(() => {
    if (!orders) return { savedPorsi: 0, totalPesanan: 0, co2eKg: 0 };
    return {
      savedPorsi: orders.reduce((sum, o) => sum + (o.quantity ?? 0), 0),
      totalPesanan: orders.length,
      co2eKg: orders.reduce(
        (sum, o) => sum + Number(o.co2eSavedKg ?? 0),
        0
      ),
    };
  }, [orders]);

  return (
    <div className="relative min-h-screen bg-cream-50">
      <ProfileNavbar />

      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <SoftBlob className="-left-32 -top-24 h-96 w-96 bg-sage-100/70" />
        <SoftBlob className="-right-32 top-40 h-[26rem] w-[26rem] bg-gold-100/50" />
        <SoftBlob className="bottom-24 left-1/3 h-80 w-80 bg-green-50/80" />
        <ArcLines className="-right-10 top-24 hidden h-[380px] w-[720px] text-sage-500/20 lg:block" />
        <DotPattern className="left-8 top-64 hidden h-24 w-24 text-green-700/10 lg:block" />
        <FloatingLeaf
          className="right-12 top-72 hidden h-5 w-5 text-sage-500/40 lg:block"
          delay={1.2}
        />
        <LeafSprig className="-left-8 top-40 hidden h-44 w-44 -rotate-12 text-sage-500/25 lg:block" />
      </div>

      <main className="relative mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8 lg:pt-28">
        <motion.header
          id="profil"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="scroll-mt-28"
        >
          <p className="font-inter text-xs font-semibold uppercase tracking-widest text-sage-600">
            Akun Saya
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-[-0.02em] text-forest-deep sm:text-4xl">
            Profil Pengguna
          </h1>
          <p className="mt-2 max-w-2xl font-inter text-sm leading-relaxed text-stone">
            Kelola profil, pantau dampak penyelamatan makanan, lihat toko yang
            kamu ikuti, dan tinjau riwayat pesananmu.
          </p>
        </motion.header>

        <div className="mt-10 grid gap-6 lg:grid-cols-[300px_1fr] xl:grid-cols-[340px_1fr]">
          <ProfileSidebar />

          <div className="min-w-0 space-y-6">
            <EcoImpactBanner savedPorsi={savedPorsi} />
            <ImpactStats
              porsi={savedPorsi}
              totalPesanan={totalPesanan}
              co2eKg={co2eKg}
              loading={orders === null}
            />
            <CoinsAndAddress />
            <OrderHistory orders={orders} loading={orders === null} />
            <FollowedStoresSection />
          </div>
        </div>
      </main>
    </div>
  );
}
