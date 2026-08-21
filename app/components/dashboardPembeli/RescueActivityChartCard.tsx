'use client';

import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BarChart2, LineChart as LineChartIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from './Card';
import { FilterDropdown } from './FilterDropdown';
import { useCountUp } from './useCountUp';
import { AVG_SAVING_PER_PORSI, rescueActivityPeriod, rescueActivityWeek } from './data';
import { formatRupiah } from '@/lib/data';

type Period = '7-hari' | '14-hari' | '30-hari';
type ChartKind = 'bar' | 'line';

const PERIOD_OPTIONS = [
  { value: '7-hari', label: '7 Hari' },
  { value: '14-hari', label: '14 Hari' },
  { value: '30-hari', label: '30 Hari' },
] as const;

interface TooltipPayload {
  dataKey?: string | number;
  value?: number | string;
}

function ActivityTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: readonly TooltipPayload[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  const selesai = Number(
    payload.find((item) => item.dataKey === 'selesaiDiambil')?.value ?? 0
  );
  const menunggu = Number(
    payload.find((item) => item.dataKey === 'menungguDiambil')?.value ?? 0
  );
  const saved = selesai * AVG_SAVING_PER_PORSI;

  return (
    <div className="rounded-xl border border-sage-100 bg-white/95 px-3.5 py-2.5 text-xs shadow-lg backdrop-blur">
      <p className="font-semibold text-charcoal-900">{label}</p>
      <div className="mt-1.5 flex items-center gap-1.5 text-charcoal-900">
        <span className="h-2 w-2 rounded-full bg-green-700" />
        Selesai diambil
        <span className="ml-auto pl-3 font-semibold">{selesai} porsi</span>
      </div>
      <div className="mt-1 flex items-center gap-1.5 text-charcoal-900">
        <span className="h-2 w-2 rounded-full bg-sage-500" />
        Menunggu diambil
        <span className="ml-auto pl-3 font-semibold">{menunggu} porsi</span>
      </div>
      <p className="mt-2 border-t border-sage-100 pt-1.5 font-medium text-green-700">
        Estimasi hemat hari itu ±{formatRupiah(saved)}
      </p>
    </div>
  );
}

export function RescueActivityChartCard() {
  const [period, setPeriod] = useState<Period>('7-hari');
  const [kind, setKind] = useState<ChartKind>('bar');
  const { ref, value } = useCountUp(12);

  const data = useMemo(() => {
    if (period === '7-hari') return rescueActivityWeek;
    const days = period === '14-hari' ? 14 : 30;
    return rescueActivityPeriod.slice(-days);
  }, [period]);

  const totalMenunggu = rescueActivityWeek.reduce(
    (sum, point) => sum + point.menungguDiambil,
    0
  );

  return (
    <Card className="h-full">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
        <div>
          <div className="flex items-baseline gap-2">
            <span
              ref={ref}
              className="font-display text-[42px] font-medium leading-none tracking-tight text-forest-900"
            >
              {value}
            </span>
            <span className="text-sm font-medium text-charcoal-900">
              porsi diselamatkan minggu ini
            </span>
          </div>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-sage-500">
            Aktivitas penyelamatan mingguan
          </p>
        </div>

        <div className="flex items-center gap-2">
          <FilterDropdown
            value={period}
            onChange={(next) => setPeriod(next as Period)}
            options={PERIOD_OPTIONS}
            ariaLabel="Pilih rentang waktu aktivitas"
          />
          <div role="group" aria-label="Tipe grafik" className="flex rounded-full bg-cream-100 p-1">
            <button
              type="button"
              aria-label="Tampilkan grafik batang"
              onClick={() => setKind('bar')}
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full transition-colors',
                kind === 'bar'
                  ? 'bg-white text-green-700 shadow-sm'
                  : 'text-sage-500 hover:text-charcoal-900'
              )}
            >
              <BarChart2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Tampilkan grafik garis"
              onClick={() => setKind('line')}
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full transition-colors',
                kind === 'line'
                  ? 'bg-white text-green-700 shadow-sm'
                  : 'text-sage-500 hover:text-charcoal-900'
              )}
            >
              <LineChartIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4 text-xs font-medium text-charcoal-900">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-green-700" />
            Selesai Diambil
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-sage-500" />
            Menunggu Diambil
          </span>
        </div>
        <p className="text-xs text-sage-500">{totalMenunggu} porsi menunggu diambil</p>
      </div>

      <div className="mt-4 h-[230px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {kind === 'bar' ? (
            <BarChart data={data} margin={{ top: 6, right: 4, left: -14, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#E4EBE4" strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#6B9080' }}
                dy={6}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#6B9080' }}
              />
              <Tooltip cursor={{ fill: '#E4EBE4', opacity: 0.4 }} content={<ActivityTooltip />} />
              <Bar
                dataKey="selesaiDiambil"
                name="Selesai Diambil"
                fill="#1B4D32"
                radius={[6, 6, 2, 2]}
                maxBarSize={22}
                animationDuration={700}
              />
              <Bar
                dataKey="menungguDiambil"
                name="Menunggu Diambil"
                fill="#6B9080"
                radius={[6, 6, 2, 2]}
                maxBarSize={22}
                animationDuration={700}
              />
            </BarChart>
          ) : (
            <LineChart data={data} margin={{ top: 6, right: 4, left: -14, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#E4EBE4" strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#6B9080' }}
                dy={6}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#6B9080' }}
              />
              <Tooltip cursor={{ stroke: '#6B9080', strokeDasharray: '3 3' }} content={<ActivityTooltip />} />
              <Line
                type="monotone"
                dataKey="selesaiDiambil"
                name="Selesai Diambil"
                stroke="#1B4D32"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#1B4D32', strokeWidth: 0 }}
                activeDot={{ r: 5 }}
                animationDuration={700}
              />
              <Line
                type="monotone"
                dataKey="menungguDiambil"
                name="Menunggu Diambil"
                stroke="#6B9080"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#6B9080', strokeWidth: 0 }}
                activeDot={{ r: 5 }}
                animationDuration={700}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      <p className="sr-only">
        Grafik aktivitas penyelamatan mingguan: 12 porsi selesai diambil, {totalMenunggu} porsi
        menunggu diambil.
      </p>
    </Card>
  );
}
