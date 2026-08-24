'use client';

import { readSellerPlan, type SellerEntitlements } from './seller-plan';
import {
  SELLER_VENDOR_NAME,
  getSellerProducts,
  isProductAvailable,
  patchSellerProduct,
  type SellerProduct,
} from './product-storage';
import type { UrgentItem, UrgentSlot } from './types';

export type FlashSaleStatus = 'inactive' | 'scheduled' | 'active' | 'ended';

export interface FlashSaleConfig {
  price: number;
  startIso: string;
  endIso: string;
}

export interface FlashSaleResult {
  ok: boolean;
  error?: string;
}

export function getFlashQuota(plan: SellerEntitlements): number {
  return plan.maxFlashSaleProducts ?? Infinity;
}

export function countFlashSaleProducts(products: SellerProduct[]): number {
  return products.filter((product) => product.flashSale != null).length;
}

function quotaErrorMessage(plan: SellerEntitlements): string {
  if (plan.tier === 'basic') {
    return 'Fitur Flash Sale tersedia mulai dari paket Standar. Upgrade paket untuk menambahkan produk ke Flash Sale.';
  }
  return `Paket ${plan.label.replace('ReBites ', '')} hanya dapat memasukkan ${plan.maxFlashSaleProducts} produk ke Flash Sale.`;
}

export function resolveFlashSaleStatus(
  product: SellerProduct,
  now: number = Date.now()
): FlashSaleStatus {
  const flash = product.flashSale;
  if (!flash) return 'inactive';

  const start = new Date(flash.startIso).getTime();
  const end = new Date(flash.endIso).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end)) return 'inactive';
  if (now < start) return 'scheduled';
  if (now >= end) return 'ended';
  return 'active';
}

export function getFlashDiscountPercent(product: SellerProduct): number {
  const flash = product.flashSale;
  if (!flash || product.originalPrice <= 0) return 0;
  return Math.max(
    0,
    Math.round((1 - flash.price / product.originalPrice) * 100)
  );
}

export function getDisplayPricing(
  product: SellerProduct,
  now: number = Date.now()
): { price: number; isFlash: boolean } {
  if (
    product.flashSale &&
    resolveFlashSaleStatus(product, now) === 'active' &&
    isProductAvailable(product)
  ) {
    return { price: product.flashSale.price, isFlash: true };
  }
  return { price: product.surplusPrice, isFlash: false };
}

export async function setFlashSale(
  productId: string,
  config: FlashSaleConfig,
  planOverride?: SellerEntitlements
): Promise<FlashSaleResult> {
  const products = await getSellerProducts();
  const product = products.find((item) => item.id === productId);
  if (!product) return { ok: false, error: 'Produk tidak ditemukan.' };

  const plan = planOverride ?? (await readSellerPlan());
  const usedByOthers = countFlashSaleProducts(
    products.filter((item) => item.id !== productId && item.flashSale != null)
  );
  if (usedByOthers + 1 > getFlashQuota(plan)) {
    return { ok: false, error: quotaErrorMessage(plan) };
  }

  if (!Number.isFinite(config.price) || config.price <= 0) {
    return { ok: false, error: 'Harga Flash Sale tidak valid.' };
  }
  if (config.price >= product.surplusPrice) {
    return {
      ok: false,
      error: 'Harga Flash Sale harus lebih rendah dari harga normal.',
    };
  }

  const start = new Date(config.startIso).getTime();
  const end = new Date(config.endIso).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    return { ok: false, error: 'Periode Flash Sale tidak valid.' };
  }
  if (end <= start) {
    return { ok: false, error: 'Waktu selesai harus setelah waktu mulai.' };
  }

  await patchSellerProduct(productId, {
    flashSale: {
      price: config.price,
      startIso: config.startIso,
      endIso: config.endIso,
    },
  });
  return { ok: true };
}

export async function removeFlashSale(productId: string): Promise<FlashSaleResult> {
  const products = await getSellerProducts();
  if (!products.some((item) => item.id === productId)) {
    return { ok: false, error: 'Produk tidak ditemukan.' };
  }
  await patchSellerProduct(productId, { flashSale: null });
  return { ok: true };
}

export interface FlashSaleCardItem extends UrgentItem {
  startsAt?: string;
  endsAt?: string;
  isSellerFlash?: boolean;
}

function wibHourOf(iso: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    hour12: false,
  }).formatToParts(new Date(iso));
  return (Number(parts.find((p) => p.type === 'hour')?.value ?? 0) % 24);
}

function slotFromStartIso(iso: string): UrgentSlot {
  const hour = wibHourOf(iso);
  if (hour >= 18) return '18-21';
  if (hour >= 15) return '15-18';
  if (hour >= 12) return '12-15';
  return '09-12';
}

export async function getActiveFlashSaleProducts(
  now: number = Date.now()
): Promise<FlashSaleCardItem[]> {
  const products = await getSellerProducts();
  return products
    .filter((product) => product.flashSale != null)
    .filter(
      (product) =>
        resolveFlashSaleStatus(product, now) === 'active' ||
        resolveFlashSaleStatus(product, now) === 'scheduled'
    )
    .map((product) => {
      const flash = product.flashSale!;
      const isActive = resolveFlashSaleStatus(product, now) === 'active';
      const price = isActive ? flash.price : product.surplusPrice;
      const discountPercent =
        isActive && product.originalPrice > 0
          ? Math.max(
              0,
              Math.round((1 - flash.price / product.originalPrice) * 100)
            )
          : product.discountPercent;

      return {
        id: product.id,
        name: product.name,
        vendorName: SELLER_VENDOR_NAME,
        image: product.image,
        category: product.category as UrgentItem['category'],
        rating: 4.7,
        distanceKm: 1.8,
        availableFrom: product.startTime,
        availableTo: product.endTime,
        stockLabel: `${product.stock} porsi tersisa`,
        originalPrice: product.originalPrice,
        discountedPrice: price,
        discountPercent,
        expiresAt: flash.endIso,
        slot: slotFromStartIso(flash.startIso),
        startsAt: flash.startIso,
        endsAt: flash.endIso,
        isSellerFlash: true,
      } satisfies FlashSaleCardItem;
    });
}
