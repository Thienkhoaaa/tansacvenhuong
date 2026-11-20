import mongoose, { Schema } from 'mongoose';
import type { Product } from '../types/index.js';

const productSchema = new Schema<Product>({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, trim: true },
  subtitle: { type: String, required: true },
  category: { type: String, enum: ['nuoc-hoa', 'tram-huong', 'tinh-dau', 'nen-thom', 'dac-san'], required: true, index: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, min: 0 },
  volume: { type: String, required: true },
  description: { type: String, required: true },
  story: { type: String, required: true },
  notes: {
    top: { type: [String], default: [] },
    middle: { type: [String], default: [] },
    base: { type: [String], default: [] }
  },
  image: { type: String, required: true },
  badge: String,
  inStock: { type: Boolean, default: true },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  reviewsCount: { type: Number, min: 0, default: 0 }
}, { timestamps: true, versionKey: false });

export const ProductModel = mongoose.model<Product>('Product', productSchema);
