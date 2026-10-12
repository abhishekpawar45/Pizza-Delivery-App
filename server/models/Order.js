import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    items: {
      base: { type: String, required: true },
      sauce: { type: String, required: true },
      cheese: { type: String, required: true },
      veggies: [{ type: String }]
    },
    totalAmount: {
      type: Number,
      required: true
    },
    paymentStatus: {
      type: String,
      // कॅपिटल आणि स्मॉल दोन्ही व्हॅल्यूज ग्राह्य धरल्या आहेत
      enum: ['Pending', 'pending', 'Paid', 'paid', 'Failed', 'failed', 'Completed', 'completed'],
      default: 'Pending'
    },
    paymentDetails: {
      orderId: { type: String },
      paymentId: { type: String }
    },
    orderStatus: {
      type: String,
      enum: ['Order Received', 'In Kitchen', 'Sent to Delivery', 'Delivered'],
      default: 'Order Received'
    }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;