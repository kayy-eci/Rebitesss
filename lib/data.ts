import { Recycle, Sprout, Store, Utensils } from "lucide-react";
import type { ImpactStat, OrderDraft } from "./types";

const inMinutes = (minutes: number) =>
  new Date(Date.now() + minutes * 60 * 1000).toISOString();

// CATATAN: foodItems, urgentItems, vendors, dan promoCodes sudah dipindah
// ke database Supabase. Gunakan fetcher di lib/catalog.ts:
//   fetchFoodItems() / fetchUrgentItems() / fetchVendors()
// atau hook useCatalog() untuk konsumsi di komponen.

export const LOCATIONS = [
  "SMP Taruna Bhakti",
  "Kota Bogor",
  "Kota Depok",
  "Jakarta Selatan",
  "Tangerang Selatan",
];

export const impactStats: ImpactStat[] = [
  {
    id: "saved-meals",
    icon: Utensils,
    value: 12540,
    label: "Makanan berhasil diselamatkan",
  },
  {
    id: "waste-shifted",
    icon: Recycle,
    value: 3280,
    suffix: " kg",
    label: "Potensi food waste yang dialihkan",
  },
  {
    id: "buyers",
    icon: Sprout,
    value: 1840,
    label: "Pembeli telah ikut berkontribusi",
  },
  {
    id: "umkm-joined",
    icon: Store,
    value: 426,
    label: "UMKM bergabung",
  },
];

export const formatRupiah = (value: number) =>
  `Rp${value.toLocaleString("id-ID")}`;

export const orderDraft: OrderDraft = {
  productId: "nasi-ayam-surplus",
  productSlug: "paket-nasi-ayam-surplus",
  vendorName: "Dapur Bu Tini",
  vendorSlug: "dapur-ibu-tini",
  productName: "Paket Nasi Ayam Surplus",
  image:
    "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800",
  originalPrice: 30000,
  discountedPrice: 18000,
  stockRemaining: 7,
  distanceKm: 1.1,
  pickupTime: { from: "18:30", to: "20:00" },
  pickupLocation: "Jl. Kenanga No. 12, Bogor Utara",
  reservedUntil: inMinutes(35),
  co2ePerUnitKg: 0.45,
};
