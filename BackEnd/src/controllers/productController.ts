import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ProductModel } from '../models/Product.js';
import { products as fallbackProducts } from '../data/products.js';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;

    if (mongoose.connection.readyState === 1) {
      try {
        const filter = category ? { category } : {};
        const dbProducts = await ProductModel.find(filter).sort({ id: 1 }).lean();
        if (dbProducts && dbProducts.length > 0) {
          return res.json({ success: true, count: dbProducts.length, data: dbProducts });
        }
      } catch (dbError) {
        console.warn('MongoDB query warning, using fallback products:', dbError);
      }
    }

    const filtered = category
      ? fallbackProducts.filter(p => p.category === category)
      : fallbackProducts;

    return res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.json({ success: true, count: fallbackProducts.length, data: fallbackProducts });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      try {
        const dbProduct = await ProductModel.findOne({ id }).lean();
        if (dbProduct) {
          return res.json({ success: true, data: dbProduct });
        }
      } catch (dbError) {
        console.warn('MongoDB query warning, using fallback product:', dbError);
      }
    }

    const product = fallbackProducts.find(p => p.id === id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
    }
    return res.json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    const product = fallbackProducts.find(p => p.id === req.params.id);
    if (product) return res.json({ success: true, data: product });
    return res.status(500).json({ success: false, message: 'Không thể tải sản phẩm' });
  }
};
