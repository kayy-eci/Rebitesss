import type { LucideIcon } from "lucide-react";

export type FoodCategory =
  | "bakery"
  | "restoran"
  | "minuman"
  | "umkm"
  | "Makanan Berat"
  | "Roti & Kue"
  | "Buah & Sayur"
  | "Jajanan"
  | "Japanese"
  | "Makanan Cepat Saji"
  | "Dessert"
  | "Minuman"
  | "Makanan & Minuman";

export type FilterKey =
  | "terdekat"
  | "diskon-terbesar"
  | "segera-habis"
  | "umkm"
  | "bakery"
  | "restoran"
  | "minuman";

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
  isRescuePartner: boolean;
  rating: number;
  distanceKm: number;
  category: string;
  itemCount: number;
  address: string;
  openHours: string;
  description: string;
}

export interface ImpactStat {
  id: string;
  icon: LucideIcon;
  value: number;
  suffix?: string;
  label: string;
}

export type UrgentSlot = "09-12" | "12-15" | "15-18" | "18-21";

export type FulfillmentMode = "pickup" | "delivery";

export type AddressLabel = "Rumah" | "Kos" | "Sekolah" | "Lainnya";

export interface DeliveryAddress {
  id: string;
  label: AddressLabel;
  receiverName: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  fullAddress: string;
  note?: string;
}

export type OrderLifecycleStatus = "ongoing" | "completed";

/** Titik koordinat opsional — siap dipakai bila data lokasi tersedia. */
export interface GeoPoint {
  latitude: number;
  longitude: number;
}

/**
 * Snapshot order yang dibuat saat checkout berhasil.
 * Semua nilai (harga, nama, alamat, coin, dsb.) adalah kondisi SAAT
 * transaksi terjadi — tidak ikut berubah ketika data produk berubah.
 *
 * Field bertanda `?` menjaga kompatibilitas dengan order lama
 * sebelum sistem Order Center; order tanpa userId dianggap legacy
 * dan disembunyikan dari riwayat user.
 */
export interface StoredOrder {
  orderId: string;
  /** Pemilik order — wajib untuk order baru. */
  userId?: string;
  productId: string;
  productName: string;
  vendorName: string;
  vendorSlug: string;
  image: string;
  quantity: number;
  fulfillment: FulfillmentMode;
  addressSnapshot: Omit<DeliveryAddress, "id"> | null;
  paymentMethodId: string;
  subtotal: number;
  discount: number;
  serviceFee: number;
  deliveryFee: number;
  totalBeforeCoin?: number;
  coinUsed?: number;
  total: number;
  coinEarned: number;
  createdAt: string;

  /* ── Snapshot Order Center ── */
  /** Harga satuan saat transaksi (draft.discountedPrice). */
  unitPrice?: number;
  /** Kode promo yang dipakai saat checkout, jika ada. */
  promoCode?: string | null;
  status?: OrderLifecycleStatus;
  /** Total estimasi penyelesaian dalam menit (prep + travel). */
  estimatedMinutes?: number;
  /** Waktu absolut estimasi selesai — sumber countdown (refresh-safe). */
  estimatedCompletionAt?: string;
  completedAt?: string;
  /** Jarak toko → alamat pengiriman (km), hanya relevan untuk delivery. */
  distanceKm?: number;
  vendorAddress?: string;
  vendorOpenHours?: string;
  /** Waktu persiapan toko dalam menit (dasar estimasi pickup). */
  preparationMinutes?: number;
  /** Estimasi CO2e yang dicegah (kg) — snapshot dari draft. */
  co2eSavedKg?: number;
}

/** Review pesanan selesai — minimal, terikat orderId + userId. */
export interface OrderReview {
  orderId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export type CoinTransactionType = "earned" | "spent";

/**
 * Satu entri pada buku besar ReBites Coin.
 * Saldo & total didapat selalu DITURUNKAN dari daftar transaksi ini,
 * sehingga tidak mungkin terjadi selisih antara saldo dan histori.
 */
export interface CoinTransaction {
  id: string;
  orderId?: string;
  type: CoinTransactionType;
  amount: number;
  createdAt: string;
  description: string;
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
  distanceKm?: number;
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
}

export interface PromoCode {
  code: string;
  percentOff: number;
  isValid: boolean;
}

export interface CheckoutSummary {
  subtotal: number;
  discount: number;
  serviceFee: number;
  deliveryFee: number;
  /** Total setelah promo & biaya, SEBELUM potongan Coin. */
  totalBeforeCoin: number;
  /** Jumlah Coin yang benar-benar dipakai (0 bila toggle OFF). */
  coinUsed: number;
  /** Potongan harga akibat Coin (1 Coin = Rp1). */
  coinDiscount: number;
  /** Sisa saldo Coin setelah pemakaian (informasional). */
  remainingCoin: number;
  total: number;
  totalSavings: number;
  co2eSaved: number;
  coinEarned: number;
}

export interface UrgentItem extends FoodItem {
  expiresAt: string;
  slot: UrgentSlot;
}
