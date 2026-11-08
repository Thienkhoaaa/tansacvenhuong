export interface ScentNotes {
  top: string[];
  middle: string[];
  base: string[];
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: 'nuoc-hoa' | 'tram-huong' | 'tinh-dau' | 'nen-thom';
  price: number;
  originalPrice?: number;
  volume: string;
  description: string;
  story: string;
  notes: ScentNotes;
  image: string;
  badge?: string;
  inStock: boolean;
  rating: number;
  reviewsCount: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  notes?: string;
}

export interface CreateOrderPayload {
  customer: CustomerInfo;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: 'vietqr' | 'cod';
}

export interface OrderRecord {
  orderCode: number; // Integer required by PayOS
  customer: CustomerInfo;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: 'vietqr' | 'cod';
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  createdAt: string;
  paidAt?: string;
  payosPaymentLinkId?: string;
  checkoutUrl?: string;
  qrCodeUrl?: string;
}

