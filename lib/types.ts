import type { LucideIcon } from 'lucide-react';

export type FoodCategory = 'bakery' | 'restoran' | 'minuman' | 'umkm';

export type FilterKey =
  | 'terdekat'
  | 'diskon-terbesar'
  | 'segera-habis'
  | 'umkm'
  | 'bakery'
  | 'restoran'
  | 'minuman';

export interface FoodItem {
  id: string;
  name: string;
  vendorName: string;
  image: string;
  category: FoodCategory;
  rating: number;
  distanceKm: number;
  availableFrom: string;
  availableTo: string;
  stockLabel: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
  expiresAt?: string;
}

export interface Vendor {
  id: string;
  name: string;
  image: string;
  logo: string;
  isRescuePartner: boolean;
  rating: number;
  distanceKm: number;
  category: string;
  itemCount: number;
}

export interface ImpactStat {
  id: string;
  icon: LucideIcon;
  value: number;
  suffix?: string;
  label: string;
}

export interface UrgentItem extends FoodItem {
  expiresAt: string;
}
