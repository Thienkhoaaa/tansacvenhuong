import { Router } from 'express';
import {
  createOrder,
  getOrderStatus,
  handleWebhook,
  simulatePaymentSuccess
} from '../controllers/paymentController.js';

const router = Router();

router.post('/create-order', createOrder);
router.get('/order-status/:orderCode', getOrderStatus);
router.post('/webhook', handleWebhook);
router.post('/simulate-success/:orderCode', simulatePaymentSuccess);

export default router;

