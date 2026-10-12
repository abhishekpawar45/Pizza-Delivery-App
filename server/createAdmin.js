import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

// User मॉडेल इम्पोर्ट करा (पाथ तपासून घ्या)
import User from './models/User.js';

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    const email = process.env.ADMIN_EMAIL || 'abhisheknpawar7@gmail.com';
    const rawPassword = 'admin123'; // हा तुमचा ॲडमिन पासवर्ड असेल
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // युझर अस्तित्वात आहे का ते पाहणे
    let user = await User.findOne({ email });

    if (user) {
      user.password = hashedPassword;
      user.role = 'admin';
      user.isAdmin = true;
      await user.save();
      console.log(`\nExisting user updated to Admin successfully!`);
    } else {
      user = await User.create({
        name: 'Admin Abhishek',
        email,
        password: hashedPassword,
        role: 'admin',
        isAdmin: true
      });
      console.log(`\nNew Admin created successfully!`);
    }

    console.log(`-----------------------------------`);
    console.log(`Email    : ${email}`);
    console.log(`Password : ${rawPassword}`);
    console.log(`-----------------------------------\n`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

makeAdmin();