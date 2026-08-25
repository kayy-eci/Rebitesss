'use client';

import { foodItems } from './data';
import type { FoodItem } from '../types';

export const SELLER_VENDOR_SLUG = 'dapur-ibu-tini';
export const SELLER_VENDOR_NAME = 'Dapur Ibu Tini';

const STORAGE_KEY = 'rebites-seller-products';

export const PRODUCTS_UPDATED_EVENT = 'rebites-seller-products-updated';

export interface SellerProduct {

  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  originalPrice: number;
  surplusPrice: number;
  discountPercent: number;
  stock: number;
  startTime: string;
  endTime: string;

  allDay?: boolean;
  isSurplusToday: boolean;

  featured?: boolean;

  flashSale?: {
    price: number;
    startIso: string;
    endIso: string;
  } | null;
  createdAt: string;
}

function parseStock(label: string): number {
  const match = label.match(/\d+/);
  return match ? Number(match[0]) : 8;
}

function normalizeTime(value: string): string {
  const match = value.match(/(\d{1,2})[.:](\d{2})/);
  if (!match) return '09:00';
  return `${match[1].padStart(2, '0')}:${match[2]}`;
}

function toSellerProduct(item: FoodItem): SellerProduct {
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    description: '',
    image: item.image,
    originalPrice: item.originalPrice,
    surplusPrice: item.discountedPrice,
    discountPercent: item.discountPercent,
    stock: parseStock(item.stockLabel),
    startTime: normalizeTime(item.availableFrom),
    endTime: normalizeTime(item.availableTo),
    isSurplusToday: true,
    featured: false,
    createdAt: new Date().toISOString(),
  };
}

function readRaw(): SellerProduct[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    return parsed.filter(
      (item): item is SellerProduct =>
        !!item &&
        typeof item === 'object' &&
        typeof (item as SellerProduct).id === 'string' &&
        typeof (item as SellerProduct).name === 'string'
    );
  } catch {
    return null;
  }
}

function writeRaw(products: SellerProduct[]): void {

  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  window.dispatchEvent(new Event(PRODUCTS_UPDATED_EVENT));
}

export function getSellerProducts(): SellerProduct[] {
  const existing = readRaw();
  if (existing) return existing;

  const seeded = foodItems
    .filter((item) => item.vendorName === SELLER_VENDOR_NAME)
    .slice(0, 5)
    .map(toSellerProduct);

  writeRaw(seeded);
  return seeded;
}

export function getSellerProductCount(): number {
  return getSellerProducts().length;
}

export function saveSellerProduct(
  input: Omit<SellerProduct, 'id' | 'createdAt'>
): SellerProduct {
  const product: SellerProduct = {
    ...input,
    id: `PRD-${Date.now().toString(36).toUpperCase()}${Math.random()
      .toString(36)
      .slice(2, 5)
      .toUpperCase()}`,
    createdAt: new Date().toISOString(),
  };
  const products = getSellerProducts();
  writeRaw([product, ...products]);
  return product;
}

export function patchSellerProduct(
  productId: string,
  patch: Partial<Omit<SellerProduct, 'id'>>
): SellerProduct | undefined {
  const products = getSellerProducts();
  let updated: SellerProduct | undefined;

  const next = products.map((product) => {
    if (product.id !== productId) return product;
    updated = { ...product, ...patch };
    return updated;
  });

  if (updated) writeRaw(next);
  return updated;
}

export function deleteSellerProduct(productId: string): void {
  const products = getSellerProducts();
  writeRaw(products.filter((product) => product.id !== productId));
}

export function getFeaturedProductIds(): string[] {
  return getSellerProducts()
    .filter((product) => product.featured)
    .map((product) => product.id);
}

export function isProductAvailable(product: SellerProduct): boolean {
  if (product.stock <= 0) return false;
  if (product.allDay) return true;
  return isWithinSaleWindow(product.startTime, product.endTime);
}

export function isWithinSaleWindow(
  startTime: string,
  endTime: string
): boolean {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const start = parseTimeToMinutes(startTime);
  const end = parseTimeToMinutes(endTime);
  if (start <= end) {
    return currentMinutes >= start && currentMinutes < end;
  }

  return currentMinutes >= start || currentMinutes < end;
}

function parseTimeToMinutes(time: string): number {
  const match = time.match(/(\d{1,2}):(\d{2})/);
  if (!match) return 0;
  return Number(match[1]) * 60 + Number(match[2]);
}

export function getSellerProductById(
  id: string
): SellerProduct | undefined {
  return getSellerProducts().find((p) => p.id === id);
}
