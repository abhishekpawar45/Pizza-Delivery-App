import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Order Schema (Enum flexible ठेवला आहे जेणेकरून कोणताही स्टेटस व्हॅलिड राहील)
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

// Status Update Handler (PATCH + PUT दोन्हींसाठी)
const updateStatusHandler = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const updated = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Order not found' });
    }

    console.log(`✅ Order ${id} status updated to: ${status}`);
    res.json(updated);
  } catch (err) {
    console.error('❌ Status update failed:', err);
    res.status(500).json({ error: 'Failed to update status', details: err.message });
  }
};

// सर्व शक्य राऊट्स सपोर्ट केले आहेत
router.patch('/:id/status', updateStatusHandler);
router.put('/:id/status', updateStatusHandler);
router.patch('/:id', updateStatusHandler);
router.put('/:id', updateStatusHandler);

export default router;
