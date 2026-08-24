import type { FulfillmentMode, GeoPoint } from './types';

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
