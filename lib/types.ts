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

export interface OrderDraft {
  productId: string;
  productSlug: string;
  vendorName: string;
  vendorSlug: string;
  productName: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
  stockRemaining: number;
  pickupTime: { from: string; to: string };
  pickupLocation: string;
  reservedUntil: string;
  co2ePerUnitKg: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  fee: number;
  feeLabel: string;
}

export interface PromoCode {
  code: string;
  discountAmount: number;
  isValid: boolean;
}

export interface CheckoutSummary {
  subtotal: number;
  serviceFee: number;
  methodFee: number;
  promoDiscount: number;
  total: number;
  totalSavings: number;
  co2eSaved: number;
}

export interface UrgentItem extends FoodItem {
  expiresAt: string;
}
