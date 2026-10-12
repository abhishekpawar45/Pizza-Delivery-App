import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Inventory from './models/Inventory.js';

dotenv.config();

const initialItems = [
  // 5 Bases
  { category: 'base', name: 'Thin Crust', stock: 50, price: 120 },
  { category: 'base', name: 'Cheese Burst', stock: 50, price: 180 },
  { category: 'base', name: 'Pan Pizza', stock: 50, price: 140 },
  { category: 'base', name: 'Whole Wheat', stock: 50, price: 150 },
  { category: 'base', name: 'Gluten Free', stock: 50, price: 160 },

  // 5 Sauces
  { category: 'sauce', name: 'Classic Marinara', stock: 50, price: 30 },
  { category: 'sauce', name: 'Spicy Peri-Peri', stock: 50, price: 40 },
  { category: 'sauce', name: 'Creamy Garlic Alfredo', stock: 50, price: 45 },
  { category: 'sauce', name: 'Barbecue (BBQ)', stock: 50, price: 40 },
  { category: 'sauce', name: 'Pesto Herb', stock: 50, price: 50 },

  // Cheeses
  { category: 'cheese', name: 'Mozzarella', stock: 50, price: 60 },
  { category: 'cheese', name: 'Cheddar', stock: 50, price: 70 },
  { category: 'cheese', name: 'Gouda', stock: 50, price: 80 },

  // Veggies
  { category: 'veggie', name: 'Black Olives', stock: 50, price: 25 },
  { category: 'veggie', name: 'Jalapenos', stock: 50, price: 25 },
  { category: 'veggie', name: 'Crisp Capsicum', stock: 50, price: 20 },
  { category: 'veggie', name: 'Red Paprika', stock: 50, price: 25 },
  { category: 'veggie', name: 'Fresh Mushrooms', stock: 50, price: 30 },
  { category: 'veggie', name: 'Golden Corn', stock: 50, price: 20 }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Inventory.deleteMany();
    await Inventory.insertMany(initialItems);
    console.log('Inventory successfully seeded!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();