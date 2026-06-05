import mongoose from 'mongoose';
import Product from '../models/Product.js';
import connectDB from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const updateProducts = async () => {
  try {
    await connectDB();
    
    // Updated products to match frontend
    const updates = [
      {
        id: 10,
        name: "Celeste",
        style: "Halo",
        metal: "Yellow Gold",
        shape: "Round",
        category: "Earrings",
        price: 98440,
        originalPrice: 117700,
        cut: "Excellent",
        clarity: "VVS2",
        color: "E",
        carat: 1.0,
        diamondType: "natural",
        description: "Stunning halo diamond stud earrings set in warm yellow gold, perfect for every occasion."
      },
      {
        id: 11,
        name: "Eternal",
        style: "Diamond Band",
        metal: "Platinum",
        shape: "Emerald",
        category: "Rings",
        price: 202230,
        originalPrice: 224700,
        cut: "Excellent",
        clarity: "IF",
        color: "D",
        carat: 3.0,
        diamondType: "lab",
        description: "A magnificent emerald-cut diamond set with a full eternity diamond band in platinum."
      }
    ];

    for (const update of updates) {
      await Product.findOneAndUpdate(
        { id: update.id },
        update,
        { new: true, runValidators: true }
      );
      
    }

    // Delete product 12 (Opulence) if it doesn't have a frontend equivalent
    // Uncomment the line below to delete:
    // await Product.deleteOne({ id: 12 });
    // ');

    
    process.exit(0);
  } catch (error) {
    console.error('Error updating products:', error);
    process.exit(1);
  }
};

updateProducts();
