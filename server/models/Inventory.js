import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  category: { 
    type: String, 
    enum: ['base', 'sauce', 'cheese', 'veggie'], 
    required: true 
  },
  name: { type: String, required: true, unique: true },
  stock: { type: Number, required: true, default: 50 },
  threshold: { type: Number, default: 20 },
  price: { type: Number, required: true, default: 0 }
}, { timestamps: true });

export default mongoose.model('Inventory', inventorySchema);