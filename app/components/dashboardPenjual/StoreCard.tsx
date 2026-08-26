'use client';

import Link from 'next/link';
import { ArrowUpRight, BadgeCheck, Store } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from './Card';
import { QuickActionsRow } from './QuickActionsRow';
import { DotPattern, LeafSprig } from './decor';
import { useSellerPlan } from '@/lib/seller-plan';
import { getSellerUmkm } from '@/lib/product-storage';
import { supabase } from '@/lib/supabase';
import {
  getSellerStoreSettings,
  setStoreOpen,
  STORE_SETTINGS_UPDATED_EVENT,
} from '@/lib/store-settings-storage';
import { useEffect, useState } from 'react';

export function StoreCard() {
  const { plan } = useSellerPlan();

  const [isOpen, setIsOpen] = useState(true);
  const [businessName, setBusinessName] = useState<string | null>(null);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [storeSlug, setStoreSlug] = useState<string | null>(null);
  const [ownerName, setOwnerName] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getSellerUmkm().then((umkm) => {
      if (cancelled) return;
      setBusinessName(umkm?.businessName ?? null);
      setStoreId(umkm?.id ?? null);
      setStoreSlug(umkm?.slug ?? null);
    });

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      const user = data.session?.user;
      if (!user) return;
      const metaName = user.user_metadata?.full_name;
      if (typeof metaName === 'string' && metaName.trim()) {
        setOwnerName(metaName.trim());
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const refresh = () => {
      getSellerStoreSettings().then((settings) => {
        if (settings) setIsOpen(settings.isOpen);
      });
    };
    refresh();
    window.addEventListener(STORE_SETTINGS_UPDATED_EVENT, refresh);
    return () => {
      window.removeEventListener(STORE_SETTINGS_UPDATED_EVENT, refresh);
    };
  }, []);

  const handleToggleOpen = () => {
    const next = !isOpen;
    setStoreOpen(next).then((ok) => {
      if (ok) setIsOpen(next);
    });
  };

  const storeName = businessName ?? '';
  const displayedOwner = ownerName ?? '';

  return (
    <Card>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-charcoal-900">Profil Toko</h2>
        <span className="inline-flex items-center gap-1 rounded-full bg-sage-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-charcoal-900">
          <span className="h-3 w-3 rounded-full bg-gold-400" />
          Paket {plan.label}
        </span>
      </div>

      <div className="relative mt-4 overflow-hidden rounded-3xl bg-gradient-to-br from-forest-900 via-forest-800 to-green-600 p-6 text-cream-50 shadow-md shadow-forest-900/20">
        <DotPattern className="right-0 top-0 h-40 w-40 text-cream-50/10" />
        <LeafSprig className="-right-8 -top-6 h-44 w-44 text-cream-50/15" />

        <div className="relative flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cream-50/70">
              ReBites Partner
            </p>
            <p className="mt-2 inline-flex flex-wrap items-center gap-1.5 rounded-full bg-cream-50/15 px-2.5 py-1 text-[11px] font-semibold text-cream-50">
              {storeName || '—'}
              {plan.verifiedBadge && (
                <span className="inline-flex items-center gap-1 rounded-full bg-cream-50 text-forest-900">
                  <BadgeCheck className="h-3 w-3" />
                  Terverifikasi
                </span>
              )}
            </p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-50/15">
            <Store className="h-4 w-4 text-cream-50" />
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggleOpen}
          aria-pressed={isOpen}
          className={cn(
            'relative mt-5 inline-flex items-center gap-2.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors',
            isOpen
              ? 'border-cream-50/30 bg-cream-50/15 text-cream-50 hover:bg-cream-50/25'
              : 'border-gold-300/60 bg-gold-100/90 text-charcoal-900 hover:bg-gold-100'
          )}
        >
          <span
            className={cn(
              'relative inline-flex h-4 w-7 items-center rounded-full transition-colors',
              isOpen ? 'bg-green-500' : 'bg-sage-500'
            )}
          >
            <span
              className={cn(
                'absolute h-3 w-3 rounded-full bg-white transition-all',
                isOpen ? 'left-3.5' : 'left-0.5'
              )}
            />
          </span>
          {isOpen ? 'Toko Buka' : 'Toko Tutup'}
        </button>

        <div className="relative mt-6">
          <p className="font-display text-lg font-medium leading-tight text-cream-50">
            {displayedOwner || '—'}
          </p>
          <p className="mt-1 text-[11px] text-cream-50/60">
            {storeSlug
              ? `Partner ReBites · /${storeSlug}`
              : 'Partner ReBites'}
          </p>
        </div>
      </div>

      <Link
        href={`/detail/toko?id=${storeSlug ?? storeId ?? ''}`}
        className="mt-4 inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-full border border-sage-100 bg-white px-4 py-2.5 text-xs font-semibold text-charcoal-900 transition-colors hover:bg-cream-50"
      >
        <Store className="h-3.5 w-3.5 text-green-700" />
        Lihat Profil Toko
        <ArrowUpRight className="h-3.5 w-3.5 text-sage-500" />
      </Link>

      <QuickActionsRow />
    </Card>
  );
}
