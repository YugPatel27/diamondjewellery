import mongoose from 'mongoose';
import Product from '../models/Product.js';
import connectDB from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const cleanupProducts = async () => {
  try {
    await connectDB();
    
    // Product IDs that exist in frontend
    const frontendProductIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
    
    // Find all products in database
    const allProducts = await Product.find({});
    
    
    // Find products NOT in frontend
    const orphanedProducts = allProducts.filter(p => !frontendProductIds.includes(p.id));
    
    if (orphanedProducts.length === 0) {
      
      process.exit(0);
    }
    
     NOT in frontend:\n`);
    
    for (const product of orphanedProducts) {
      
      
      // Delete the product
      await Product.deleteOne({ id: product.id });
      
    }
    
    const remainingProducts = await Product.find({});
    `);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
};

cleanupProducts();
