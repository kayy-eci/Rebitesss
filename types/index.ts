export type UserRole = 'admin' | 'umkm' | 'buyer';

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'processing'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'cancelled'
  | 'refunded';

export type DeliveryOption = 'delivery' | 'pickup';

export type PaymentStatus = 'unpaid' | 'paid' | 'failed' | 'refunded';

export type ProductStatus = 'available' | 'sold_out' | 'hidden';

export type SubscriptionStatus = 'trial' | 'active' | 'expired' | 'cancelled';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  phone: string | null;
  avatar_url: string | null;
  is_verified: boolean;
  created_at: string;
}

export interface UMKMProfile {
  id: string;
  user_id: string;
  business_name: string;
  description: string | null;
  category: string | null;
  address: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  logo_url: string | null;
  is_verified: boolean;
  rating: number;
  created_at: string;
}

export interface Product {
  id: string;
  umkm_id: string;
  name: string;
  description: string | null;
  category: string;
  original_price: number;
  surplus_price: number;
  stock: number;
  status: ProductStatus;
  image_url: string | null;
  sell_window_start: string | null;
  sell_window_end: string | null;
  is_delivery: boolean;
  is_pickup: boolean;
  created_at: string;
}

export interface Plan {
  id: string;
  name: string;
  price_monthly: number;
  price_yearly: number;
  max_products: number;
  features: string[];
  is_popular: boolean;
}

export interface Subscription {
  id: string;
  umkm_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  trial_ends_at: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  buyer_id: string;
  umkm_id: string;
  product_id: string;
  quantity: number;
  total_price: number;
  delivery_option: DeliveryOption;
  delivery_address: string | null;
  note: string | null;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  created_at: string;
}

export interface OrderWithDetails extends Order {
  product?: Pick<Product, 'name' | 'image_url' | 'surplus_price'>;
  umkm?: Pick<UMKMProfile, 'business_name' | 'city'>;
  buyer?: Pick<Profile, 'full_name' | 'email'>;
}

export interface ProductWithUMKM extends Product {
  umkm: Pick<UMKMProfile, 'id' | 'business_name' | 'city' | 'rating'>;
}
