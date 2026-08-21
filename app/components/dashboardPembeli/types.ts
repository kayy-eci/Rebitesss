import type { LucideIcon } from 'lucide-react';

export interface RescueActivityPoint {
  day: string;
  selesaiDiambil: number;
  menungguDiambil: number;
}

export interface BuyerStat {
  label: string;
  value: number;
  changePercent: number;
  changeDirection: 'up' | 'down';
}

export interface MembershipInfo {
  memberTier: string;
  memberIdMasked: string;
  memberName: string;
  memberSince: string;
  pointsBalance: number;
}

export interface FavoriteVendor {
  id: string;
  name: string;
  logo: string;
}

export type OrderStatus = 'selesai' | 'menunggu-diambil' | 'dibatalkan';

export interface MyOrderItem {
  id: string;
  vendorName: string;
  vendorAvatar: string;
  productLabel: string;
  date: string;
  amount: number;
  status: OrderStatus;
}

export interface FavoriteCategory {
  category: string;
  percent: number;
}

export interface AchievementBadge {
  id: string;
  icon: LucideIcon;
  name: string;
  current: number;
  target: number;
  unit: string;
  unlocked: boolean;
  group: 'terkumpul' | 'sedang-diusahakan';
}

export interface MonthCategoryData {
  label: string;
  total: number;
  categories: FavoriteCategory[];
}

export interface FoodHeroPeriod {
  label: string;
  score: number;
  deltaPercent: number;
}
