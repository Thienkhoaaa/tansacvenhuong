import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import { isPayOSConfigured } from './config/payos.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Middlewares
app.use(cors({
  origin: [CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

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

