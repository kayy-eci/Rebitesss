import { ArrowRight, Camera, Clock, Store } from 'lucide-react';
import { Card } from './Card';
import { LeafSprig } from './decor';

const tips = [
  {
    icon: Clock,
    title: 'Waktu terbaik menawarkan surplus',
    body: 'Tawarkan porsi sisa 1–2 jam sebelum jam tutup, saat pemburu surplus paling aktif.',
  },
  {
    icon: Camera,
    title: 'Foto yang menggugah selera',
    body: 'Foto menu yang rapi dan terang menaikkan peluang terjual hingga 2 kali lipat.',
  },
];

export function TipsCard() {
  return (
    <Card className="relative overflow-hidden">
      <LeafSprig className="-right-6 -top-6 h-28 w-28 text-sage-100" />

      <div className="relative flex items-center gap-3">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-sage-100/70">
          <Store className="h-6 w-6 text-green-700" />
          <LeafSprig className="-right-3 -top-3 h-14 w-14 text-green-700/15" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-charcoal-900">Tips Jualan Tanpa Sisa</h2>
          <p className="mt-0.5 text-xs text-sage-500">Jadikan tiap porsi laku.</p>
        </div>
      </div>

      <div className="relative mt-4 space-y-3">
        {tips.map((tip) => {
          const Icon = tip.icon;
          return (
            <div key={tip.title} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cream-100 text-green-700">
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-charcoal-900">{tip.title}</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-charcoal-500">{tip.body}</p>
              </div>
            </div>
          );
        })}
      </div>

      <a
        href="#"
        className="relative mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 transition-colors hover:text-green-600"
      >
        Baca Selengkapnya
        <ArrowRight className="h-3.5 w-3.5" />
      </a>
    </Card>
  );
}
