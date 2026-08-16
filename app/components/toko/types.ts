export interface StoreMenu {
  id: string;
  name: string;
  category: string;
  image: string;
  rating: number;
  stock: number;
  normalPrice: number;
  surplusPrice: number;
  availableFrom: string;
  availableTo: string;
  sold: number;
}

export interface StoreReview {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  menu: string;
  comment: string;
}
