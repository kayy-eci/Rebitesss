'use client';

import { supabase } from './supabase';
import { getSellerUmkm } from './product-storage';
import type { StoredOrder, FulfillmentMode, DeliveryAddress } from './types';

export const ORDERS_UPDATED_EVENT = 'rebites-orders-updated';

export function createOrderId(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `RB-${stamp}${rand}`;
}

function dispatchUpdated(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(ORDERS_UPDATED_EVENT));
}

type OrderRow = Record<string, any>;

export function rowToStoredOrder(row: OrderRow): StoredOrder {
  return {
    orderId: row.order_code ?? row.id,
    userId: row.buyer_id ?? undefined,
    productId: row.product_slug ?? '',
    productName: row.product_name ?? '',
    vendorName: row.vendor_name ?? '',
    vendorSlug: row.vendor_slug ?? '',
    image: row.image_url ?? '',
    quantity: row.quantity ?? 1,
    fulfillment: (row.delivery_option === 'delivery'
      ? 'delivery'
      : 'pickup') as FulfillmentMode,
    addressSnapshot: (row.address_snapshot ?? null) as Omit<DeliveryAddress, 'id'> | null,
    paymentMethodId: row.payment_method_id ?? 'tanpa-pembayaran',
    subtotal: row.subtotal ?? 0,
    discount: row.discount ?? 0,
    serviceFee: row.service_fee ?? 0,
    deliveryFee: row.delivery_fee ?? 0,
    totalBeforeCoin: row.total_before_coin ?? undefined,
    coinUsed: row.coin_used ?? undefined,
    total: row.total_price ?? 0,
    coinEarned: row.coin_earned ?? 0,
    createdAt: row.created_at ?? new Date().toISOString(),
    unitPrice: row.unit_price ?? undefined,
    promoCode: row.promo_code ?? null,
    status:
      row.lifecycle_status === 'completed' || row.lifecycle_status === 'ongoing'
        ? (row.lifecycle_status as StoredOrder['status'])
        : 'ongoing',
    orderStatus: row.order_status ?? row.lifecycle_status ?? 'ongoing',
    estimatedMinutes: row.estimated_minutes ?? undefined,
    estimatedCompletionAt: row.estimated_completion_at ?? undefined,
    completedAt: row.completed_at ?? undefined,
    distanceKm: row.distance_km ?? undefined,
    vendorAddress: row.vendor_address ?? undefined,
    vendorOpenHours: row.vendor_open_hours ?? undefined,
    preparationMinutes: row.preparation_minutes ?? undefined,
    co2eSavedKg: row.co2e_saved_kg ?? undefined,
    deliveryDistanceKm: row.delivery_distance_km ?? undefined,
    estimatedDeliveryMinutes: row.estimated_delivery_minutes ?? undefined,
    deliveryStartedAt: row.delivery_started_at ?? undefined,
    estimatedArrivalAt: row.estimated_arrival_at ?? undefined,
  };
}

function storedOrderToRow(order: StoredOrder): OrderRow {
  return {
    order_code: order.orderId,
    buyer_id: order.userId,
    product_slug: order.productId,
    product_name: order.productName,
    vendor_name: order.vendorName,
    vendor_slug: order.vendorSlug,
    image_url: order.image,
    quantity: order.quantity,
    delivery_option: order.fulfillment,
    address_snapshot: order.addressSnapshot,
    payment_method_id: order.paymentMethodId,
    unit_price: order.unitPrice,
    subtotal: order.subtotal,
    discount: order.discount,
    service_fee: order.serviceFee,
    delivery_fee: order.deliveryFee,
    total_before_coin: order.totalBeforeCoin,
    coin_used: order.coinUsed,
    total_price: order.total,
    coin_earned: order.coinEarned,
    promo_code: order.promoCode ?? null,
    lifecycle_status: order.status ?? 'ongoing',
    estimated_minutes: order.estimatedMinutes,
    estimated_completion_at: order.estimatedCompletionAt ?? null,
    completed_at: order.completedAt ?? null,
    distance_km: order.distanceKm ?? null,
    vendor_address: order.vendorAddress ?? null,
    vendor_open_hours: order.vendorOpenHours ?? null,
    preparation_minutes: order.preparationMinutes,
    co2e_saved_kg: order.co2eSavedKg,
  };
}

