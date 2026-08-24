'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Store,
  Boxes,
  HeartHandshake,
  Bookmark,
  Award,
  Leaf,
  Settings,
  X,
  Sprout,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const ORDER_NAV_ITEMS = [
  { label: 'Beranda', icon: LayoutDashboard, href: '/home' },
  { label: 'Temukan Makanan', icon: Store, href: '/home#rekomendasi' },
  { label: 'Pesanan Saya', icon: Boxes, href: '/riwayatPesanan' },
  { label: 'Donasi Makanan', icon: HeartHandshake, href: null },
  { label: 'Menu Tersimpan', icon: Bookmark, href: null },
  { label: 'Hadiah & Coin', icon: Award, href: null },
  { label: 'Laporan Dampak', icon: Leaf, href: null },
  { label: 'Pengaturan', icon: Settings, href: null },
] as const;

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

export function OrderSidebar({ open, onClose }: SidebarProps) {
  const [active, setActive] = useState(2);

  return (
    <>
      {open && (
        <button
          aria-label="Tutup menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-forest-deep/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col bg-green-700 text-cream transition-transform duration-300 lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-6 pt-7 pb-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
                <path
                  d="M12 20C7 18 4 13 4 8c6 0 11 3 12 9Z"
                  fill="currentColor"
                  opacity="0.35"
                />
                <path
                  d="M12 20c3-4 4-9 3-14-5 1-8 5-7 10"
                  fill="currentColor"
                  opacity="0.6"
                />
                <path
                  d="M12 20c-2-3-2-8 0-12 3 2 4 7 3 11"
                  fill="currentColor"
                  opacity="0.9"
                />
              </svg>
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-xl font-medium tracking-tight text-white">
                Rebites
              </span>
              <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.28em] text-cream/60">
                Eco Food Rescue
              </span>
            </span>
          </Link>

          <button
            aria-label="Tutup menu"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-cream/70 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4">
          <p className="px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-cream/40">
            Menu
          </p>
          <ul className="space-y-1">
            {ORDER_NAV_ITEMS.map((item, i) => {
              const isActive = active === i;
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      onClick={() => setActive(i)}
                      className={cn(
                        'group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-white/15 text-white shadow-[inset_0_0_0_1px_rgba(250,248,245,0.35)]'
                          : 'text-cream/60 hover:bg-white/5 hover:text-white'
                      )}
                    >
                      <NavItemIcon isActive={isActive} Icon={Icon} />
                      <span className="flex-1 text-left">{item.label}</span>
                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-sage-500" />
                      )}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      className={cn(
                        'group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-white/15 text-white shadow-[inset_0_0_0_1px_rgba(250,248,245,0.35)]'
                          : 'text-cream/60 hover:bg-white/5 hover:text-white'
                      )}
                    >
                      <NavItemIcon isActive={isActive} Icon={Icon} />
                      <span className="flex-1 text-left">{item.label}</span>
                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-sage-500" />
                      )}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        { }
        <div className="relative mx-4 mb-6 mt-4 overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/20">
          <Sprout className="pointer-events-none absolute -right-3 -bottom-4 h-24 w-24 text-white/10" />
          <div className="relative p-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-cream">
              <Sprout className="h-3 w-3" />
              ReBites
            </span>
            <p className="mt-3 font-display leading-snug text-white">
              Selamatkan makanan surplus dari UMKM sekitar.
            </p>
            <Link
              href="/home"
              className="group mt-3 flex items-center gap-1 text-xs font-medium text-cream/80 transition-colors hover:text-white"
            >
              Mulai belanja
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

function NavItemIcon({
  isActive,
  Icon,
}: {
  isActive: boolean;
  Icon: (typeof ORDER_NAV_ITEMS)[number]['icon'];
}) {
  return (
    <span
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
        isActive
          ? 'bg-sage-500 text-green-700'
          : 'bg-white/5 text-cream/60 group-hover:text-white'
      )}
    >
      <Icon className="h-4 w-4" strokeWidth={2.1} />
    </span>
  );
}
