import { Boxes, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  LeafCycle,
  WalletLeaf,
  CloudLeaf,
} from '@/app/components/order-history/ornaments';

type SummaryStat = {
  label: string;
  value: string;
  support: string;
  icon: React.ReactNode;
  chip: string;
  iconColor: string;
  corner: React.ReactNode;
};

const STATS: SummaryStat[] = [
  {
    label: 'Total orders',
    value: '28',
    support: '5 orders this month',
    icon: <Boxes className="h-5 w-5" strokeWidth={2.1} />,
    chip: 'bg-mint',
    iconColor: 'text-pine',
    corner: <Leaf className="h-9 w-9 text-leaf/25" strokeWidth={1.6} />,
  },
  {
    label: 'Food rescued',
    value: '24.8 kg',
    support: '+18.5% from last month',
    icon: <LeafCycle className="h-5 w-5" />,
    chip: 'bg-sage/25',
    iconColor: 'text-pine',
    corner: <LeafCycle className="h-9 w-9 text-sage/60" />,
  },
  {
    label: 'Money saved',
    value: 'Rp 486.000',
    support: 'Compared to regular prices',
    icon: <WalletLeaf className="h-5 w-5" />,
    chip: 'bg-beige',
    iconColor: 'text-pine',
    corner: <WalletLeaf className="h-9 w-9 text-terra/30" />,
  },
  {
    label: 'CO₂e avoided',
    value: '18.6 kg',
    support: 'Your positive impact',
    icon: <CloudLeaf className="h-5 w-5" />,
    chip: 'bg-pine/10',
    iconColor: 'text-pine',
    corner: <CloudLeaf className="h-9 w-9 text-pine/25" />,
  },
];

function SummaryCard({ stat }: { stat: SummaryStat }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-pine/10 bg-white p-5 shadow-[0_10px_30px_-22px_rgba(40,89,67,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:border-leaf/40 hover:shadow-[0_18px_40px_-24px_rgba(40,89,67,0.45)]">
      <span className="pointer-events-none absolute -right-2 -top-2 opacity-60 transition-transform duration-500 group-hover:scale-110 group-hover:opacity-90">
        {stat.corner}
      </span>

      <span
        className={cn(
          'flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-500 group-hover:scale-105',
          stat.chip,
          stat.iconColor
        )}
      >
        {stat.icon}
      </span>

      <p className="mt-4 font-display text-[1.7rem] font-medium leading-none tracking-tight text-ink tabular-nums">
        {stat.value}
      </p>
      <p className="mt-2 text-[13px] font-semibold text-ink">{stat.label}</p>
      <p className="mt-0.5 text-xs text-moss">{stat.support}</p>
    </div>
  );
}

export function OrderSummaryCards() {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {STATS.map((stat) => (
        <SummaryCard key={stat.label} stat={stat} />
      ))}
    </section>
  );
}