export async function saveOrder(order: StoredOrder): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .insert(storedOrderToRow(order));
  if (error) {
    console.error('[order-storage] gagal menyimpan pesanan:', error.message);
    throw error;
  }
  dispatchUpdated();
}

export async function getUserOrders(userId: string | null | undefined): Promise<StoredOrder[]> {
  if (!userId) return [];
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('buyer_id', userId)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('[order-storage] gagal memuat pesanan:', error.message);
    return [];
  }
  return (data ?? []).map(rowToStoredOrder);
}

export async function getAllOrders(): Promise<StoredOrder[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('[order-storage] gagal memuat semua pesanan:', error.message);
    return [];
  }
  return (data ?? []).map(rowToStoredOrder);
}

/** Pesanan yang masuk ke toko milik seller yang sedang login. */
export async function getSellerOrders(): Promise<StoredOrder[]> {
  const umkm = await getSellerUmkm();
  // Tanpa profil toko -> tidak ada pesanan masuk.
  // (Jangan fallback ke toko demo agar data antar-penjual tidak tercampur.)
  if (!umkm) return [];

  // vendor_slug pada order bisa berupa slug maupun id UMKM
  // (tergantung nilai yang dipakai saat checkout), jadi cocokkan keduanya.
  const identifiers = new Set(
    [umkm.slug, umkm.id].filter((value): value is string => Boolean(value))
  );
  const all = await getAllOrders();
  return all.filter((order) => identifiers.has(order.vendorSlug));
}

export async function getOrderById(orderId: string): Promise<StoredOrder | undefined> {
  // Pastikan session sudah di-restore SEBELUM query. Setelah redirect balik
  // dari Xendit, query yang terlalu dini berjalan sebagai anon sehingga RLS
  // "orders_select_participants" (khusus authenticated) memblokir baris —
  // pesanan tampak "tidak ditemukan" padahal ada di database.
  await supabase.auth.getSession();

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('order_code', orderId)
    .maybeSingle();
  if (error) {
    console.error('[order-storage] gagal memuat pesanan:', error.message);
    return undefined;
  }
  if (data) return rowToStoredOrder(data);
  return undefined;
}

const PATCH_COLUMN_MAP: Record<string, string> = {
  status: 'lifecycle_status',
  orderStatus: 'order_status',
  completedAt: 'completed_at',
  paymentMethodId: 'payment_method_id',
  note: 'note',
  deliveryDistanceKm: 'delivery_distance_km',
  estimatedDeliveryMinutes: 'estimated_delivery_minutes',
  deliveryStartedAt: 'delivery_started_at',
  estimatedArrivalAt: 'estimated_arrival_at',
};

export async function patchOrder(
  orderId: string,
  patch: Partial<StoredOrder>
): Promise<StoredOrder | undefined> {
  const payload: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(patch)) {
    const column = PATCH_COLUMN_MAP[key] ?? key;
    payload[column] = value;
  }
  if (Object.keys(payload).length === 0) return undefined;

  const { data, error } = await supabase
    .from('orders')
    .update(payload)
    .eq('order_code', orderId)
    .select()
    .maybeSingle();
  if (error) {
    console.error('[order-storage] gagal update pesanan:', error.message);
    return undefined;
  }
  if (!data) return undefined;
  dispatchUpdated();
  return rowToStoredOrder(data);
}

/** Menandai pesanan ongoing yang lewat estimasi sebagai completed.
 *  Hanya untuk pesanan yang sudah lunas (payment_status = paid) — pesanan
 *  belum bayar (Xendit unpaid/expired) tidak akan di-auto-complete. */
