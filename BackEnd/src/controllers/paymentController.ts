import { randomInt } from 'node:crypto';
import type { Request, Response } from 'express';
import { payOSClient, isPayOSConfigured } from '../config/payos.js';
import { OrderModel } from '../models/Order.js';
import { ProductModel } from '../models/Product.js';
import type { CreatePaymentLinkPayload } from '../types/index.js';

interface PendingCheckout {
  customer: { name: string; phone: string; address: string; notes?: string };
  items: Array<{ productId: string; name: string; price: number; quantity: number; image: string }>;
  amount: number;
  paymentLinkId: string;
  isTestMode: boolean;
  expiresAt: number;
}

// Customer delivery details stay process-local until PayOS confirms payment.
const pendingCheckouts = new Map<number, PendingCheckout>();

async function acceptPaidCheckout(orderCode: number, paidAmount: number, paymentLinkId: string): Promise<boolean> {
  const existingOrder = await OrderModel.findOne({ orderCode });
  if (existingOrder?.status === 'PAID') return true;

  const pending = pendingCheckouts.get(orderCode);
  if (!pending || pending.expiresAt < Date.now() || pending.amount !== paidAmount || pending.paymentLinkId !== paymentLinkId) {
    return false;
  }

  await OrderModel.create({
    orderCode,
    customer: pending.customer,
    items: pending.items,
    totalAmount: pending.amount,
    paymentMethod: 'vietqr',
    status: 'PAID',
    paidAt: new Date().toISOString(),
    payosPaymentLinkId: pending.paymentLinkId,
    isTestMode: pending.isTestMode
  });
  pendingCheckouts.delete(orderCode);
  return true;
}

function createOrderCode(): number {
  return randomInt(10_000_000, 99_999_999);
}

function normalizeVietnamesePhone(phone: string): string {
  const compact = phone.replace(/[\s().-]/g, '');
  if (compact.startsWith('+84')) return `0${compact.slice(3)}`;
  if (compact.startsWith('84')) return `0${compact.slice(2)}`;
  return compact;
}

export const createPaymentLink = async (req: Request, res: Response) => {
  try {
    const payload = req.body as CreatePaymentLinkPayload;
    const { customerInfo, items } = payload ?? {};
    if (!customerInfo || typeof customerInfo.fullName !== 'string' || !customerInfo.fullName.trim() ||
        typeof customerInfo.phone !== 'string' || typeof customerInfo.address !== 'string' || !customerInfo.address.trim() ||
        customerInfo.fullName.trim().length > 120 || customerInfo.address.trim().length > 500 ||
        (customerInfo.note !== undefined && (typeof customerInfo.note !== 'string' || customerInfo.note.length > 500)) ||
        !Array.isArray(items) || items.length === 0 || items.length > 50) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập họ tên, số điện thoại, địa chỉ và ít nhất một sản phẩm.' });
    }

    const phone = normalizeVietnamesePhone(customerInfo.phone);
    if (!/^0(?:3|5|7|8|9)\d{8}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'Số điện thoại Việt Nam không hợp lệ.' });
    }

    const quantities = new Map<string, number>();
    for (const item of items) {
      if (!item || typeof item.productId !== 'string' || !item.productId.trim() || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) {
        return res.status(400).json({ success: false, message: 'Danh sách sản phẩm hoặc số lượng không hợp lệ.' });
      }
      const nextQuantity = (quantities.get(item.productId) ?? 0) + item.quantity;
      if (nextQuantity > 99) return res.status(400).json({ success: false, message: 'Mỗi sản phẩm tối đa 99 đơn vị.' });
      quantities.set(item.productId, nextQuantity);
    }

    const products = await ProductModel.find({ id: { $in: [...quantities.keys()] } }).lean();
    if (products.length !== quantities.size) {
      return res.status(400).json({ success: false, message: 'Không tìm thấy một hoặc nhiều sản phẩm đã chọn.' });
    }
    if (products.some(product => !product.inStock)) {
      return res.status(409).json({ success: false, message: 'Một hoặc nhiều sản phẩm hiện đã hết hàng.' });
    }

    const orderItems = products.map(product => ({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantities.get(product.id)!,
      image: product.image
    }));
    const productTotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (!Number.isSafeInteger(productTotal) || productTotal < 1) {
      return res.status(400).json({ success: false, message: 'Tổng tiền sản phẩm không hợp lệ.' });
    }

    const testModeEnabled = process.env.NODE_ENV !== 'production' || process.env.PAYMENT_TEST_MODE_ENABLED === 'true';
    if (payload.isTestMode === true && !testModeEnabled) {
      return res.status(403).json({ success: false, message: 'Chế độ thanh toán thử nghiệm đang bị tắt trên môi trường này.' });
    }
    if (!isPayOSConfigured || !payOSClient) {
      return res.status(503).json({ success: false, message: 'PayOS chưa được cấu hình. Hãy thêm đủ PAYOS_CLIENT_ID, PAYOS_API_KEY và PAYOS_CHECKSUM_KEY.' });
    }

    const isTestMode = payload.isTestMode === true;
    const amount = isTestMode ? 2000 : productTotal;
    let orderCode = createOrderCode();
    while (await OrderModel.exists({ orderCode }) || pendingCheckouts.has(orderCode)) orderCode = createOrderCode();

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const payosItems = isTestMode
      ? [{ name: 'Kiểm thử thanh toán', quantity: 1, price: amount }]
      : orderItems.map(item => ({ name: item.name.slice(0, 50), quantity: item.quantity, price: item.price }));
    const paymentLink = await payOSClient.createPaymentLink({
      orderCode,
      amount,
      description: `TSVH ${orderCode}`.slice(0, 25),
      items: payosItems,
      cancelUrl: `${clientUrl}/test-checkout?status=cancel&orderCode=${orderCode}`,
      returnUrl: `${clientUrl}/test-checkout?status=return&orderCode=${orderCode}`
    });

    for (const [code, checkout] of pendingCheckouts) {
      if (checkout.expiresAt < Date.now()) pendingCheckouts.delete(code);
    }
    pendingCheckouts.set(orderCode, {
      customer: {
        name: customerInfo.fullName.trim(),
        phone,
        address: customerInfo.address.trim(),
        notes: typeof customerInfo.note === 'string' ? customerInfo.note.trim() : undefined
      },
      items: orderItems,
      amount,
      paymentLinkId: paymentLink.paymentLinkId,
      isTestMode,
      expiresAt: Date.now() + 2 * 60 * 60 * 1000
    });

    return res.status(201).json({
      success: true,
      order: { orderCode, status: 'PENDING' },
      checkoutUrl: paymentLink.checkoutUrl,
      qrCode: paymentLink.qrCode,
      orderCode,
      amount
    });
  } catch (error) {
    console.error('Create payment link failed:', error);
    return res.status(502).json({ success: false, message: 'Không thể tạo liên kết thanh toán PayOS. Đơn hàng chưa sẵn sàng để thanh toán.' });
  }
};

