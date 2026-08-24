import {
  Award,
  HeartHandshake,
  Medal,
  Recycle,
  ShoppingBag,
  Zap,
} from 'lucide-react';
import type {
  AchievementBadge,
  FavoriteCategory,
  IncomingOrder,
  MonthCategoryData,
  PartnerScorePeriod,
  SalesActivityPoint,
  VendorStat,
  VendorInfo,
} from './types';

export const AVG_PRICE_PER_PORSI = 21000;

export const VENDOR = {
  storeName: 'Dapur Ibu Tini',
  ownerName: 'Tini Rahayu',
  firstName: 'Bu Tini',
  tier: 'UMKM Partner · Level 3',
  avatar:
    'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=160',
};

export const salesActivityWeek: SalesActivityPoint[] = [
  { day: 'Sen', terjual: 22, tersisa: 6 },
  { day: 'Sel', terjual: 18, tersisa: 9 },
  { day: 'Rab', terjual: 25, tersisa: 5 },
  { day: 'Kam', terjual: 20, tersisa: 8 },
  { day: 'Jum', terjual: 27, tersisa: 4 },
  { day: 'Sab', terjual: 21, tersisa: 7 },
  { day: 'Min', terjual: 15, tersisa: 10 },
];

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
];

export const salesActivityPeriod: SalesActivityPoint[] = Array.from(
  { length: 30 },
  (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const terjual = 16 + ((i * 5 + 4) % 12);
    const tersisa = 4 + ((i * 3) % 8);
    return {
      day: `${date.getDate()} ${MONTHS[date.getMonth()]}`,
      terjual,
      tersisa,
    };
  }
);

export const vendorStats: VendorStat[] = [
  {
    label: 'Pendapatan Bulan Ini',
    value: 7250000,
    changePercent: 12.4,
    changeDirection: 'up',
  },
  {
    label: 'Porsi Terjual',
    value: 148,
    changePercent: 6.9,
    changeDirection: 'up',
  },
  {
    label: 'Pelanggan Baru',
    value: 24,
    changePercent: 2.1,
    changeDirection: 'down',
  },
];

export const vendorInfo: VendorInfo = {
  storeName: 'Dapur Ibu Tini',
  ownerName: 'Tini Rahayu',
  partnerTier: 'UMKM Partner · Level 3',
  storeIdMasked: 'RB-****-0427',
  partnerSince: '2023',
};

export const incomingOrders: IncomingOrder[] = [
  {
    id: 'ORD-3216',
    customerName: 'Sarah Wijaya',
    customerAvatar:
      'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=160',
    productLabel: 'Rice Bowl Ayam',
    date: '15 Agu 2026',
    amount: 16800,
    status: 'selesai',
  },
  {
    id: 'ORD-3211',
    customerName: 'Budi Santoso',
    customerAvatar:
      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=160',
    productLabel: 'Sup Krim Labu Hangat',
    date: '14 Agu 2026',
    amount: 11000,
    status: 'selesai',
  },
  {
    id: 'ORD-3207',
    customerName: 'Rina Permata',
    customerAvatar:
      'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=160',
    productLabel: 'Paket Nasi Ayam',
    date: '13 Agu 2026',
    amount: 22000,
    status: 'menunggu-diambil',
  },
  {
    id: 'ORD-3201',
    customerName: 'Andi Firmansyah',
    customerAvatar:
      'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=160',
    productLabel: 'Urap Sayur Segar',
    date: '12 Agu 2026',
    amount: 14400,
    status: 'selesai',
  },
  {
    id: 'ORD-3196',
    customerName: 'Maya Lestari',
    customerAvatar:
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=160',
    productLabel: 'Es Teh Manis × 2',
    date: '10 Agu 2026',
    amount: 16000,
    status: 'selesai',
  },
  {
    id: 'ORD-3190',
    customerName: 'Dewi Anggraini',
    customerAvatar:
      'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=160',
    productLabel: 'Rice Bowl Ayam',
    date: '9 Agu 2026',
    amount: 16800,
    status: 'dibatalkan',
  },
  {
    id: 'ORD-3184',
    customerName: 'Rizky Pratama',
    customerAvatar:
      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=160',
    productLabel: 'Sup Krim Labu Hangat',
    date: '8 Agu 2026',
    amount: 11000,
    status: 'selesai',
  },
  {
    id: 'ORD-3172',
    customerName: 'Sari Dewi',
    customerAvatar:
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=160',
    productLabel: 'Donat Kampung',
    date: '6 Agu 2026',
    amount: 12500,
    status: 'menunggu-diambil',
  },
  {
    id: 'ORD-3159',
    customerName: 'Eko Saputra',
    customerAvatar:
      'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=160',
    productLabel: 'Nasi Liwet Komplit',
    date: '4 Agu 2026',
    amount: 19500,
    status: 'selesai',
  },
];

