'use client';

import { getAllOrders } from './order-storage';
import { getSellerProducts } from './product-storage';
import { SELLER_VENDOR_SLUG } from './product-storage';

export interface BestSellingMenu {
  sellerId: string;
  menuId: string;
  name: string;
  image: string;
  surplusPrice: number;
  terjual: number;
}

function demoSoldQuantity(menuId: string): number {
  let hash = 0;
  for (let i = 0; i < menuId.length; i += 1) {
    hash = (hash * 31 + menuId.charCodeAt(i)) >>> 0;
  }
  return 5 + (hash % 26);
}

export async function getSellerBestSellingMenus(): Promise<BestSellingMenu[]> {
  const products = await getSellerProducts();

  const allOrders = await getAllOrders();
  const orders = allOrders.filter(
    (order) => order.vendorSlug === SELLER_VENDOR_SLUG
  );

  const soldByMenuId = new Map<string, number>();
  for (const order of orders) {
    soldByMenuId.set(
      order.productId,
      (soldByMenuId.get(order.productId) ?? 0) + order.quantity
    );
  }

  return products
    .map((product) => ({
      sellerId: SELLER_VENDOR_SLUG,
      menuId: product.id,
      name: product.name,
      image: product.image,
      surplusPrice: product.surplusPrice,
      terjual:
        orders.length > 0
          ? (soldByMenuId.get(product.id) ?? 0)
          : demoSoldQuantity(product.id),
    }))
    .sort((a, b) => b.terjual - a.terjual || a.name.localeCompare(b.name));
}
