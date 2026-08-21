import {
  Award,
  HeartHandshake,
  Medal,
  Recycle,
  ShoppingBag,
  Sunrise,
} from 'lucide-react';
import type {
  AchievementBadge,
  BuyerStat,
  FavoriteCategory,
  FavoriteVendor,
  FoodHeroPeriod,
  MembershipInfo,
  MonthCategoryData,
  MyOrderItem,
  RescueActivityPoint,
} from './types';

export const AVG_SAVING_PER_PORSI = 18000;

export const BUYER = {
  name: 'Sarah Wijaya',
  firstName: 'Sarah',
  tier: 'Food Hero · Level 2',
  avatar:
    'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=160',
};

export const rescueActivityWeek: RescueActivityPoint[] = [
  { day: 'Sen', selesaiDiambil: 2, menungguDiambil: 1 },
  { day: 'Sel', selesaiDiambil: 1, menungguDiambil: 2 },
  { day: 'Rab', selesaiDiambil: 3, menungguDiambil: 1 },
  { day: 'Kam', selesaiDiambil: 2, menungguDiambil: 0 },
  { day: 'Jum', selesaiDiambil: 2, menungguDiambil: 1 },
  { day: 'Sab', selesaiDiambil: 1, menungguDiambil: 0 },
  { day: 'Min', selesaiDiambil: 1, menungguDiambil: 1 },
];

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
];

export const rescueActivityPeriod: RescueActivityPoint[] = Array.from(
  { length: 30 },
  (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const selesaiDiambil = 1 + ((i * 7 + 3) % 3);
    const menungguDiambil = i % 3 === 0 ? 1 : 0;
    return {
      day: `${date.getDate()} ${MONTHS[date.getMonth()]}`,
      selesaiDiambil,
      menungguDiambil,
    };
  }
);

export const buyerStats: BuyerStat[] = [
  {
    label: 'Total Belanja',
    value: 1240000,
    changePercent: 4.2,
    changeDirection: 'down',
  },
  {
    label: 'Total Hemat',
    value: 460500,
    changePercent: 12.2,
    changeDirection: 'up',
  },
  {
    label: 'Porsi Diselamatkan',
    value: 48,
    changePercent: 6.9,
    changeDirection: 'up',
  },
];

export const membershipInfo: MembershipInfo = {
  memberTier: 'Food Hero · Level 2',
  memberIdMasked: 'RB-****-2841',
  memberName: 'Sarah Wijaya',
  memberSince: '2023',
  pointsBalance: 2450,
};

export const favoriteVendors: FavoriteVendor[] = [
  { id: 'roti-subuh', name: 'Roti Subuh', logo: '/foods/rotisourdough.jpg' },
  { id: 'warung-nusantara', name: 'Warung Nusantara', logo: '/foods/ikansayur.jpg' },
  { id: 'dapur-ibu-tini', name: 'Dapur Ibu Tini', logo: '/foods/supkrimlabu.jpg' },
  { id: 'kopi-pagi', name: 'Kopi Pagi', logo: '/foods/kopisusu.jpg' },
  { id: 'kue-mbok-ndari', name: 'Kue Mbok Ndari', logo: '/foods/boxdonat.jpg' },
  { id: 'segar-bahari', name: 'Segar Bahari', logo: '/foods/pastacarbonara.jpg' },
];

export const orderHistory: MyOrderItem[] = [
  {
    id: 'ORD-2416',
    vendorName: 'Roti Subuh',
    vendorAvatar: '/foods/rotisourdough.jpg',
    productLabel: 'Paket Roti Sourdough Sisa Panggang',
    date: '15 Agu 2026',
    amount: 15000,
    status: 'selesai',
  },
  {
    id: 'ORD-2411',
    vendorName: 'Dapur Ibu Tini',
    vendorAvatar: '/foods/supkrimlabu.jpg',
    productLabel: 'Sup Krim Labu Hangat',
    date: '14 Agu 2026',
    amount: 11000,
    status: 'selesai',
  },
  {
    id: 'ORD-2407',
    vendorName: 'Kopi Pagi',
    vendorAvatar: '/foods/kopisusu.jpg',
    productLabel: 'Kopi Susu Sisa Barista × 2',
    date: '13 Agu 2026',
    amount: 18000,
    status: 'menunggu-diambil',
  },
  {
    id: 'ORD-2401',
    vendorName: 'Warung Nusantara',
    vendorAvatar: '/foods/ikansayur.jpg',
    productLabel: 'Nasi Ayam Komplit',
    date: '12 Agu 2026',
    amount: 17500,
    status: 'selesai',
  },
  {
    id: 'ORD-2396',
    vendorName: 'Croissant & Co',
    vendorAvatar: '/foods/sandwichcroissant.jpg',
    productLabel: 'Sandwich Croissant Pagi',
    date: '10 Agu 2026',
    amount: 10000,
    status: 'selesai',
  },
  {
    id: 'ORD-2390',
    vendorName: 'Salad Stop',
    vendorAvatar: '/foods/saladkebun.jpg',
    productLabel: 'Salad Segar Kebun',
    date: '9 Agu 2026',
    amount: 14400,
    status: 'dibatalkan',
  },
  {
    id: 'ORD-2384',
    vendorName: 'Kue Mbok Ndari',
    vendorAvatar: '/foods/boxdonat.jpg',
    productLabel: 'Box Donat Mini Rasa Campur',
    date: '8 Agu 2026',
    amount: 12500,
    status: 'selesai',
  },
  {
    id: 'ORD-2372',
    vendorName: 'Segar Bahari',
    vendorAvatar: '/foods/pastacarbonara.jpg',
    productLabel: 'Pasta Carbonara Surplus',
    date: '6 Agu 2026',
    amount: 27000,
    status: 'menunggu-diambil',
  },
  {
    id: 'ORD-2359',
    vendorName: 'Dapur Ibu Tini',
    vendorAvatar: '/foods/supkrimlabu.jpg',
    productLabel: 'Rice Bowl Ayam',
    date: '4 Agu 2026',
    amount: 16800,
    status: 'selesai',
  },
];

