import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import {
  getInventoryItems,
  createRazorpayOrder,
  verifyAndPlaceOrder,
  getMyOrders,
  getAllOrdersAdmin,
  updateOrderStatus,
  updateInventoryStock
} from '../controllers/orderController.js';

const router = express.Router();

// इन्व्हेंटरी
router.get('/inventory', protect, getInventoryItems);

// पेमेंट आणि ऑर्डर प्लेस (दोन्ही पाथ्सना सपोर्ट द्या जेणेकरून 404 येणार नाही)
router.post('/create-order', protect, createRazorpayOrder);
router.post('/create-payment-order', protect, createRazorpayOrder);

router.post('/verify-order', protect, verifyAndPlaceOrder);

// युझर ऑर्डर्स
router.get('/my-orders', protect, getMyOrders);

// ॲडमिन राऊट्स
router.get('/admin/orders', protect, adminOnly, getAllOrdersAdmin);
router.put('/admin/orders/:id/status', protect, adminOnly, updateOrderStatus);
router.put('/admin/inventory/:id', protect, adminOnly, updateInventoryStock);

export default router;