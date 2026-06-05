import mongoose from 'mongoose';
import Product from './models/Product.js';
import User from './models/User.js';
import connectDB from './config/database.js';
import bcryptjs from 'bcryptjs';

const JEWELRY_IMAGES = {
  solitaire1: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
  solitaire2: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
  halo1: 'https://images.unsplash.com/photo-1573408301185-9519f94816f6?w=800&q=80',
  halo2: 'https://images.unsplash.com/photo-1620656798579-1984d9e87df7?w=800&q=80',
  vintage1: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
  band1: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
  band2: 'https://images.unsplash.com/photo-1586878341523-3ea14d4c13f7?w=800&q=80',
  trilogy1: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80',
  necklace1: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&q=80',
  necklace2: 'https://images.unsplash.com/photo-1635767798638-3665a0a107fc?w=800&q=80',
  earring1: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&q=80',
  earring2: 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=800&q=80',
  ring1: 'https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?w=800&q=80',
  platinum1: 'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800&q=80',
  platinum2: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=800&q=80',
};

const products = [
  { id: 1, name: 'Delicacy', style: 'Solitaire', metal: 'White Gold', shape: 'Round', category: 'Rings', price: 64100, originalPrice: 72800, cut: 'Excellent', clarity: 'VVS1', color: 'D', carat: 1.0, diamondType: 'lab', description: 'A timeless solitaire setting.', image: JEWELRY_IMAGES.solitaire1, images: [JEWELRY_IMAGES.solitaire1, JEWELRY_IMAGES.ring1], rating: 5 },
  { id: 2, name: 'Aria', style: 'Diamond Band', metal: 'White Gold', shape: 'Round', category: 'Rings', price: 85450, originalPrice: 94940, cut: 'Excellent', clarity: 'VS1', color: 'E', carat: 1.2, diamondType: 'lab', description: 'Diamond Band with brilliant setting.', image: JEWELRY_IMAGES.band1, images: [JEWELRY_IMAGES.band1, JEWELRY_IMAGES.band2], rating: 5, isNew: true },
  { id: 3, name: 'Starlight', style: 'Vintage', metal: 'White Gold', shape: 'Round', category: 'Rings', price: 60410, originalPrice: 68660, cut: 'Very Good', clarity: 'VVS2', color: 'F', carat: 0.8, diamondType: 'natural', description: 'Art Deco inspired vintage design.', image: JEWELRY_IMAGES.vintage1, images: [JEWELRY_IMAGES.vintage1], rating: 5, isNew: true },
  { id: 4, name: 'Aphrodite', style: 'Halo', metal: 'White Gold', shape: 'Round', category: 'Rings', price: 112960, originalPrice: 125510, cut: 'Excellent', clarity: 'IF', color: 'D', carat: 1.5, diamondType: 'natural', description: 'Halo surrounded by brilliant diamonds.', image: JEWELRY_IMAGES.halo1, images: [JEWELRY_IMAGES.halo1, JEWELRY_IMAGES.halo2], rating: 5 },
  { id: 5, name: 'Valencia', style: 'Trilogy', metal: 'White Gold', shape: 'Round', category: 'Rings', price: 85820, originalPrice: 95360, cut: 'Very Good', clarity: 'VS2', color: 'G', carat: 1.8, diamondType: 'lab', description: 'Three stones trilogy design.', image: JEWELRY_IMAGES.trilogy1, images: [JEWELRY_IMAGES.trilogy1], rating: 5 },
  { id: 6, name: 'Hope', style: 'Solitaire', metal: 'Yellow Gold', shape: 'Oval', category: 'Rings', price: 58380, originalPrice: 66340, cut: 'Good', clarity: 'SI1', color: 'H', carat: 0.7, diamondType: 'natural', description: 'Delicate oval solitaire.', image: JEWELRY_IMAGES.solitaire2, images: [JEWELRY_IMAGES.solitaire2], rating: 5 },
  { id: 7, name: 'Kindrea', style: 'Diamond Band', metal: 'Rose Gold', shape: 'Cushion', category: 'Rings', price: 82560, originalPrice: 91730, cut: 'Excellent', clarity: 'VVS1', color: 'E', carat: 2.0, diamondType: 'lab', description: 'Cushion cut diamond band.', image: JEWELRY_IMAGES.band2, images: [JEWELRY_IMAGES.band2], rating: 5, isNew: true },
  { id: 8, name: 'Contour', style: 'Solitaire', metal: 'Platinum', shape: 'Princess', category: 'Rings', price: 53410, originalPrice: 60700, cut: 'Very Good', clarity: 'VS1', color: 'F', carat: 0.9, diamondType: 'natural', description: 'Modern princess cut platinum.', image: JEWELRY_IMAGES.platinum1, images: [JEWELRY_IMAGES.platinum1], rating: 5, isNew: true },
  { id: 9, name: 'Luminance', style: 'Solitaire', metal: 'White Gold', shape: 'Pear', category: 'Necklaces', price: 133750, originalPrice: 155150, cut: 'Excellent', clarity: 'FL', color: 'D', carat: 2.5, diamondType: 'lab', description: 'Pear pendant on gold chain.', image: JEWELRY_IMAGES.necklace1, images: [JEWELRY_IMAGES.necklace1], rating: 5 },
  { id: 10, name: 'Celeste', style: 'Halo', metal: 'Yellow Gold', shape: 'Round', category: 'Earrings', price: 98440, originalPrice: 117700, cut: 'Excellent', clarity: 'VVS2', color: 'E', carat: 1.0, diamondType: 'natural', description: 'Halo stud earrings.', image: JEWELRY_IMAGES.earring1, images: [JEWELRY_IMAGES.earring1], rating: 5 },
  { id: 11, name: 'Eternal', style: 'Diamond Band', metal: 'Platinum', shape: 'Emerald', category: 'Rings', price: 202230, originalPrice: 224700, cut: 'Excellent', clarity: 'IF', color: 'D', carat: 3.0, diamondType: 'lab', description: 'Emerald cut eternity band.', image: JEWELRY_IMAGES.platinum2, images: [JEWELRY_IMAGES.platinum2], rating: 5, isNew: true },
  { id: 12, name: 'Seraphina', style: 'Trilogy', metal: 'White Gold', shape: 'Oval', category: 'Rings', price: 95000, originalPrice: 105000, cut: 'Excellent', clarity: 'VVS1', color: 'D', carat: 1.5, diamondType: 'lab', description: 'Oval trilogy ring.', image: JEWELRY_IMAGES.ring1, images: [JEWELRY_IMAGES.ring1], rating: 5 },
  { id: 13, name: 'Grace', style: 'Vintage', metal: 'Rose Gold', shape: 'Heart', category: 'Necklaces', price: 68000, originalPrice: 76000, cut: 'Excellent', clarity: 'VS1', color: 'G', carat: 0.6, diamondType: 'lab', description: 'Heart pendant vintage style.', image: JEWELRY_IMAGES.necklace2, images: [JEWELRY_IMAGES.necklace2], rating: 5 },
  { id: 14, name: 'Brilliance', style: 'Solitaire', metal: 'White Gold', shape: 'Marquise', category: 'Earrings', price: 72000, originalPrice: 80000, cut: 'Very Good', clarity: 'VVS2', color: 'D', carat: 0.5, diamondType: 'lab', description: 'Marquise cut earrings.', image: JEWELRY_IMAGES.earring2, images: [JEWELRY_IMAGES.earring2], rating: 5 },
  { id: 15, name: 'Radiance', style: 'Solitaire', metal: 'Platinum', shape: 'Round', category: 'Rings', price: 89000, originalPrice: 99000, cut: 'Excellent', clarity: 'IF', color: 'D', carat: 1.3, diamondType: 'natural', description: 'Premium natural solitaire.', image: JEWELRY_IMAGES.ring1, images: [JEWELRY_IMAGES.ring1], rating: 5, isNew: true },
  { id: 16, name: 'Opulence', style: 'Halo', metal: 'White Gold', shape: 'Pear', category: 'Necklaces', price: 53000, originalPrice: 59000, cut: 'Excellent', clarity: 'VS1', color: 'E', carat: 0.8, diamondType: 'lab', description: 'Pear halo pendant.', image: JEWELRY_IMAGES.necklace1, images: [JEWELRY_IMAGES.necklace1], rating: 5 },
  { id: 17, name: 'Aurora', style: 'Halo', metal: 'Rose Gold', shape: 'Oval', category: 'Rings', price: 92000, originalPrice: 102500, cut: 'Excellent', clarity: 'VVS1', color: 'E', carat: 1.4, diamondType: 'lab', description: 'Oval halo rose gold ring.', image: JEWELRY_IMAGES.halo2, images: [JEWELRY_IMAGES.halo2], rating: 5, isNew: true },
  { id: 18, name: 'Cascade', style: 'Vintage', metal: 'Yellow Gold', shape: 'Cushion', category: 'Rings', price: 82000, originalPrice: 92000, cut: 'Excellent', clarity: 'VS2', color: 'G', carat: 1.2, diamondType: 'natural', description: 'Cushion vintage ring.', image: JEWELRY_IMAGES.vintage1, images: [JEWELRY_IMAGES.vintage1], rating: 5 },
  { id: 19, name: 'Soleil', style: 'Diamond Band', metal: 'White Gold', shape: 'Round', category: 'Earrings', price: 45000, originalPrice: 50500, cut: 'Excellent', clarity: 'VVS2', color: 'E', carat: 0.5, diamondType: 'lab', description: 'Diamond stud earrings.', image: JEWELRY_IMAGES.earring1, images: [JEWELRY_IMAGES.earring1], rating: 5 },
  { id: 20, name: 'Monarch', style: 'Trilogy', metal: 'Platinum', shape: 'Princess', category: 'Rings', price: 148000, originalPrice: 165000, cut: 'Excellent', clarity: 'IF', color: 'D', carat: 2.5, diamondType: 'lab', description: 'Princess trilogy platinum.', image: JEWELRY_IMAGES.platinum1, images: [JEWELRY_IMAGES.platinum1], rating: 5, isNew: true },
  { id: 21, name: 'Celestine', style: 'Solitaire', metal: 'Rose Gold', shape: 'Pear', category: 'Rings', price: 71000, originalPrice: 79500, cut: 'Very Good', clarity: 'VS2', color: 'F', carat: 1.0, diamondType: 'lab', description: 'Pear rose gold solitaire.', image: JEWELRY_IMAGES.halo1, images: [JEWELRY_IMAGES.halo1], rating: 5 },
  { id: 22, name: 'Eternity', style: 'Diamond Band', metal: 'Platinum', shape: 'Round', category: 'Rings', price: 115000, originalPrice: 128000, cut: 'Excellent', clarity: 'VS1', color: 'E', carat: 2.0, diamondType: 'natural', description: 'Full eternity platinum band.', image: JEWELRY_IMAGES.platinum1, images: [JEWELRY_IMAGES.platinum1], rating: 5 },
  { id: 23, name: 'Marquise Pendant', style: 'Vintage', metal: 'Yellow Gold', shape: 'Marquise', category: 'Necklaces', price: 88000, originalPrice: 98000, cut: 'Excellent', clarity: 'VVS2', color: 'E', carat: 1.8, diamondType: 'lab', description: 'Marquise vintage pendant.', image: JEWELRY_IMAGES.necklace2, images: [JEWELRY_IMAGES.necklace2], rating: 5, isNew: true },
  { id: 24, name: 'Athena', style: 'Halo', metal: 'White Gold', shape: 'Cushion', category: 'Rings', price: 105000, originalPrice: 118000, cut: 'Excellent', clarity: 'IF', color: 'D', carat: 1.8, diamondType: 'natural', description: 'Cushion halo ring.', image: JEWELRY_IMAGES.halo1, images: [JEWELRY_IMAGES.halo1], rating: 5 },
  { id: 25, name: 'Solstice', style: 'Solitaire', metal: 'Platinum', shape: 'Emerald', category: 'Rings', price: 135000, originalPrice: 150000, cut: 'Excellent', clarity: 'FL', color: 'D', carat: 2.2, diamondType: 'natural', description: 'Emerald platinum solitaire.', image: JEWELRY_IMAGES.platinum2, images: [JEWELRY_IMAGES.platinum2], rating: 5, isNew: true },
];

const initDB = async () => {
  try {
    await connectDB();
    
    // Clear and insert products
    await Product.deleteMany({});
    const inserted = await Product.insertMany(products);
    
    
    // Create admin user if not exists
    const admin = await User.findOne({ email: 'admin@jewellery.com' });
    if (!admin) {
      const salt = await bcryptjs.genSalt(10);
      const hash = await bcryptjs.hash('admin123456', salt);
      await User.create({
        name: 'Admin',
        email: 'admin@jewellery.com',
        password: hash,
        phone: '9999999999',
        isAdmin: true,
      });
      
    }
    
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Init failed:', error.message);
    process.exit(1);
  }
};

initDB();
