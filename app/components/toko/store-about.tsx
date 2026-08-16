import { Clock, Leaf, MapPin, ShieldCheck, Zap } from 'lucide-react';
import { DotPattern, LeafSprig } from '@/app/components/dashboardPenjual/decor';
import { STORE } from './data';

const INFO_CHIPS = [
  { icon: Clock, label: 'Jam surplus', value: STORE.hours },
  { icon: MapPin, label: 'Lokasi', value: STORE.location },
  { icon: ShieldCheck, label: 'Partner sejak', value: String(STORE.memberSince) },
  { icon: Zap, label: 'Merespons dalam', value: STORE.responseTime },
];

const IMPACT_ROWS = [
  { label: 'Porsi terselamatkan', value: `${STORE.ordersServed} porsi` },
  { label: 'CO₂e terhindar', value: `${STORE.co2eSaved} kg` },
  { label: 'Jadi mitra ReBites', value: '12 bulan' },
  { label: 'Komitmen', value: 'Zero Food Waste' },
];

export function StoreAbout() {
  return (
    <section className="mt-12 grid gap-5 lg:grid-cols-3">
      <div className="rounded-2xl border border-sage-100 bg-white p-6 shadow-sm lg:col-span-2 sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-500">
          Tentang Toko
        </p>
        <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-forest-900">
          Mengenal {STORE.name}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-charcoal-500">
          {STORE.ownerName} memulai dapur rumahan ini lebih dari 10 tahun lalu dengan satu
          prinsip sederhana: makanan yang masih layak tidak boleh berakhir di tempat sampah.
          Lewat ReBites, kelebihan porsi yang tidak terbeli di hari itu ditawarkan dengan
          harga lebih hemat, tetap segar, dan hangat saat diambil.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-charcoal-500">
          Setiap menu dimasak dengan porsi pas dan bahan yang dibeli harian, sehingga kualitas
          selalu terjaga. Dengan bergabung sebagai UMKM partner, toko ini ikut mengurangi food
          waste sekaligus menjangkau pembeli yang lebih luas.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {INFO_CHIPS.map((chip) => {
            const Icon = chip.icon;
            return (
              <div
                key={chip.label}
                className="flex items-center gap-3 rounded-xl bg-cream-50 px-4 py-3"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage-100 text-green-700">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-sage-500">
                    {chip.label}
                  </p>
                  <p className="truncate text-xs font-semibold text-charcoal-900">
                    {chip.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-forest-900 p-6 text-cream-50 shadow-md shadow-forest-900/20 sm:p-8">
        <DotPattern className="right-0 top-0 h-40 w-40 text-cream-50/10" />
        <LeafSprig className="-right-8 -top-6 h-44 w-44 text-cream-50/15" />

        <div className="relative">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-cream-50/15">
            <Leaf className="h-5 w-5 text-cream-50" />
          </span>
          <h3 className="mt-4 font-display text-xl font-medium tracking-tight text-cream-50">
            Dampak Toko Ini
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-cream-50/70">
            Setiap porsi yang kamu pesan membantu toko ini mengurangi sisa makanan.
          </p>

          <ul className="mt-5 space-y-3">
            {IMPACT_ROWS.map((row) => (
              <li
                key={row.label}
                className="flex items-center justify-between gap-2 border-b border-cream-50/10 pb-2.5 text-xs last:border-0 last:pb-0"
              >
                <span className="text-cream-50/70">{row.label}</span>
                <span className="font-semibold text-cream-50">{row.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
