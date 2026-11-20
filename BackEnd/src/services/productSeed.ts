import { products } from '../data/products.js';
import { ProductModel } from '../models/Product.js';

export async function seedProducts(): Promise<number> {
  const operations = products.map(product => ({
    updateOne: {
      filter: { id: product.id },
      update: { $set: product },
      upsert: true
    }
  }));
  const result = await ProductModel.bulkWrite(operations);
  await ProductModel.deleteMany({ id: { $nin: products.map(product => product.id) } });
  return result.upsertedCount;
}

export async function seedProductsIfEmpty(): Promise<number> {
  if (await ProductModel.exists({})) return 0;
  return seedProducts();
}
