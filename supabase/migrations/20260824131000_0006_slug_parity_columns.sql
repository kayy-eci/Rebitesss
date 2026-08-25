-- ============================================================================
-- 0006: paritas slug frontend
--   orders.product_slug  : StoredOrder.productId berbasis slug
--   reviews.order_code   : OrderReview.orderId berbasis kode RB-xxx
-- ============================================================================

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS product_slug text;

CREATE INDEX IF NOT EXISTS idx_orders_product_slug ON public.orders(product_slug);

ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS order_code text;

-- satu review per user per order (paritas saveReview yang menimpa review lama)
CREATE UNIQUE INDEX IF NOT EXISTS reviews_once_per_user_order
  ON public.reviews(user_id, order_code) WHERE order_code IS NOT NULL;
