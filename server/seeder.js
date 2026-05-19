const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();

    // Create Admin User
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@nexonmart.com',
      password: 'password123',
      isAdmin: true,
    });

    // Create standard Customer User
    await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      isAdmin: false,
    });

    const adminId = adminUser._id;

    // Sample Products
    const products = [
      {
        user: adminId,
        name: 'Wireless Noise-Canceling Headphones',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop',
        brand: 'AudioQuest',
        category: 'Electronics',
        description: 'High-fidelity audio with active noise cancellation, built-in microphone, and 30-hour battery life.',
        price: 199.99,
        countInStock: 15,
        rating: 4.5,
        numReviews: 4,
      },
      {
        user: adminId,
        name: 'Mechanical Gaming Keyboard',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop',
        brand: 'KeyTech',
        category: 'Accessories',
        description: 'Tactile mechanical switches with customizable per-key RGB backlighting and aluminum frame.',
        price: 89.99,
        countInStock: 25,
        rating: 4.8,
        numReviews: 12,
      },
      {
        user: adminId,
        name: 'Smart Fitness Watch',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop',
        brand: 'FitTrack',
        category: 'Wearables',
        description: 'Real-time heart rate tracking, sleep analysis, built-in GPS mapping, and water resistance up to 50m.',
        price: 129.99,
        countInStock: 10,
        rating: 4.2,
        numReviews: 8,
      },
      {
        user: adminId,
        name: 'Portable Bluetooth Speaker',
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop',
        brand: 'SoundWave',
        category: 'Electronics',
        description: 'Waterproof outdoor speaker with rich bass, dual drivers, and up to 12 hours of continuous playtime.',
        price: 59.99,
        countInStock: 30,
        rating: 4.6,
        numReviews: 15,
      },
      {
        user: adminId,
        name: 'Ultra-Wide Curved Monitor',
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop',
        brand: 'ViewSonic',
        category: 'Electronics',
        description: '34-inch curved gaming and productivity monitor with 144Hz refresh rate, 1ms response time, and HDR10 support.',
        price: 349.99,
        countInStock: 8,
        rating: 4.7,
        numReviews: 6,
      },
      {
        user: adminId,
        name: 'Ergonomic Office Chair',
        image: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=600&auto=format&fit=crop',
        brand: 'ComfortPlus',
        category: 'Furniture',
        description: 'High-back ergonomic mesh chair with adjustable lumbar support, 3D armrests, and dynamic recline.',
        price: 249.99,
        countInStock: 5,
        rating: 4.4,
        numReviews: 10,
      },
    ];

    await Product.insertMany(products);

    console.log('Data Imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error during data import: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error during data destruction: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
