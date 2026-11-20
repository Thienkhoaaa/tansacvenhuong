import mongoose, { Schema } from 'mongoose';
import type { OrderRecord } from '../types/index.js';

const orderSchema = new Schema<OrderRecord>({
  orderCode: { type: Number, required: true, unique: true, index: true },
  customer: {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, index: true },
    address: { type: String, required: true, trim: true },
    notes: { type: String, trim: true }
  },
  items: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, required: true }
  }],
  totalAmount: { type: Number, required: true, min: 1 },
  paymentMethod: { type: String, enum: ['vietqr', 'cod'], required: true },
  status: { type: String, enum: ['PENDING', 'PAID', 'CANCELLED'], default: 'PENDING', index: true },
  paidAt: Date,
  payosPaymentLinkId: String,
  checkoutUrl: String,
  qrCodeUrl: String,
  isTestMode: { type: Boolean, default: false }
}, { timestamps: { createdAt: true, updatedAt: false }, versionKey: false });

export const OrderModel = mongoose.model<OrderRecord>('Order', orderSchema);