export const createOrder = async (_req: Request, res: Response) => {
  return res.status(410).json({ success: false, message: 'Endpoint cũ đã ngừng hoạt động. Dùng POST /api/payment/create-payment-link; đơn chỉ được lưu sau khi PayOS xác nhận thanh toán.' });
};

export const getOrderStatus = async (req: Request, res: Response) => {
  try {
    const order = await OrderModel.findOne({ orderCode: Number(req.params.orderCode) })
      .select('orderCode items totalAmount paymentMethod status createdAt paidAt qrCodeUrl checkoutUrl')
      .lean();
    if (!order) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    return res.json({ success: true, order });
  } catch (error) {
    console.error('Error fetching order status:', error);
    return res.status(500).json({ success: false, message: 'Không thể tra cứu đơn hàng' });
  }
};

export const getPaymentOrder = async (req: Request, res: Response) => {
  try {
    const orderCode = Number(req.params.orderCode);
    if (!Number.isSafeInteger(orderCode) || orderCode < 1) {
      return res.status(400).json({ success: false, message: 'Mã đơn hàng không hợp lệ.' });
    }
    let order = await OrderModel.findOne({ orderCode })
      .select('orderCode totalAmount paymentMethod status createdAt paidAt isTestMode')
      .lean();
    if (!order) {
      const pending = pendingCheckouts.get(orderCode);
      if (!pending || pending.expiresAt < Date.now()) {
        pendingCheckouts.delete(orderCode);
        return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng.' });
      }
      if (payOSClient) {
        try {
          const paymentInfo = await payOSClient.getPaymentLinkInformation(orderCode);
          if (paymentInfo.status === 'PAID' && paymentInfo.amountPaid >= pending.amount) {
            await acceptPaidCheckout(orderCode, paymentInfo.amountPaid, paymentInfo.id);
            order = await OrderModel.findOne({ orderCode })
              .select('orderCode totalAmount paymentMethod status createdAt paidAt isTestMode')
              .lean();
          }
        } catch (error) {
          console.error('PayOS payment status polling failed:', error);
        }
      }
      if (!order) return res.json({ success: true, order: { orderCode, totalAmount: pending.amount, paymentMethod: 'vietqr', status: 'PENDING', isTestMode: pending.isTestMode } });
    }
    if (!order) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng.' });
    return res.json({ success: true, order });
  } catch (error) {
    console.error('Error fetching payment order:', error);
    return res.status(500).json({ success: false, message: 'Không thể kiểm tra trạng thái đơn hàng.' });
  }
};

export const lookupOrdersByPhone = async (req: Request, res: Response) => {
  try {
    const rawPhone = typeof req.query.phone === 'string' ? req.query.phone.trim() : '';
    const phone = normalizeVietnamesePhone(rawPhone);
    if (!/^0(?:3|5|7|8|9)\d{8}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'Vui lòng nhập số điện thoại hợp lệ' });
    }
    const orders = await OrderModel.find({ 'customer.phone': { $in: [phone, rawPhone] } })
      .select('orderCode items totalAmount paymentMethod status createdAt paidAt')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    return res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    console.error('Error looking up orders:', error);
    return res.status(500).json({ success: false, message: 'Không thể tra cứu đơn hàng' });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  try {
    if (!isPayOSConfigured || !payOSClient) {
      console.error('Received PayOS webhook while PayOS is not configured.');
      return res.status(200).json({ success: false, message: 'PayOS chưa được cấu hình' });
    }
    let verifiedData;
    try {
      verifiedData = payOSClient.verifyPaymentWebhookData(req.body);
    } catch (error) {
      console.error('PayOS webhook signature verification failed:', error);
      return res.status(200).json({ success: false, message: 'Invalid webhook signature' });
    }
    if (verifiedData.code === '00') {
      const accepted = await acceptPaidCheckout(verifiedData.orderCode, verifiedData.amount, verifiedData.paymentLinkId);
      if (!accepted) console.error(`Payment confirmation received without a matching pending checkout for ${verifiedData.orderCode}.`);
    }
    return res.json({ success: true, message: 'Webhook processed' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(200).json({ success: false, message: 'Webhook processing error' });
  }
};

export const simulatePaymentSuccess = async (req: Request, res: Response) => {
  return res.status(410).json({ success: false, message: 'Không hỗ trợ giả lập trạng thái thanh toán. Đơn chỉ được chấp nhận sau xác nhận PayOS.' });
};
