import type { StoreMenu, StoreReview } from './types';

export const STORE = {
  slug: 'dapur-ibu-tini',
  name: 'Dapur Ibu Tini',
  ownerName: 'Tini Rahayu',
  tier: 'UMKM Partner · Level 3',
  avatar:
    'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=320',
  tagline: 'Masakan rumahan hangat, harga sahabat.',
  description:
    'Dapur Ibu Tini menyajikan masakan rumahan hangat yang dimasak segar setiap pagi. Sebagai UMKM partner ReBites, kami menawarkan porsi surplus dengan harga hemat agar tidak ada makanan yang terbuang. Setiap porsi disiapkan dari bahan segar, porsi pas, dan penuh cinta ala masakan ibu.',
  memberSince: 2023,
  storeId: 'RB-****-0427',
  location: 'SMP Taruna Bhakti, Kota Bogor',
  hours: '16.00 – 19.00 WIB',
  responseTime: '± 3 menit',
  rating: 4.8,
  reviewCount: 24,
  followers: 128,
  ordersServed: 148,
  co2eSaved: 61,
};

export const STORE_MENUS: StoreMenu[] = [
  {
    id: 'rice-bowl-ayam',
    name: 'Rice Bowl Ayam',
    category: 'Masakan Rumah',
    image: '/foods/ikansayur.jpg',
    rating: 4.8,
    stock: 5,
    normalPrice: 28000,
    surplusPrice: 16800,
    availableFrom: '16.00',
    availableTo: '19.00',
    sold: 42,
  },
  {
    id: 'sup-krim-labu',
    name: 'Sup Krim Labu Hangat',
    category: 'Sup & Hangat',
    image: '/foods/supkrimlabu.jpg',
    rating: 4.7,
    stock: 8,
    normalPrice: 22000,
    surplusPrice: 11000,
    availableFrom: '16.00',
    availableTo: '19.00',
    sold: 35,
  },
  {
    id: 'urap-sayur',
    name: 'Urap Sayur Segar',
    category: 'Lauk & Protein',
    image: '/foods/saladkebun.jpg',
    rating: 4.6,
    stock: 6,
    normalPrice: 18000,
    surplusPrice: 14400,
    availableFrom: '16.00',
    availableTo: '19.00',
    sold: 28,
  },
  {
    id: 'es-teh-manis',
    name: 'Es Teh Manis',
    category: 'Minuman',
    image: '/foods/kopisusu.jpg',
    rating: 4.5,
    stock: 12,
    normalPrice: 10000,
    surplusPrice: 8000,
    availableFrom: '16.00',
    availableTo: '19.00',
    sold: 19,
  },
  {
    id: 'donat-kampung',
    name: 'Donat Kampung',
    category: 'Snack & Jajanan',
    image: '/foods/boxdonat.jpg',
    rating: 4.6,
    stock: 4,
    normalPrice: 18000,
    surplusPrice: 12500,
    availableFrom: '16.00',
    availableTo: '19.00',
    sold: 24,
  },
];

export const STORE_REVIEWS: StoreReview[] = [
  {
    id: 'r1',
    author: 'Sarah Wijaya',
    avatar:
      'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=160',
    rating: 5,
    date: '2 hari lalu',
    menu: 'Rice Bowl Ayam',
    comment:
      'Porsinya pas banget dan masih hangat. Harganya jauh lebih hemat dari harga normal. Pasti balik lagi!',
  },
  {
    id: 'r2',
    author: 'Rina Permata',
    avatar:
      'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=160',
    rating: 5,
    date: '5 hari lalu',
    menu: 'Paket Nasi Ayam',
    comment:
      'Rasanya seperti masakan rumahan beneran. Packing rapi, pengambilannya cepat, pemiliknya ramah.',
  },
  {
    id: 'r3',
    author: 'Andi Firmansyah',
    avatar:
      'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=160',
    rating: 4,
    date: '1 minggu lalu',
    menu: 'Urap Sayur Segar',
    comment:
      'Sayurnya segar dan bumbunya enak. Semoga stok surplusnya makin banyak setiap harinya.',
  },
  {
    id: 'r4',
    author: 'Maya Lestari',
    avatar:
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=160',
    rating: 5,
    date: '2 minggu lalu',
    menu: 'Es Teh Manis',
    comment:
      'Jujur kaget, teh manis seenak ini harganya cuma segini. Recommended banget buat yang cari hemat.',
  },
];
