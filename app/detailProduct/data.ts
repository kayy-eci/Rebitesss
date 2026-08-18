export interface VendorInfo {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  isRescuePartner: boolean;
}

export interface ProductDetail {
  id: string;
  slug: string;
  category: string;
  vendor: VendorInfo;
  title: string;
  images: string[];
  discountPercent: number;
  stockLabel: string;
  stockRemaining: number;
  rating: number;
  reviewCount: number;
  distanceKm: number;
  originalPrice: number;
  discountedPrice: number;
  description: string;
  pickupTime: { from: string; to: string };
  pickupLocation: string;
  consumeWindow: string;
  co2eSavedKg: number;
  packageContents: string[];
}

export interface Review {
  id: string;
  reviewerName: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface RelatedProduct {
  id: string;
  slug: string;
  vendorName: string;
  name: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
}

export const formatIDR = (value: number): string => value.toLocaleString('id-ID');

export const PRODUCT: ProductDetail = {
  id: 'rb-001',
  slug: 'paket-nasi-ayam-surplus',
  category: 'Makanan Berat',
  vendor: {
    id: 'v-bu-timi',
    name: 'Dapur Bu Timi',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    rating: 4.9,
    isRescuePartner: true,
  },
  title: 'Paket Nasi Ayam Surplus',
  images: [
    '/makanan2.jpeg',
    '/makanan1.jpeg',
    '/makanan6.jpeg',
    '/makanan5.jpeg',
    '/makanan8.webp',
  ],
  discountPercent: 63,
  stockLabel: 'Sisa 2 porsi',
  stockRemaining: 2,
  rating: 4.8,
  reviewCount: 294,
  distanceKm: 1.2,
  originalPrice: 38000,
  discountedPrice: 14000,
  description:
    'Nasi ayam surplus yang masih segar dari dapur Bu Timi sore ini — dimasak pagi, dijamin layak dan tetap nikmat. Ambil sebelum pukul 13.00 dan kamu ikut mengurangi food waste sambil menikmati masakan rumahan yang hangat.',
  pickupTime: { from: '11.00', to: '13.00' },
  pickupLocation: 'Jl. Melati Raya No. 12, Depok',
  consumeWindow: 'Maks. 4 jam setelah diambil',
  co2eSavedKg: 1.8,
  packageContents: [
    'Nasi putih hangat, 1 porsi',
    'Ayam goreng bumbu kuning + sambal',
    'Sayur tumis + kerupuk',
    'Box + sendok, dikemas rapi dan sealed',
    'Bonus lauk tempe goreng selagi stok masih ada',
  ],
};

export const REVIEWS: Review[] = [
  {
    id: 'r-001',
    reviewerName: 'Sari Wijaya',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    rating: 5,
    comment:
      'Fresh dan masih hangat saat diambil. Bumbu ayamnya ngena banget, porsinya jujur. Pasti repeat order!',
    date: '12 Agustus 2026',
  },
  {
    id: 'r-002',
    reviewerName: 'Budi Hartanto',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    rating: 5,
    comment:
      'Hemat banget dibanding beli normal, rasanya nggak kalah sama nasi kotak di kantin. Cocok buat makan siang.',
    date: '10 Agustus 2026',
  },
  {
    id: 'r-003',
    reviewerName: 'Mega Putri',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    rating: 4,
    comment:
      'Enak dan dikemas rapi. Lokasinya agak jauh dari rumah jadi cuma ambil kalau lewat sini. Worth it sih.',
    date: '8 Agustus 2026',
  },
];

export const RELATED_PRODUCTS: RelatedProduct[] = [
  {
    id: 'rp-001',
    slug: 'mystery-box-roti-sore',
    vendorName: 'Roti Boy',
    name: 'Mystery Box Roti Sore',
    image: '/makanan8.webp',
    originalPrice: 30000,
    discountedPrice: 12000,
  },
  {
    id: 'rp-002',
    slug: 'paket-lauk-rumahan',
    vendorName: 'Dapur Ibu Sri',
    name: 'Paket Lauk Rumahan',
    image: '/makanan6.jpeg',
    originalPrice: 25000,
    discountedPrice: 10000,
  },
  {
    id: 'rp-003',
    slug: 'nasi-kotak-surplus',
    vendorName: 'Warung Mang Teten',
    name: 'Nasi Kotak Surplus Kantor',
    image: '/makanan3.jpeg',
    originalPrice: 22000,
    discountedPrice: 9000,
  },
  {
    id: 'rp-004',
    slug: 'kue-basah-campur',
    vendorName: 'Kue Mbok Darmi',
    name: 'Kue Basah Campur',
    image: '/makanan7.jpg',
    originalPrice: 35000,
    discountedPrice: 15000,
  },
  {
    id: 'rp-005',
    slug: 'sayur-segar-pasar',
    vendorName: 'Segar Sigit',
    name: 'Sayur Segar Pasar',
    image: '/makanan5.jpeg',
    originalPrice: 15000,
    discountedPrice: 8000,
  },
];
