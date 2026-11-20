import type {
  Product, CreateOrderPayload, OrderRecord, OrderLookupRecord,
  CreatePaymentLinkPayload, PaymentLinkResponse, PaymentOrderStatus
} from '../types/index.js';

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

// Fallback initial products if backend is not started
const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'tuy-loan-banh-trang-hop-5-cai',
    name: 'Hộp Bánh Tráng Túy Loan (5 cái)',
    subtitle: 'Đặc sản Hòa Vang – Đà Nẵng',
    category: 'dac-san',
    price: 120000,
    volume: 'Hộp 5 cái',
    description: 'Bánh tráng Túy Loan nguyên chất, đặc sản làng nghề truyền thống Hòa Vang, Đà Nẵng.',
    story: 'Giữ lửa Túy Loan – Giữ hồn xứ Quảng.',
    notes: { top: [], middle: [], base: [] },
    image: '/products/tuy-loan-rice-paper.png',
    badge: 'Đặc sản Túy Loan',
    inStock: true,
    rating: 5,
    reviewsCount: 0
  }
];

export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products`);
    if (!res.ok) throw new Error('API request failed');
    const data = await res.json();
    return data.data;
  } catch {
    return FALLBACK_PRODUCTS;
  }
}

export async function fetchCheckoutProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE_URL}/api/products`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Không thể tải sản phẩm từ MongoDB');
  return data.data as Product[];
}

export async function createPaymentLink(payload: CreatePaymentLinkPayload): Promise<PaymentLinkResponse> {
  const res = await fetch(`${API_BASE_URL}/api/payment/create-payment-link`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Không thể tạo mã QR thanh toán');
  return data as PaymentLinkResponse;
}

export async function fetchPaymentOrderStatus(orderCode: number): Promise<PaymentOrderStatus> {
  const res = await fetch(`${API_BASE_URL}/api/payment/order/${orderCode}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Không thể kiểm tra trạng thái đơn hàng');
  return data.order as PaymentOrderStatus;
}

export async function createOrder(payload: CreateOrderPayload): Promise<{
  success: boolean;
  order: OrderRecord;
  payment?: {
    checkoutUrl: string | null;
    qrCode: string;
    orderCode: number;
    isSimulated?: boolean;
  };
  message?: string;
}> {
  const res = await fetch(`${API_BASE_URL}/api/payment/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Không thể lưu đơn hàng');
  return data;
}

export async function checkOrderStatus(orderCode: number): Promise<OrderRecord | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/payment/order-status/${orderCode}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.order;
  } catch {
    return null;
  }
}

export async function lookupOrdersByPhone(phone: string): Promise<OrderLookupRecord[]> {
  const res = await fetch(`${API_BASE_URL}/api/payment/lookup-orders?phone=${encodeURIComponent(phone)}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Không thể tra cứu đơn hàng');
  return data.data;
}

export async function simulateSuccess(orderCode: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/payment/simulate-success/${orderCode}`, {
      method: 'POST'
    });
    return res.ok;
  } catch {
    return false;
  }
}
