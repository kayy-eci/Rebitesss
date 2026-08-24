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



const VENDORS: Record<string, VendorInfo> = {
  'warung-nusantara': {
    id: 'warung-nusantara',
    name: 'Warung Nusantara',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    rating: 4.8,
    isRescuePartner: true,
  },
  'warkop-pak-iman': {
    id: 'warkop-pak-iman',
    name: 'Warkop Pak Iman',
    avatar: 'https://images.pexels.com/photos/19066564/pexels-photo-19066564.jpeg',
    rating: 4.9,
    isRescuePartner: true,
  },
  'dapur-ibu-tini': {
    id: 'dapur-ibu-tini',
    name: 'Dapur Ibu Tini',
    avatar: 'https://images.pexels.com/photos/30294334/pexels-photo-30294334.jpeg',
    rating: 4.7,
    isRescuePartner: false,
  },
};

export const PRODUCTS: Record<string, ProductDetail> = {
  'geprek-sambal-bawang': {
    id: 'geprek-sambal-bawang',
    slug: 'geprek-sambal-bawang',
    category: 'Makanan Berat',
    vendor: VENDORS['warung-nusantara'],
    title: 'Geprek Sambal Bawang',
    images: ['/makanan1.jpeg', '/makanan2.jpeg', '/makanan6.jpeg', '/makanan5.jpeg'],
    discountPercent: 50,
    stockLabel: 'Sisa 5 porsi',
    stockRemaining: 5,
    rating: 4.8,
    reviewCount: 128,
    distanceKm: 0.8,
    originalPrice: 35000,
    discountedPrice: 17500,
    description: 'Ayam geprek dengan sambal bawang fresh dari Warung Nusantara. Pedas gurih dan cocok untuk makan siang atau malam. Masih segar dan layak konsumsi.',
    pickupTime: { from: '17:00', to: '20:00' },
    pickupLocation: 'Jl. Pajajaran No. 18, Bogor',
    consumeWindow: 'Maks. 3 jam setelah diambil',
    co2eSavedKg: 1.2,
    packageContents: ['Nasi putih hangat', 'Ayam geprek sambal bawang', 'Lalapan segar', 'Box + sendok'],
  },
  'nasi-goreng-gila': {
    id: 'nasi-goreng-gila',
    slug: 'nasi-goreng-gila',
    category: 'Makanan Berat',
    vendor: VENDORS['warkop-pak-iman'],
    title: 'Nasi Goreng Gila',
    images: ['/makanan2.jpeg', '/makanan1.jpeg', '/makanan3.jpeg', '/makanan8.webp'],
    discountPercent: 50,
    stockLabel: 'Sisa 4 porsi',
    stockRemaining: 4,
    rating: 4.9,
    reviewCount: 203,
    distanceKm: 0.4,
    originalPrice: 30000,
    discountedPrice: 15000,
    description: 'Nasi goreng spesial dengan topping lengkap: sosis, bakso, telur, dan sayuran. Racikan bumbu khas Pak Iman yang bikin nagih.',
    pickupTime: { from: '07:00', to: '12:00' },
    pickupLocation: 'Jl. Suryakencana No. 7, Bogor',
    consumeWindow: 'Maks. 4 jam setelah diambil',
    co2eSavedKg: 1.0,
    packageContents: ['Nasi goreng gila porsi jumbo', 'Kerupuk', 'Acar', 'Box + sendok'],
  },
  'soto-mie-bogor': {
    id: 'soto-mie-bogor',
    slug: 'soto-mie-bogor',
    category: 'Makanan Berat',
    vendor: VENDORS['warung-nusantara'],
    title: 'Soto Mie Bogor',
    images: ['/makanan3.jpeg', '/makanan1.jpeg', '/makanan4.jpeg', '/makanan6.jpeg'],
    discountPercent: 40,
    stockLabel: 'Sisa 6 porsi',
    stockRemaining: 6,
    rating: 4.7,
    reviewCount: 89,
    distanceKm: 1.5,
    originalPrice: 28000,
    discountedPrice: 16800,
    description: 'Soto mie khas Bogor dengan kuah bening yang gurih, dilengkapi mie kuning, tauge, kol, dan daging sapi empuk. Resep turun temurun.',
    pickupTime: { from: '11:00', to: '14:00' },
    pickupLocation: 'Jl. Pajajaran No. 18, Bogor',
    consumeWindow: 'Maks. 2 jam setelah diambil',
    co2eSavedKg: 0.9,
    packageContents: ['Soto mie kuah bening', 'Mie kuning', 'Emping', 'Box + sendok'],
  },
  'sate-ayam-10-pcs': {
    id: 'sate-ayam-10-pcs',
    slug: 'sate-ayam-10-pcs',
    category: 'Makanan Berat',
    vendor: VENDORS['warung-nusantara'],
    title: 'Sate Ayam 10 Pcs',
    images: ['/makanan4.jpeg', '/makanan1.jpeg', '/makanan5.jpeg', '/makanan2.jpeg'],
    discountPercent: 50,
    stockLabel: 'Sisa 8 box',
    stockRemaining: 8,
    rating: 4.6,
    reviewCount: 67,
    distanceKm: 1.2,
    originalPrice: 25000,
    discountedPrice: 12500,
    description: 'Sate ayam 10 tusuk dengan bumbu kacang khas. Daging ayam segar dibakar dengan arang, memberikan aroma smoky yang menggugah selera.',
    pickupTime: { from: '08:00', to: '13:00' },
    pickupLocation: 'Jl. Pajajaran No. 18, Bogor',
    consumeWindow: 'Maks. 3 jam setelah diambil',
    co2eSavedKg: 0.8,
    packageContents: ['10 tusuk sate ayam', 'Bumbu kacang', 'Lontong', 'Box'],
  },
  'salad-segar-kebun': {
    id: 'salad-segar-kebun',
    slug: 'salad-segar-kebun',
    category: 'Buah & Sayur',
    vendor: VENDORS['dapur-ibu-tini'],
    title: 'Salad Segar Kebun',
    images: ['/makanan5.jpeg', '/makanan3.jpeg', '/makanan6.jpeg', '/makanan1.jpeg'],
    discountPercent: 40,
    stockLabel: 'Sisa 6 mangkuk',
    stockRemaining: 6,
    rating: 4.5,
    reviewCount: 54,
    distanceKm: 2.0,
    originalPrice: 24000,
    discountedPrice: 14400,
    description: 'Mix salad segar dari kebun lokal dengan dressing homemade. Cocok untuk kamu yang ingin makan sehat tanpa ribet.',
    pickupTime: { from: '09:00', to: '15:00' },
    pickupLocation: 'Jl. Raya Tajur No. 12, Bogor',
    consumeWindow: 'Maks. 5 jam setelah diambil',
    co2eSavedKg: 0.6,
    packageContents: ['Mix lettuce & sayuran segar', 'Dressing Caesar', 'Crouton', 'Mangkuk sealed'],
  },
  'pancong-lumer-coklat-keju': {
    id: 'pancong-lumer-coklat-keju',
    slug: 'pancong-lumer-coklat-keju',
    category: 'Jajanan',
    vendor: VENDORS['dapur-ibu-tini'],
    title: 'Pancong Lumer Coklat Keju',
    images: ['/makanan6.jpeg', '/makanan7.jpg', '/makanan2.jpeg', '/makanan4.jpeg'],
    discountPercent: 50,
    stockLabel: 'Sisa 3 mangkuk',
    stockRemaining: 3,
    rating: 4.7,
    reviewCount: 112,
    distanceKm: 1.1,
    originalPrice: 22000,
    discountedPrice: 11000,
    description: 'Pancong bandung dengan topping coklat dan keju yang lumer. Masih hangat dari dapur Ibu Tini, camilan sore yang sempurna.',
    pickupTime: { from: '12:00', to: '17:00' },
    pickupLocation: 'Jl. Raya Tajur No. 12, Bogor',
    consumeWindow: 'Maks. 2 jam setelah diambil',
    co2eSavedKg: 0.5,
    packageContents: ['6 pcs pancong lumer', 'Topping coklat & keju', 'Box kertas'],
  },
  'martabak-coklat-kacang': {
    id: 'martabak-coklat-kacang',
    slug: 'martabak-coklat-kacang',
    category: 'Jajanan',
    vendor: VENDORS['dapur-ibu-tini'],
    title: 'Martabak Coklat Kacang',
    images: ['/makanan7.jpg', '/makanan6.jpeg', '/makanan2.jpeg', '/makanan5.jpeg'],
    discountPercent: 40,
    stockLabel: 'Sisa 5 porsi',
    stockRemaining: 5,
    rating: 4.8,
    reviewCount: 156,
    distanceKm: 2.3,
    originalPrice: 45000,
    discountedPrice: 27000,
    description: 'Martabak manis tipis dengan taburan coklat meses dan kacang yang melimpah. Dibuat segar setiap sore oleh Dapur Ibu Tini.',
    pickupTime: { from: '18:00', to: '21:00' },
    pickupLocation: 'Jl. Jend. Sudirman No. 3, Bogor',
    consumeWindow: 'Maks. 4 jam setelah diambil',
    co2eSavedKg: 1.5,
    packageContents: ['1/2 martabak manis tipis', 'Topping coklat meses & kacang', 'Kotak kertas'],
  },
  'bakso-komplit': {
    id: 'bakso-komplit',
    slug: 'bakso-komplit',
    category: 'Makanan Berat',
    vendor: VENDORS['warkop-pak-iman'],
    title: 'Bakso Komplit',
    images: ['/makanan8.webp', '/makanan3.jpeg', '/makanan1.jpeg', '/makanan4.jpeg'],
    discountPercent: 50,
    stockLabel: 'Sisa 2 paket',
    stockRemaining: 2,
    rating: 4.9,
    reviewCount: 234,
    distanceKm: 0.6,
    originalPrice: 20000,
    discountedPrice: 10000,
    description: 'Paket bakso komplit dengan campuran bakso urat, bakso telur, bakso kecil, mie kuning, dan bihun. Kuah gurih dan tulang sum-sum.',
    pickupTime: { from: '06:30', to: '11:00' },
    pickupLocation: 'Jl. Baranangsiang No. 9, Bogor',
    consumeWindow: 'Maks. 2 jam setelah diambil',
    co2eSavedKg: 0.7,
    packageContents: ['Bakso urat, telur & kecil', 'Mie kuning & bihun', 'Kuah tulang sum-sum', 'Sambal & saus', 'Box bowl'],
  },
  'ketoprak-telor': {
    id: 'ketoprak-telor',
    slug: 'ketoprak-telor',
    category: 'Makanan Berat',
    vendor: VENDORS['dapur-ibu-tini'],
    title: 'Ketoprak Telor',
    images: ['/makanan9.webp', '/makanan3.jpeg', '/makanan1.jpeg', '/makanan5.jpeg'],
    discountPercent: 50,
    stockLabel: 'Sisa 12 porsi',
    stockRemaining: 12,
    rating: 4.6,
    reviewCount: 78,
    distanceKm: 0.9,
    originalPrice: 18000,
    discountedPrice: 9000,
    description: 'Ketoprak dengan telur dadar, tahu, lontong, dan bumbu kacang khas. Murah meriah tapi rasanya juara. Cocok buat makan siang.',
    pickupTime: { from: '13:00', to: '16:00' },
    pickupLocation: 'Jl. Raya Cibinong No. 45, Bogor',
    consumeWindow: 'Maks. 3 jam setelah diambil',
    co2eSavedKg: 0.4,
    packageContents: ['Ketoprak porsi lengkap', 'Telur dadar', 'Bumbu kacang khas', 'Kerupuk', 'Box'],
  },
  'mie-ayam': {
    id: 'mie-ayam',
    slug: 'mie-ayam',
    category: 'Makanan Berat',
    vendor: VENDORS['warkop-pak-iman'],
    title: 'Mie Ayam',
    images: ['/makanan10.webp', '/makanan8.webp', '/makanan3.jpeg', '/makanan1.jpeg'],
    discountPercent: 40,
    stockLabel: 'Sisa 4 porsi',
    stockRemaining: 4,
    rating: 4.7,
    reviewCount: 91,
    distanceKm: 2.5,
    originalPrice: 42000,
    discountedPrice: 25200,
    description: 'Mie ayam dengan topping ayam jamur yang gurih dan melimpah. Mie kuning bakso bikin sendiri dengan tekstur kenyal.',
    pickupTime: { from: '17:30', to: '20:30' },
    pickupLocation: 'Jl. Baranangsiang No. 9, Bogor',
    consumeWindow: 'Maks. 2 jam setelah diambil',
    co2eSavedKg: 0.8,
    packageContents: ['Mie kuning homemade', 'Topping ayam jamur', 'Pangsit goreng', 'Kuah kaldu', 'Box bowl'],
  },
};

