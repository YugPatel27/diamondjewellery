import mongoose from 'mongoose';
import Product from './models/Product.js';
import User from './models/User.js';
import connectDB from './config/database.js';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const JEWELRY_IMAGES = {
  solitaire1: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
  solitaire2: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
  halo1: 'https://images.unsplash.com/photo-1573408301185-9519f94816f6?w=800&q=80',
  halo2: 'https://images.unsplash.com/photo-1620656798579-1984d9e87df7?w=800&q=80',
  vintage1: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
  vintage2: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=800&q=80',
  band1: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
  band2: 'https://images.unsplash.com/photo-1586878341523-3ea14d4c13f7?w=800&q=80',
  trilogy1: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80',
  necklace1: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&q=80',
  necklace2: 'https://images.unsplash.com/photo-1635767798638-3665a0a107fc?w=800&q=80',
  necklace3: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&q=80',
  earring1: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&q=80',
  earring2: 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=800&q=80',
  earring3: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&q=80',
  ring1: 'https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?w=800&q=80',
  ring2: 'https://images.unsplash.com/photo-1605092676920-8f702a7a7e0a?w=800&q=80',
  ring3: 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800&q=80',
  ring4: 'https://images.unsplash.com/photo-1601121141418-7f1e2b19c58e?w=800&q=80',
  bracelet1: 'https://images.unsplash.com/photo-1576022162028-0f7e1e2abb0d?w=800&q=80',
  bracelet2: 'https://images.unsplash.com/photo-1508056338564-6c2e5a2e7d28?w=800&q=80',
  platinum1: 'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800&q=80',
  platinum2: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=800&q=80',
};

