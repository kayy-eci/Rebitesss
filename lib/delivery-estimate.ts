import type { FulfillmentMode, GeoPoint } from './types';

/**
 * Mesin estimasi waktu pesanan — SATU sumber kebenaran.
 *
 * Pickup  : estimasi = preparationMinutes vendor.
 * Delivery: estimasi = preparationMinutes vendor + travelMinutes(jarak).
 *
 * Tidak ada angka acak. Jarak berasal dari data vendor/produk yang
 * sudah ada (draft.distanceKm). Bila suatu saat data koordinat
 * tersedia, gunakan haversineDistanceKm() untuk jarak yang lebih
 * presisi — struktur GeoPoint sudah disiapkan.
 */

/** Waktu persiapan memasak per toko (menit) — menentukan estimasi pickup. */
export const VENDOR_PREPARATION_MINUTES: Record<string, number> = {
  'warung-nusantara': 15,
  'dapur-ibu-tini': 25,
  'warkop-pak-iman': 10,
};

const DEFAULT_PREPARATION_MINUTES = 20;

export function getVendorPreparationMinutes(vendorSlug?: string): number {
  if (!vendorSlug) return DEFAULT_PREPARATION_MINUTES;
  return VENDOR_PREPARATION_MINUTES[vendorSlug] ?? DEFAULT_PREPARATION_MINUTES;
}

/**
 * Tier perjalanan kurir berdasarkan jarak — monotonic:
 *   0–2 km → 10–15 mnt | >2–4 km → 15–25 | >4–6 km → 25–35 | >6–10 km → 35–50
 * Di dalam tier, posisi diinterpolasi linear dari jarak sehingga toko
 * 1 km SELALU lebih cepat daripada toko 8 km.
 */
interface TravelTier {
  minKm: number;
  maxKm: number;
  fromMinutes: number;
  toMinutes: number;
}

const TRAVEL_TIERS: TravelTier[] = [
  { minKm: 0, maxKm: 2, fromMinutes: 10, toMinutes: 15 },
  { minKm: 2, maxKm: 4, fromMinutes: 15, toMinutes: 25 },
  { minKm: 4, maxKm: 6, fromMinutes: 25, toMinutes: 35 },
  { minKm: 6, maxKm: 10, fromMinutes: 35, toMinutes: 50 },
];

export function calculateTravelMinutes(distanceKm: number): number {
  const d = Math.max(0, distanceKm);
  const tier = TRAVEL_TIERS.find((t) => d <= t.maxKm);

  /* Di luar 10 km: tetap monotonic (+3 mnt tiap km). */
  if (!tier) return Math.round(50 + (d - 10) * 3);

  const span = tier.maxKm - tier.minKm || 1;
  const ratio = Math.min(1, Math.max(0, (d - tier.minKm) / span));
  return Math.round(
    tier.fromMinutes + ratio * (tier.toMinutes - tier.fromMinutes)
  );
}

export interface OrderEstimate {
  preparationMinutes: number;
  travelMinutes: number;
  estimatedMinutes: number;
}

/**
 * Hitung estimasi penyelesaian pesanan dalam menit.
 * Delivery = persiapan + perjalanan; Pickup = persiapan saja.
 */
export function estimateOrderMinutes({
  fulfillment,
  distanceKm = 0,
  vendorSlug,
}: {
  fulfillment: FulfillmentMode;
  distanceKm?: number;
  vendorSlug?: string;
}): OrderEstimate {
  const preparationMinutes = getVendorPreparationMinutes(vendorSlug);
  const travelMinutes =
    fulfillment === 'delivery' ? calculateTravelMinutes(distanceKm) : 0;
  return {
    preparationMinutes,
    travelMinutes,
    estimatedMinutes: preparationMinutes + travelMinutes,
  };
}

/** Jarak geografis dua titik (km) via rumus Haversine. */
export function haversineDistanceKm(a: GeoPoint, b: GeoPoint): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
