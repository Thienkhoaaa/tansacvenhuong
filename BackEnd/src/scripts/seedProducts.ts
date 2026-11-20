import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/database.js';
import { seedProducts } from '../services/productSeed.js';

async function main() {
  try {
    await connectDatabase();
    const inserted = await seedProducts();
    console.log(`Product catalog sync complete. ${inserted} new catalog product(s) inserted; obsolete seed products were removed.`);
  } catch (error) {
    console.error('Product seed failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

void main();
