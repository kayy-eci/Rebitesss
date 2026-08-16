'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Award,
  ChevronDown,
  CreditCard,
  Heart,
  LayoutGrid,
  Leaf,
  LifeBuoy,
  ShoppingBag,
  Sprout,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReferralCard } from './ReferralCard';
import { DotPattern } from './decor';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  active?: boolean;
  sub?: string[];
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, active: true },
  {
    id: 'pesanan',
    label: 'Pesanan Saya',
    icon: ShoppingBag,
    sub: ['Sedang Berlangsung', 'Riwayat'],
  },
  { id: 'favorit', label: 'Favorit', icon: Heart },
  { id: 'dampak', label: 'Dampak Saya', icon: Sprout },
  { id: 'poin', label: 'Poin & Reward', icon: Award },
  { id: 'pembayaran', label: 'Metode Pembayaran', icon: CreditCard },
  { id: 'bantuan', label: 'Bantuan', icon: LifeBuoy },
];

function SidebarContent({ onClose }: { onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="relative flex h-full flex-col overflow-y-auto"
    >
      <DotPattern className="left-0 top-0 h-36 w-36 text-sage-100" />

      <div className="relative flex items-center gap-2.5 px-6 pb-6 pt-7">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-700 text-cream-50">
          <Leaf className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="font-display text-xl font-semibold leading-none tracking-tight text-forest-900">
            ReBites
          </p>
          <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-sage-500">
            Food Rescue
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup menu navigasi"
          className="flex h-8 w-8 items-center justify-center rounded-full text-sage-500 transition-colors hover:bg-sage-100 lg:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="relative flex-1 space-y-1 px-4" aria-label="Navigasi dashboard pembeli">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const hasSub = !!item.sub;
          const isExpanded = expanded === item.id;

          return (
            <div key={item.id}>
              <Link
                href="#"
                onClick={(event) => {
                  if (hasSub) {
                    event.preventDefault();
                    setExpanded(isExpanded ? null : item.id);
                  }
                }}
                aria-expanded={hasSub ? isExpanded : undefined}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
                  item.active
                    ? 'bg-sage-100 text-charcoal-900'
                    : 'text-charcoal-500 hover:bg-sage-100/60 hover:text-charcoal-900'
                )}
              >
                <Icon
                  className={cn(
                    'h-[18px] w-[18px] shrink-0',
                    item.active
                      ? 'text-green-700'
                      : 'text-sage-500 group-hover:text-green-700'
                  )}
                />
                <span className="flex-1">{item.label}</span>
                {hasSub && (
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 text-sage-500 transition-transform',
                      isExpanded && 'rotate-180'
                    )}
                  />
                )}
              </Link>

              <AnimatePresence initial={false}>
                {hasSub && isExpanded && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    {item.sub?.map((sub) => (
                      <li key={sub}>
                        <Link
                          href="#"
                          className="ml-11 flex items-center gap-2 py-2 text-[13px] font-medium text-charcoal-500 transition-colors hover:text-green-700"
                        >
                          <span className="h-1 w-1 rounded-full bg-sage-500" />
                          {sub}
                        </Link>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      <div className="relative px-4 pb-6 pt-4">
        <ReferralCard />
      </div>
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