const products = [
  {
    id: 1, name: 'Delicacy Solitaire', style: 'Solitaire', metal: 'White Gold', shape: 'Round',
    category: 'Rings', price: 64100, originalPrice: 72800, rating: 5, isNew: false,
    cut: 'Excellent', clarity: 'VVS1', color: 'D', carat: 1.0, diamondType: 'lab',
    description: 'A timeless solitaire setting that lets the diamond take center stage.',
    image: JEWELRY_IMAGES.solitaire1,
    images: [JEWELRY_IMAGES.solitaire1, JEWELRY_IMAGES.ring1, JEWELRY_IMAGES.ring2],
  },
  {
    id: 2, name: 'Aria Band', style: 'Diamond Band', metal: 'White Gold', shape: 'Round',
    category: 'Rings', price: 85450, originalPrice: 94940, rating: 5, isNew: true,
    cut: 'Excellent', clarity: 'VS1', color: 'E', carat: 1.2, diamondType: 'lab',
    description: 'The Aria Diamond Band features a stunning center stone.',
    image: JEWELRY_IMAGES.band1,
    images: [JEWELRY_IMAGES.band1, JEWELRY_IMAGES.band2, JEWELRY_IMAGES.solitaire2],
  },
  {
    id: 3, name: 'Vintage Grace', style: 'Vintage', metal: 'Yellow Gold', shape: 'Cushion',
    category: 'Rings', price: 125000, originalPrice: 145000, rating: 5, isNew: false,
    cut: 'Very Good', clarity: 'VS2', color: 'F', carat: 1.5, diamondType: 'natural',
    description: 'An intricate vintage-style ring with cushion cut diamond and filigree detailing.',
    image: JEWELRY_IMAGES.vintage1,
    images: [JEWELRY_IMAGES.vintage1, JEWELRY_IMAGES.ring3, JEWELRY_IMAGES.ring4],
  },
  {
    id: 4, name: 'Royal Halo', style: 'Halo', metal: 'Rose Gold', shape: 'Princess',
    category: 'Rings', price: 98000, originalPrice: 110000, rating: 5, isNew: true,
    cut: 'Excellent', clarity: 'VVS2', color: 'G', carat: 1.1, diamondType: 'natural',
    description: 'A brilliant princess cut diamond surrounded by a sparkling halo of diamonds.',
    image: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=800&q=80', JEWELRY_IMAGES.halo2, JEWELRY_IMAGES.ring1],
  },
  {
    id: 5, name: 'Eternity Platinum', style: 'Eternity', metal: 'Platinum', shape: 'Emerald',
    category: 'Rings', price: 155000, originalPrice: 180000, rating: 5, isNew: false,
    cut: 'Excellent', clarity: 'VVS1', color: 'H', carat: 2.0, diamondType: 'lab',
    description: 'A full eternity band set with sophisticated emerald cut diamonds in platinum.',
    image: JEWELRY_IMAGES.platinum1,
    images: [JEWELRY_IMAGES.platinum1, JEWELRY_IMAGES.platinum2, JEWELRY_IMAGES.ring2],
  },
  {
    id: 6, name: 'Trilogy Love', style: 'Trilogy', metal: 'White Gold', shape: 'Pear',
    category: 'Rings', price: 112000, originalPrice: 130000, rating: 5, isNew: false,
    cut: 'Excellent', clarity: 'VS1', color: 'I', carat: 1.3, diamondType: 'natural',
    description: 'Representing your past, present, and future with three exquisite pear-shaped diamonds.',
    image: JEWELRY_IMAGES.trilogy1,
    images: [JEWELRY_IMAGES.trilogy1, JEWELRY_IMAGES.ring3, JEWELRY_IMAGES.ring4],
  },
  {
    id: 7, name: 'Radiant Solitaire Necklace', style: 'Solitaire', metal: 'White Gold', shape: 'Round',
    category: 'Necklaces', price: 45000, originalPrice: 52000, rating: 5, isNew: true,
    cut: 'Excellent', clarity: 'VVS1', color: 'D', carat: 0.5, diamondType: 'lab',
    description: 'A classic solitaire pendant that adds a touch of elegance to any look.',
    image: JEWELRY_IMAGES.necklace1,
    images: [JEWELRY_IMAGES.necklace1, JEWELRY_IMAGES.necklace2, JEWELRY_IMAGES.necklace3],
  },
  {
    id: 8, name: 'Vintage Oval Pendant', style: 'Vintage', metal: 'Yellow Gold', shape: 'Oval',
    category: 'Necklaces', price: 62000, originalPrice: 75000, rating: 5, isNew: false,
    cut: 'Very Good', clarity: 'VS2', color: 'E', carat: 0.7, diamondType: 'natural',
    description: 'A beautiful oval pendant with vintage decorative elements in 18k yellow gold.',
    image: 'https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?w=800&q=80', JEWELRY_IMAGES.necklace1, JEWELRY_IMAGES.necklace3],
  },
  {
    id: 9, name: 'Classic Platinum Studs', style: 'Solitaire', metal: 'Platinum', shape: 'Round',
    category: 'Earrings', price: 55000, originalPrice: 65000, rating: 5, isNew: false,
    cut: 'Excellent', clarity: 'VVS2', color: 'F', carat: 0.8, diamondType: 'lab',
    description: 'Timeless platinum studs featuring brilliant round cut diamonds.',
    image: JEWELRY_IMAGES.earring1,
    images: [JEWELRY_IMAGES.earring1, JEWELRY_IMAGES.earring2, JEWELRY_IMAGES.earring3],
  },
  {
    id: 10, name: 'Halo Rose Hoops', style: 'Halo', metal: 'Rose Gold', shape: 'Round',
    category: 'Earrings', price: 72000, originalPrice: 85000, rating: 5, isNew: true,
    cut: 'Excellent', clarity: 'VS1', color: 'G', carat: 1.0, diamondType: 'natural',
    description: 'Elegant rose gold hoop earrings with halo-set diamonds for extra sparkle.',
    image: JEWELRY_IMAGES.earring2,
    images: [JEWELRY_IMAGES.earring2, JEWELRY_IMAGES.earring1, JEWELRY_IMAGES.earring3],
  },
  {
    id: 11, name: 'Tennis Eternity Bracelet', style: 'Eternity', metal: 'White Gold', shape: 'Round',
    category: 'Bracelets', price: 185000, originalPrice: 210000, rating: 5, isNew: false,
    cut: 'Excellent', clarity: 'VVS1', color: 'H', carat: 3.0, diamondType: 'lab',
    description: 'A stunning white gold tennis bracelet with a continuous line of diamonds.',
    image: JEWELRY_IMAGES.bracelet1,
    images: [JEWELRY_IMAGES.bracelet1, JEWELRY_IMAGES.bracelet2],
  },
  {
    id: 12, name: 'Vintage Bangle', style: 'Vintage', metal: 'Yellow Gold', shape: 'Oval',
    category: 'Bracelets', price: 95000, originalPrice: 115000, rating: 5, isNew: false,
    cut: 'Very Good', clarity: 'VS2', color: 'I', carat: 1.5, diamondType: 'natural',
    description: 'A handcrafted yellow gold bangle with vintage engravings and oval diamond accents.',
    image: JEWELRY_IMAGES.bracelet2,
    images: [JEWELRY_IMAGES.bracelet2, JEWELRY_IMAGES.bracelet1],
  },
  {
    id: 13, name: 'Princess Solitaire Platinum', style: 'Solitaire', metal: 'Platinum', shape: 'Princess',
    category: 'Rings', price: 142000, originalPrice: 165000, rating: 5, isNew: true,
    cut: 'Excellent', clarity: 'VVS1', color: 'D', carat: 1.8, diamondType: 'natural',
    description: 'A striking princess cut solitaire diamond set in a minimalist platinum band.',
    image: JEWELRY_IMAGES.ring1,
    images: [JEWELRY_IMAGES.ring1, JEWELRY_IMAGES.ring2, JEWELRY_IMAGES.ring3],
  },
  {
    id: 14, name: 'Emerald Halo Gold', style: 'Halo', metal: 'Yellow Gold', shape: 'Emerald',
    category: 'Rings', price: 108000, originalPrice: 125000, rating: 5, isNew: false,
    cut: 'Excellent', clarity: 'VS1', color: 'E', carat: 1.4, diamondType: 'lab',
    description: 'A royal emerald cut diamond surrounded by a brilliant halo of smaller stones.',
    image: JEWELRY_IMAGES.ring2,
    images: [JEWELRY_IMAGES.ring2, JEWELRY_IMAGES.ring1, JEWELRY_IMAGES.ring4],
  },
  {
    id: 15, name: 'Pear Drop Vintage', style: 'Vintage', metal: 'Platinum', shape: 'Pear',
    category: 'Earrings', price: 88000, originalPrice: 105000, rating: 5, isNew: false,
    cut: 'Excellent', clarity: 'VVS2', color: 'F', carat: 1.2, diamondType: 'natural',
    description: 'Exquisite pear-shaped drop earrings with vintage-inspired platinum settings.',
    image: JEWELRY_IMAGES.earring3,
    images: [JEWELRY_IMAGES.earring3, JEWELRY_IMAGES.earring1, JEWELRY_IMAGES.earring2],
  },
];

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing products and reseed
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log(`✅ ${products.length} Products Seeded`);

    // Create default admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@jewellery.com';
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(process.env.ADMIN_PASSWORD || 'admin123456', salt);
      const admin = new User({
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        phone: '9999999999',
        isAdmin: true,
      });
      await admin.save();
      console.log('✅ Admin User Created');
    }

    // Create test user (haha16@gmail.com)
    const testEmail = 'haha16@gmail.com';
    const testExists = await User.findOne({ email: testEmail });
    if (!testExists) {
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash('123456', salt);
      const testUser = new User({
        name: 'Test User',
        email: testEmail,
        password: hashedPassword,
        phone: '1234567890',
        isAdmin: false,
      });
      await testUser.save();
      console.log('✅ Test User Created (haha16@gmail.com / 123456)');
    }

    console.log('🏁 Seeding Complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();
