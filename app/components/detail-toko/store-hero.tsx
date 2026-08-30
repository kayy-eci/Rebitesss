'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BadgeCheck,
  ChevronRight,
  Heart,
  MapPin,
  Star,
  UserPlus,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/app/components/shared/Badge';
import { SmartImage } from '@/app/components/shared/SmartImage';
import { DotPattern, LeafSprig } from '@/app/components/dashboard-penjual/decor';
import { STORE } from './data';

export function StoreHero() {
  const [following, setFollowing] = useState(false);

  return (
    <section>
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-primary via-primary to-primary sm:h-56">
        <DotPattern className="right-0 top-0 h-56 w-56 text-cream-50/10" />
        <LeafSprig className="-bottom-10 -right-6 h-56 w-56 text-cream-50/15" />
        <div className="relative mx-auto max-w-[1200px] px-5 pt-7 sm:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs font-medium text-cream-50/80"
          >
            <Link href="/" className="transition-colors hover:text-cream-50">
              Beranda
            </Link>
            <ChevronRight className="h-3 w-3 text-cream-50/50" />
            <span className="text-cream-50">Toko</span>
            <ChevronRight className="h-3 w-3 text-cream-50/50" />
            <span className="font-semibold text-cream-50">{STORE.name}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative -mt-14 sm:-mt-16"
        >
          <div className="rounded-3xl border border-sage-100 bg-white p-6 shadow-xl shadow-primary/10 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                <div className="relative -mt-16 h-28 w-28 shrink-0 overflow-hidden rounded-full ring-4 ring-white shadow-lg sm:-mt-20 sm:h-32 sm:w-32">
                  <SmartImage src={STORE.avatar} alt={`Foto ${STORE.name}`} />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-display text-2xl font-medium leading-tight tracking-tight text-primary sm:text-3xl">
                      {STORE.name}
                    </h1>
                    <Badge variant="cream">{STORE.tier}</Badge>
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-white">
                      <BadgeCheck className="h-3 w-3" />
                      Terverifikasi
                    </span>
                  </div>

                  <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-charcoal-500">
                    <span className="flex items-center gap-1 font-semibold text-charcoal-900">
                      <Star className="h-3.5 w-3.5 fill-caramel text-caramel" />
                      {STORE.rating.toFixed(1)}
                      <span className="font-normal text-charcoal-500">
                        · {STORE.reviewCount} ulasan
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-sage-500" />
                      {STORE.followers} pengikut
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-sage-500" />
                      {STORE.location}
                    </span>
                  </div>

                  <p className="mt-2 text-xs font-medium text-primary">
                    {STORE.tagline}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-stretch gap-2.5 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => setFollowing((v) => !v)}
                  aria-pressed={following}
                  className={cn(
                    'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-200',
                    following
                      ? 'bg-primary text-white hover:bg-caramel'
                      : 'border-2 border-primary text-primary hover:bg-caramel hover:text-white'
                  )}
                >
                  {following ? (
                    <Heart className="h-4 w-4 fill-current" />
                  ) : (
                    <UserPlus className="h-4 w-4" />
                  )}
                  {following ? 'Mengikuti' : 'Ikuti Toko'}
                </button>
                <a
                  href="#menu-surplus"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-colors hover:bg-caramel"
                >
                  Pesan Surplus
                </a>
              </div>
            </div>

            <p className="mt-6 border-t border-sage-100 pt-5 text-sm leading-relaxed text-charcoal-500">
              {STORE.description}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
