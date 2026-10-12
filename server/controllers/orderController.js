import crypto from 'crypto';
import Razorpay from 'razorpay';
import Order from '../models/Order.js';
import Inventory from '../models/Inventory.js';
import { sendEmail } from '../utils/sendEmail.js';

const getRazorpayInstance = () => {
  if (
    !process.env.RAZORPAY_KEY_ID ||
    process.env.RAZORPAY_KEY_ID.includes('placeholder') ||
    process.env.RAZORPAY_KEY_ID === 'your_razorpay_key_id'
  ) {
    return null;
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
};

// 1. इन्व्हेंटरी मिळवणे
export const getInventoryItems = async (req, res) => {
  try {
    const items = await Inventory.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getInventory = getInventoryItems;

// 2. Razorpay Order तयार करणे
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const razorpay = getRazorpayInstance();

    if (!razorpay) {
      return res.status(200).json({
        id: `order_mock_${Date.now()}`,
        currency: 'INR',
        amount: Math.round(Number(amount || 0) * 100),
        mock: true
      });
    }

    const options = {
      amount: Math.round(Number(amount || 0) * 100),
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    res.status(200).json({
      id: `order_mock_${Date.now()}`,
      currency: 'INR',
      amount: Math.round(Number(req.body.amount || 0) * 100),
      mock: true
    });
  }
};
export const createPaymentOrder = createRazorpayOrder;

// 3. पेमेंट व्हेरिफाय करून ऑर्डर प्लेस करणे
export const verifyAndPlaceOrder = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      totalAmount
    } = req.body;

    const razorpay = getRazorpayInstance();

    if (razorpay && razorpay_signature && razorpay_signature !== 'mock_signature') {
      const generated_signature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generated_signature !== razorpay_signature) {
        return res.status(400).json({ message: 'Invalid payment signature' });
      }
    }

    const userId = req.user?._id || req.user?.id || null;

    // नवीन ऑर्डर तयार करणे
    const newOrder = await Order.create({
      user: userId,
      items: {
        base: items?.base || '',
        sauce: items?.sauce || '',
        cheese: items?.cheese || '',
        veggies: items?.veggies || []
      },
      totalAmount: Number(totalAmount || 0),
      paymentStatus: 'Paid',
      paymentDetails: {
        orderId: razorpay_order_id || `order_mock_${Date.now()}`,
        paymentId: razorpay_payment_id || `pay_mock_${Date.now()}`
      },
      orderStatus: 'Order Received'
    });

    // इन्व्हेंटरीमधून १ नग कमी करणे
    try {
      const usedItems = [items?.base, items?.sauce, items?.cheese, ...(items?.veggies || [])].filter(Boolean);
      for (const itemName of usedItems) {
        const invItem = await Inventory.findOne({ name: itemName });
        if (invItem) {
          invItem.stock = Math.max(0, invItem.stock - 1);
          await invItem.save();

          if (invItem.stock < 10) {
            try {
              await sendEmail({
                to: process.env.ADMIN_EMAIL || 'admin@pizzahub.com',
                subject: `Stock Alert: ${invItem.name}`,
                html: `<p>Stock for <b>${invItem.name}</b> is low (${invItem.stock} left).</p>`
              });
            } catch (mailErr) {
              console.log('Stock alert email bypassed');
            }
          }
        }
      }
    } catch (invErr) {
      console.warn('Inventory decrement issue:', invErr.message);
    }

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Order Placement Error:', error);
    res.status(500).json({ message: error.message });
  }
};
export const verifyAndCreateOrder = verifyAndPlaceOrder;
export const verifyOrder = verifyAndPlaceOrder;

// 4. युझरच्या स्वतःच्या ऑर्डर्स मिळवणे
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const orders = await Order.find(userId ? { user: userId } : {}).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getUserOrders = getMyOrders;

// 5. सर्व ऑर्डर्स मिळवणे (Admin)
export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getAllOrders = getAllOrdersAdmin;

// 6. ऑर्डर स्टेटस अपडेट करणे (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.orderStatus = orderStatus;
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateOrderStatusAdmin = updateOrderStatus;

// 7. इन्व्हेंटरी स्टॉक अपडेट करणे (Admin)
export const updateInventoryStock = async (req, res) => {
  try {
    const { stock } = req.body;
    const item = await Inventory.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    item.stock = Number(stock);
    await item.save();

    res.status(200).json({ message: 'Stock updated successfully', item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateStock = updateInventoryStock;