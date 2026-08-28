import { Clock, Leaf, MapPin, Navigation, Utensils } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Vendor } from "@/lib/types";
import { DotPattern, LeafSprig } from "@/app/components/dashboardPenjual/decor";

interface InfoChip {
  icon: LucideIcon;
  label: string;
  value: string;
}

function buildInfoChips(vendor: Vendor): InfoChip[] {
  return [
    { icon: Clock, label: "Jam surplus", value: vendor.openHours },
    { icon: MapPin, label: "Lokasi", value: vendor.address },
    { icon: Utensils, label: "Kategori", value: vendor.category },
    {
      icon: Navigation,
      label: "Jarak dari kamu",
      value: `${vendor.distanceKm} km`,
    },
  ];
}

interface ImpactRow {
  label: string;
  value: string;
}

function buildImpactRows(vendor: Vendor): ImpactRow[] {
  return [
    {
      label: "Porsi terselamatkan",
      value: `${vendor.porsiTerselamatkan ?? 0} porsi`,
    },
    { label: "CO₂e terhindar", value: `${vendor.co2eSavedKg ?? 0} kg` },
    {
      label: "Mitra ReBites sejak",
      value: String(vendor.memberSince ?? new Date().getFullYear()),
    },
    { label: "Komitmen", value: "Zero Food Waste" },
  ];
}

export function StoreAboutImpact({ vendor }: { vendor: Vendor }) {
  const infoChips = buildInfoChips(vendor);
  const impactRows = buildImpactRows(vendor);

  return (
    <section className="mx-auto max-w-[1200px] px-5 sm:px-8">
      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-sage-100 bg-white p-6 shadow-sm sm:p-8 lg:col-span-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-500">
            Tentang Toko
          </p>
          <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-primary">
            Mengenal {vendor.name}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-charcoal-500">
            {vendor.description} Setiap menu surplus yang ditawarkan lewat
            ReBites adalah kelebihan porsi hari itu, masih layak, tetap segar,
            dan dijual dengan harga lebih hemat agar tidak berakhir di tempat
            sampah.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-charcoal-500">
            Dengan memesan dari toko ini, kamu ikut memperpanjang usia makanan
            sekaligus mendukung UMKM lokal untuk terus berproduksi secara
            lebih bijak.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {infoChips.map((chip) => {
              const Icon = chip.icon;

              return (
                <div
                  key={chip.label}
                  className="flex items-center gap-3 rounded-xl bg-cream-50 px-4 py-3"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage-100 text-primary">
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

        <div className="relative overflow-hidden rounded-2xl bg-primary p-6 text-cream-50 shadow-md shadow-primary/20 sm:p-8">
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
              Setiap porsi yang kamu pesan membantu toko ini mengurangi sisa
              makanan.
            </p>

            <ul className="mt-5 space-y-3">
              {impactRows.map((row) => (
                <li
                  key={row.label}
                  className="flex items-center justify-between gap-2 border-b border-cream-50/10 pb-2.5 text-xs last:border-0 last:pb-0"
                >
                  <span className="text-cream-50/70">{row.label}</span>
                  <span className="font-semibold text-cream-50">
                    {row.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
