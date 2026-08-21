'use client';

import { Leaf } from 'lucide-react';
import { Card } from './Card';
import { QuickActionsRow } from './QuickActionsRow';
import { useCountUp } from './useCountUp';
import { membershipInfo } from './data';
import { DotPattern, LeafSprig } from './decor';

export function MembershipCard() {
  const { ref, value } = useCountUp(membershipInfo.pointsBalance);

  return (
    <Card>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-charcoal-900">Kartu Anggota ReBites</h2>
        <span className="rounded-full bg-sage-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-charcoal-900">
          Active
        </span>
      </div>

      <div className="relative mt-4 overflow-hidden rounded-3xl bg-gradient-to-br from-forest-900 via-forest-800 to-green-600 p-6 text-cream-50 shadow-md shadow-forest-900/20">
        <DotPattern className="right-0 top-0 h-40 w-40 text-cream-50/10" />
        <LeafSprig className="-right-8 -top-6 h-44 w-44 text-cream-50/15" />

        <div className="relative flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cream-50/70">
              ReBites Member
            </p>
            <p className="mt-2 inline-flex rounded-full bg-cream-50/15 px-2.5 py-1 text-[11px] font-semibold text-cream-50">
              {membershipInfo.memberTier}
            </p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-50/15">
            <Leaf className="h-4 w-4 text-cream-50" />
          </div>
        </div>

        <div className="relative mt-7 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-display text-lg font-medium leading-tight text-cream-50">
              {membershipInfo.memberName}
            </p>
            <p className="mt-1 text-[11px] text-cream-50/60">
              Member sejak {membershipInfo.memberSince} · {membershipInfo.memberIdMasked}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-cream-50/70">
              Saldo Poin
            </p>
            <p className="mt-1 font-display text-2xl font-semibold leading-none text-cream-50">
              <span ref={ref}>{value.toLocaleString('id-ID')}</span>{' '}
              <span className="text-sm font-normal text-cream-50/70">Poin</span>
            </p>
          </div>
        </div>
      </div>

      <QuickActionsRow />
    </Card>
  );
}
