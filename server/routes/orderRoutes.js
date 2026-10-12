import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, default: 'guest_user' },
    items: [
      {
        name: { type: String, default: 'Custom Artisan Pizza' },
        base: String,
        sauce: String,
        cheese: String,
        veggies: [String],
        price: Number,
        quantity: { type: Number, default: 1 },
      },
    ],
    totalAmount: { type: Number, required: true },
    deliveryAddress: { type: String, required: true },
    phone: { type: String, required: true },
    status: {
      type: String,
      default: 'Order Received',
      enum: ['Order Received', 'In Kitchen', 'Sent to Delivery', 'Delivered'],
    },
    paymentMethod: { type: String, default: 'Online' },
    paymentStatus: { type: String, default: 'Completed' },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

// GET: सर्व ऑर्डर्स मिळवणे
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: नवीन ऑर्डर तयार करणे
router.post('/', async (req, res) => {
  try {
    const { items, totalAmount, deliveryAddress, phone, paymentMethod } = req.body;

    const newOrder = new Order({
      items,
      totalAmount,
      deliveryAddress,
      phone,
      paymentMethod: paymentMethod || 'Online (Test)',
      status: 'Order Received',
      paymentStatus: 'Completed',
    });

    const savedOrder = await newOrder.save();
    console.log('✅ New Order Created:', savedOrder._id);
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error('❌ Order Save Error:', err);
    res.status(500).json({ error: 'Failed to create order', details: err.message });
  }
});

// PATCH: ऑर्डर स्टेटस अपडेट करणे
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ES Module Default Export
export default router;