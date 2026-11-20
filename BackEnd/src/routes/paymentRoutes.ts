import { Router } from 'express';
import {
  createOrder,
  createPaymentLink,
  getPaymentOrder,
  getOrderStatus,
  lookupOrdersByPhone,
  handleWebhook,
  simulatePaymentSuccess
} from '../controllers/paymentController.js';

const router = Router();

router.post('/create-order', createOrder);
router.post('/create-payment-link', createPaymentLink);
router.get('/lookup-orders', lookupOrdersByPhone);
router.get('/order-status/:orderCode', getOrderStatus);
router.get('/order/:orderCode', getPaymentOrder);
router.post('/webhook', handleWebhook);
router.post('/simulate-success/:orderCode', simulatePaymentSuccess);

export default router;