const categoryBreakdown = (categories: FavoriteCategory[]) => categories;

export const favoriteCategoriesByMonth: Record<string, MonthCategoryData> = {
  '2026-08': {
    label: 'Agustus 2026',
    total: 482000,
    categories: categoryBreakdown([
      { category: 'Makanan Berat', percent: 32 },
      { category: 'Bakery', percent: 24 },
      { category: 'Minuman', percent: 16 },
      { category: 'Dessert', percent: 12 },
      { category: 'Snack', percent: 10 },
      { category: 'Lainnya', percent: 6 },
    ]),
  },
  '2026-07': {
    label: 'Juli 2026',
    total: 561000,
    categories: categoryBreakdown([
      { category: 'Makanan Berat', percent: 28 },
      { category: 'Bakery', percent: 26 },
      { category: 'Minuman', percent: 18 },
      { category: 'Dessert', percent: 10 },
      { category: 'Snack', percent: 12 },
      { category: 'Lainnya', percent: 6 },
    ]),
  },
  '2026-06': {
    label: 'Juni 2026',
    total: 438000,
    categories: categoryBreakdown([
      { category: 'Makanan Berat', percent: 34 },
      { category: 'Bakery', percent: 22 },
      { category: 'Minuman', percent: 14 },
      { category: 'Dessert', percent: 13 },
      { category: 'Snack', percent: 11 },
      { category: 'Lainnya', percent: 6 },
    ]),
  },
};

export const monthOptions = Object.keys(favoriteCategoriesByMonth).map(
  (value) => ({ value, label: favoriteCategoriesByMonth[value].label })
);

export const foodHeroScoreByPeriod: Record<string, FoodHeroPeriod> = {
  '30-hari': { label: '30 Hari', score: 78, deltaPercent: 5 },
  '7-hari': { label: '7 Hari', score: 84, deltaPercent: 2 },
  '90-hari': { label: '90 Hari', score: 71, deltaPercent: 8 },
};

export const periodOptions = Object.keys(foodHeroScoreByPeriod).map(
  (value) => ({ value, label: foodHeroScoreByPeriod[value].label })
);

export const orderPeriodOptions = [
  { value: '7-hari', label: '7 Hari' },
  { value: '30-hari', label: '30 Hari' },
  { value: '90-hari', label: '90 Hari' },
];

export const achievements: AchievementBadge[] = [
  {
    id: 'food-hero',
    icon: Award,
    name: 'Food Hero',
    current: 20,
    target: 20,
    unit: 'kali',
    unlocked: true,
    group: 'terkumpul',
  },
  {
    id: 'belanja-10',
    icon: ShoppingBag,
    name: '10 Kali Belanja',
    current: 10,
    target: 10,
    unit: 'kali',
    unlocked: true,
    group: 'terkumpul',
  },
  {
    id: 'umkm-setia',
    icon: HeartHandshake,
    name: 'UMKM Setia',
    current: 12,
    target: 12,
    unit: 'kali',
    unlocked: true,
    group: 'terkumpul',
  },
  {
    id: 'zero-waste',
    icon: Recycle,
    name: 'Zero Waste Warrior',
    current: 7,
    target: 10,
    unit: 'porsi',
    unlocked: false,
    group: 'sedang-diusahakan',
  },
  {
    id: 'early-bird',
    icon: Sunrise,
    name: 'Early Bird',
    current: 4,
    target: 7,
    unit: 'hari',
    unlocked: false,
    group: 'sedang-diusahakan',
  },
  {
    id: 'kolektor-25',
    icon: Medal,
    name: 'Kolektor 25',
    current: 18,
    target: 25,
    unit: 'kali',
    unlocked: false,
    group: 'sedang-diusahakan',
  },
];
