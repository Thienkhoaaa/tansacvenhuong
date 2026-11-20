import { Request, Response } from 'express';
import { ProductModel } from '../models/Product.js';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const filter = typeof req.query.category === 'string' ? { category: req.query.category } : {};
    const products = await ProductModel.find(filter).sort({ id: 1 }).lean();
    return res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ success: false, message: 'Không thể tải danh sách sản phẩm' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await ProductModel.findOne({ id: req.params.id }).lean();
    if (!product) {
      return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
    }
    return res.json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).json({ success: false, message: 'Không thể tải sản phẩm' });
  }
};

