import { Request, Response } from 'express';
import { products } from '../data/products.js';

export const getProducts = (req: Request, res: Response) => {
  const { category } = req.query;
  if (category && typeof category === 'string') {
    const filtered = products.filter(p => p.category === category);
    return res.json({ success: true, count: filtered.length, data: filtered });
  }
  return res.json({ success: true, count: products.length, data: products });
};

export const getProductById = (req: Request, res: Response) => {
  const { id } = req.params;
  const product = products.find(p => p.id === id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
  }
  return res.json({ success: true, data: product });
};