const categoryBreakdown = (categories: FavoriteCategory[]) => categories;

export const topCategoriesByMonth: Record<string, MonthCategoryData> = {
  '2026-08': {
    label: 'Agustus 2026',
    total: 7250000,
    categories: categoryBreakdown([
      { category: 'Masakan Rumah', percent: 30 },
      { category: 'Lauk & Protein', percent: 24 },
      { category: 'Sup & Hangat', percent: 18 },
      { category: 'Minuman', percent: 14 },
      { category: 'Snack & Jajanan', percent: 9 },
      { category: 'Lainnya', percent: 5 },
    ]),
  },
  '2026-07': {
    label: 'Juli 2026',
    total: 6540000,
    categories: categoryBreakdown([
      { category: 'Masakan Rumah', percent: 26 },
      { category: 'Lauk & Protein', percent: 26 },
      { category: 'Sup & Hangat', percent: 16 },
      { category: 'Minuman', percent: 16 },
      { category: 'Snack & Jajanan', percent: 11 },
      { category: 'Lainnya', percent: 5 },
    ]),
  },
  '2026-06': {
    label: 'Juni 2026',
    total: 5980000,
    categories: categoryBreakdown([
      { category: 'Masakan Rumah', percent: 32 },
      { category: 'Lauk & Protein', percent: 22 },
      { category: 'Sup & Hangat', percent: 15 },
      { category: 'Minuman', percent: 15 },
      { category: 'Snack & Jajanan', percent: 12 },
      { category: 'Lainnya', percent: 4 },
    ]),
  },
};

export const monthOptions = Object.keys(topCategoriesByMonth).map(
  (value) => ({ value, label: topCategoriesByMonth[value].label })
);

export const partnerScoreByPeriod: Record<string, PartnerScorePeriod> = {
  '30-hari': { label: '30 Hari', score: 78, deltaPercent: 5 },
  '7-hari': { label: '7 Hari', score: 84, deltaPercent: 2 },
  '90-hari': { label: '90 Hari', score: 71, deltaPercent: 8 },
};

export const periodOptions = Object.keys(partnerScoreByPeriod).map(
  (value) => ({ value, label: partnerScoreByPeriod[value].label })
);

export const orderPeriodOptions = [
  { value: '7-hari', label: '7 Hari' },
  { value: '30-hari', label: '30 Hari' },
  { value: '90-hari', label: '90 Hari' },
];

export const achievements: AchievementBadge[] = [
  {
    id: 'umkm-teraktif',
    icon: Award,
    name: 'UMKM Teraktif',
    current: 20,
    target: 20,
    unit: 'kali',
    unlocked: true,
    group: 'terkumpul',
  },
  {
    id: '100-porsi',
    icon: ShoppingBag,
    name: '100 Porsi Terjual',
    current: 100,
    target: 100,
    unit: 'porsi',
    unlocked: true,
    group: 'terkumpul',
  },
  {
    id: 'mitra-terpercaya',
    icon: HeartHandshake,
    name: 'Mitra Terpercaya',
    current: 12,
    target: 12,
    unit: 'bulan',
    unlocked: true,
    group: 'terkumpul',
  },
  {
    id: 'zero-waste-vendor',
    icon: Recycle,
    name: 'Zero Waste Vendor',
    current: 7,
    target: 10,
    unit: 'hari',
    unlocked: false,
    group: 'sedang-diusahakan',
  },
  {
    id: 'raja-respons',
    icon: Zap,
    name: 'Raja Respons',
    current: 4,
    target: 7,
    unit: 'menit',
    unlocked: false,
    group: 'sedang-diusahakan',
  },
  {
    id: 'kolektor-ulasan',
    icon: Medal,
    name: 'Kolektor Ulasan',
    current: 18,
    target: 25,
    unit: 'ulasan',
    unlocked: false,
    group: 'sedang-diusahakan',
  },
];
