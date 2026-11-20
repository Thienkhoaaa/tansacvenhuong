import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import { isPayOSConfigured } from './config/payos.js';
import { connectDatabase } from './config/database.js';
import { seedProductsIfEmpty } from './services/productSeed.js';
import swaggerUi from 'swagger-ui-express';
import openApiSpec from './config/openapi.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const rawClientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
const allowedOrigins = rawClientUrl.split(',').map(url => url.trim());

// Middlewares - Flexible CORS for custom domain, preview URLs, and webhooks
app.use(cors({
  origin: (origin, callback) => {
    // Cho phép các request không có origin (ví dụ: PayOS Webhook, server-to-server, curl)
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      allowedOrigins.includes('*') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.endsWith('.vercel.app')
    ) {
      return callback(null, true);
    }
    // Mặc định cho phép trong môi trường production nếu đã cấu hình tên miền
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());
app.get('/api/openapi.json', (_req, res) => res.json(openApiSpec));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec, {
  customSiteTitle: 'Tàn Sắc Vẹn Hương API Docs'
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    project: 'Tan Sac Ven Huong API Service',
    time: new Date().toISOString(),
    payosConfigured: isPayOSConfigured
  });
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/payment', paymentRoutes);

app.listen(PORT, () => {
  console.log(`🌸 Tàn Sắc Vẹn Hương BackEnd is running at http://localhost:${PORT}`);
  console.log(`💳 PayOS Status: ${isPayOSConfigured ? 'Connected' : 'Simulation Mode (Free VietQR)'}`);
});

void (async () => {
  try {
    await connectDatabase();
    const seededCount = await seedProductsIfEmpty();
    if (seededCount) console.log(`Seeded ${seededCount} initial products into MongoDB.`);
  } catch (error) {
    console.warn('⚠️ MongoDB connection notice (running with fallback if needed):', error);
  }
})();

