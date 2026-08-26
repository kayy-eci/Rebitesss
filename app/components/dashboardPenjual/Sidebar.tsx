'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutGrid,
  Leaf,
  Settings,
  ShoppingBag,
  TrendingUp,
  Utensils,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DotPattern } from './decor';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;

  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutGrid,
    href: '/dashboard/penjual',
    exact: true,
  },
  {
    id: 'pesanan',
    label: 'Pesanan Masuk',
    icon: ShoppingBag,
    href: '/dashboard/penjual/pesanan',
  },
  {
    id: 'menu',
    label: 'Menu Saya',
    icon: Utensils,
    href: '/dashboard/penjual/menu',
  },
  {
    id: 'performa',
    label: 'Performa Toko',
    icon: TrendingUp,
    href: '/dashboard/penjual/performa',
  },
  {
    id: 'pengaturan',
    label: 'Pengaturan Toko',
    icon: Settings,
    href: '/dashboard/penjual/pengaturan',
  },
];

function useActiveHref(href: string, exact?: boolean) {
  const pathname = usePathname();
  if (!pathname) return false;
  return exact ? pathname === href : pathname.startsWith(href);
}

function NavItemLink({ item, onClose }: { item: NavItem; onClose?: () => void }) {
  const isActive = useActiveHref(item.href, item.exact);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClose}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
        isActive
          ? 'bg-sage-100 text-charcoal-900'
          : 'text-charcoal-500 hover:bg-sage-100/60 hover:text-charcoal-900'
      )}
    >
      <Icon
        className={cn(
          'h-[18px] w-[18px] shrink-0',
          isActive
            ? 'text-green-700'
            : 'text-sage-500 group-hover:text-green-700'
        )}
      />
      <span className="flex-1">{item.label}</span>
    </Link>
  );
}

function SidebarContent({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="relative flex h-full flex-col overflow-y-auto"
    >
      <DotPattern className="left-0 top-0 h-36 w-36 text-sage-100" />

      <div className="relative flex items-center gap-2.5 px-6 pb-6 pt-7">
        <Link
          href="/home"
          aria-label="Ke beranda ReBites"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-700 text-cream-50 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
        >
          <Leaf className="h-5 w-5" />
        </Link>
        <Link href="/home" className="min-w-0 flex-1">
          <p className="font-display text-xl font-semibold leading-none tracking-tight text-forest-900">
            ReBites
          </p>
          <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-sage-500">
            Food Rescue
          </p>
        </Link>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup menu navigasi"
          className="flex h-8 w-8 items-center justify-center rounded-full text-sage-500 transition-colors hover:bg-sage-100 lg:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="relative flex-1 space-y-1 px-4" aria-label="Navigasi dashboard penjual">
        {NAV_ITEMS.map((item) => (
          <NavItemLink key={item.id} item={item} onClose={onClose} />
        ))}
      </nav>
    </motion.div>
  );
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-charcoal-900/40 backdrop-blur-sm lg:hidden"
            aria-hidden
          />
        )}
      </AnimatePresence>

      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[280px] border-r border-sage-100 bg-cream-50 lg:block">
        <SidebarContent onClose={onClose} />
      </aside>

      <AnimatePresence>
        {open && (
          <motion.aside
            key="drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-y-0 left-0 z-50 w-[300px] bg-cream-50 lg:hidden"
          >
            <SidebarContent onClose={onClose} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