const URGENCY_BASE_MAP: Record<string, string> = {
  'urgent-geprek-sambal-bawang': 'geprek-sambal-bawang',
  'urgent-nasi-goreng-gila': 'nasi-goreng-gila',
  'urgent-ketoprak-telor': 'ketoprak-telor',
  'urgent-martabak-coklat-kacang': 'martabak-coklat-kacang',
  'urgent-10-pcs-sate-ayam': 'sate-ayam-10-pcs',
  'urgent-rendang-bumbu-spesial': 'salad-segar-kebun',
  'urgent-bakso-komplit-nikmat': 'bakso-komplit',
  'urgent-soto-mie-bogor': 'soto-mie-bogor',
  'urgent-pancong-lumer-coklat-keju': 'pancong-lumer-coklat-keju',
  'urgent-mie-ayam': 'mie-ayam',
  'urgent-10-pcs-sate-ayam-2': 'sate-ayam-10-pcs',
  'urgent-geprek-sambal-bawang-malam': 'geprek-sambal-bawang',
  'urgent-ketoprak-telor-malam': 'ketoprak-telor',
};

export function getProductById(id: string): ProductDetail | undefined {
  if (PRODUCTS[id]) return PRODUCTS[id];
  const baseId = URGENCY_BASE_MAP[id];
  if (baseId) return PRODUCTS[baseId];
  return undefined;
}



export const PRODUCT: ProductDetail = PRODUCTS['geprek-sambal-bawang'] ?? {
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