export async function completeExpiredOrders(userId: string | null | undefined): Promise<boolean> {
  if (!userId) return false;

  // Ambil payment_status langsung dari DB agar tidak mengandalkan StoredOrder
  const { data: paymentRows } = await supabase
    .from('orders')
    .select('order_code, payment_status, total_price')
    .eq('buyer_id', userId);

  const paidSet = new Set<string>();
  for (const row of (paymentRows ?? []) as Array<Record<string, unknown>>) {
    const code = row.order_code as string;
    const status = row.payment_status as string | null;
    const total = Number(row.total_price ?? 0);
    // Free orders (total 0) dianggap lunas walau payment_status masih unpaid sekilas
    if (status === 'paid' || total === 0) paidSet.add(code);
  }

  const orders = await getUserOrders(userId);
  const now = Date.now();
  let changed = false;    for (const order of orders) {
    if (order.status !== 'ongoing') continue;
    if (!paidSet.has(order.orderId)) continue;
    // Skip orders with granular status that require buyer/seller action
    const os = order.orderStatus;
    if (os === 'completed' || os === 'cancelled' || os === 'refunded') continue;
    if (os === 'ready_for_pickup' || os === 'out_for_delivery') continue;
    const deadline = order.estimatedCompletionAt
      ? new Date(order.estimatedCompletionAt).getTime()
      : new Date(order.createdAt).getTime() + (order.estimatedMinutes ?? 20) * 60_000;
    if (Number.isFinite(deadline) && now >= deadline) {
      const updated = await patchOrder(order.orderId, {
        status: 'completed',
        completedAt: new Date().toISOString(),
      });
      if (updated) {
        changed = true;
        // Kirim notifikasi selesai (best-effort, jangan block)
        try {
          const { notifyOrderCompleted } = await import('./order-notifications');
          await notifyOrderCompleted({ ...order, status: 'completed', completedAt: new Date().toISOString() });
        } catch {}
      }
    }
  }
  return changed;
}

/** Cek progress pesanan dan kirim notifikasi delivering jika sudah 60% durasi.
 *  Dipanggil bareng completeExpiredOrders polling. */
export async function syncDeliveringNotifications(userId: string | null | undefined): Promise<boolean> {
  if (!userId) return false;
  const { data: paymentRows } = await supabase
    .from('orders')
    .select('order_code, payment_status, total_price')
    .eq('buyer_id', userId);
  const paidSet = new Set<string>();
  for (const row of (paymentRows ?? []) as Array<Record<string, unknown>>) {
    const code = row.order_code as string;
    const status = row.payment_status as string | null;
    const total = Number(row.total_price ?? 0);
    if (status === 'paid' || total === 0) paidSet.add(code);
  }
  const orders = await getUserOrders(userId);
  const now = Date.now();
  let sent = false;
  for (const order of orders) {
    if (order.status !== 'ongoing') continue;
    if (!paidSet.has(order.orderId)) continue;
    if (!order.estimatedCompletionAt) continue;
    const start = new Date(order.createdAt).getTime();
    const end = new Date(order.estimatedCompletionAt).getTime();
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) continue;
    const progress = (now - start) / (end - start);
    if (progress >= 0.6 && progress < 1) {
      try {
        const { notifyOrderDelivering } = await import('./order-notifications');
        await notifyOrderDelivering(order);
        sent = true;
      } catch {}
    }
  }
  return sent;
}

/** Kurangi stok produk secara atomik lewat RPC reserve_stock. */
export async function reserveStock(productSlug: string, quantity: number): Promise<boolean> {
  const { data, error } = await supabase.rpc('reserve_stock', {
    p_slug: productSlug,
    p_quantity: quantity,
  });
  if (error) {
    console.error('[order-storage] reserve_stock gagal:', error.message);
    return false;
  }
  return data === true;
}
