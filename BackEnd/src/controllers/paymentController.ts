import { Request, Response } from 'express';
import { payOSClient, isPayOSConfigured } from '../config/payos.js';
import { CreateOrderPayload, OrderRecord } from '../types/index.js';

// In-memory order storage (In production, replace with PostgreSQL/Supabase Prisma)
const orders: Map<number, OrderRecord> = new Map();

export const createOrder = async (req: Request, res: Response) => {
  try {
    const payload: CreateOrderPayload = req.body;
    const { customer, items, totalAmount, paymentMethod } = payload;

    if (!items || items.length === 0 || !totalAmount) {
      return res.status(400).json({ success: false, message: 'Thông tin đơn hàng không hợp lệ' });
    }

    // PayOS requires orderCode as unique integer (max 9007199254740991)
    const orderCode = Number(String(Date.now()).slice(-8)) + Math.floor(Math.random() * 100);
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

    const orderRecord: OrderRecord = {
      orderCode,
      customer,
      items,
      totalAmount,
      paymentMethod,
      status: paymentMethod === 'cod' ? 'PENDING' : 'PENDING',
      createdAt: new Date().toISOString()
    };

    // If COD, return directly
    if (paymentMethod === 'cod') {
      orders.set(orderCode, orderRecord);
      return res.status(201).json({
        success: true,
        order: orderRecord,
        message: 'Đặt hàng thành công với hình thức COD (Thanh toán khi nhận hàng).'
      });
    }

    // If VietQR / PayOS
    if (isPayOSConfigured && payOSClient) {
      try {
        const paymentData = {
          orderCode,
          amount: totalAmount,
          description: `TSVH ${orderCode}`.slice(0, 25),
          items: items.map(item => ({
            name: item.name.slice(0, 50),
            quantity: item.quantity,
            price: item.price
          })),
          cancelUrl: `${clientUrl}/checkout?status=cancel&orderCode=${orderCode}`,
          returnUrl: `${clientUrl}/checkout/success?orderCode=${orderCode}`
        };

        const paymentLinkResponse = await payOSClient.createPaymentLink(paymentData);

        orderRecord.payosPaymentLinkId = paymentLinkResponse.paymentLinkId;
        orderRecord.checkoutUrl = paymentLinkResponse.checkoutUrl;
        orderRecord.qrCodeUrl = paymentLinkResponse.qrCode;

        orders.set(orderCode, orderRecord);

        return res.status(201).json({
          success: true,
          order: orderRecord,
          payment: {
            checkoutUrl: paymentLinkResponse.checkoutUrl,
            qrCode: paymentLinkResponse.qrCode,
            orderCode
          }
        });
      } catch (payosError: any) {
        console.error('PayOS createPaymentLink error:', payosError);
        // Fallback to VietQR open image simulation if PayOS API returns error
      }
    }

    // Fallback mode: Dynamic VietQR format for testing
    // Using VietQR standard format (MBBank / Vietcombank simulation)
    const vietQrUrl = `https://img.vietqr.io/image/970422-0987654321-compact2.png?amount=${totalAmount}&addInfo=TSVH%20${orderCode}&accountName=TAN%20SAC%20VEN%20HUONG`;
    
    orderRecord.qrCodeUrl = vietQrUrl;
    orders.set(orderCode, orderRecord);

    return res.status(201).json({
      success: true,
      order: orderRecord,
      payment: {
        checkoutUrl: null,
        qrCode: vietQrUrl,
        orderCode,
        isSimulated: !isPayOSConfigured
      }
    });
  } catch (error: any) {
    console.error('Error in createOrder:', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ khi tạo đơn hàng' });
  }
};

export const getOrderStatus = (req: Request, res: Response) => {
  const { orderCode } = req.params;
  const order = orders.get(Number(orderCode));
  if (!order) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
  }
  return res.json({ success: true, order });
};

// Webhook handler for PayOS notification
export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const webhookData = req.body;
    console.log('🔔 Received PayOS Webhook:', webhookData);

    if (isPayOSConfigured && payOSClient) {
      try {
        const verifiedData = payOSClient.verifyPaymentWebhookData(webhookData);
        const order = orders.get(verifiedData.orderCode);
        if (order) {
          order.status = 'PAID';
          order.paidAt = new Date().toISOString();
          orders.set(verifiedData.orderCode, order);
          console.log(`✅ Order ${verifiedData.orderCode} verified and marked as PAID.`);
        }
      } catch (verifyError) {
        console.error('❌ PayOS Webhook signature verification failed:', verifyError);
        return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
      }
    } else {
      // In simulation mode: Allow manual confirm or test trigger
      if (webhookData.orderCode) {
        const order = orders.get(Number(webhookData.orderCode));
        if (order) {
          order.status = 'PAID';
          order.paidAt = new Date().toISOString();
          orders.set(Number(webhookData.orderCode), order);
          console.log(`✅ Simulated Order ${webhookData.orderCode} marked as PAID.`);
        }
      }
    }

    return res.json({ success: true, message: 'Webhook processed' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ success: false, message: 'Webhook processing error' });
  }
};

// Simulated pay trigger (for quick testing in UI without real money)
export const simulatePaymentSuccess = (req: Request, res: Response) => {
  const { orderCode } = req.params;
  const order = orders.get(Number(orderCode));
  if (!order) {
    return res.status(404).json({ success: false, message: 'Đơn hàng không tồn tại' });
  }

  order.status = 'PAID';
  order.paidAt = new Date().toISOString();
  orders.set(Number(orderCode), order);

  return res.json({
    success: true,
    message: `Đơn hàng ${orderCode} đã được mô phỏng thanh toán thành công!`,
    order
  });
};
