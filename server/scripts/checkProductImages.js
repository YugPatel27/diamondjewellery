import mongoose from "mongoose";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import Product from "../models/Product.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

async function checkProductImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    

    // Get first 5 products with images
    const products = await Product.find({}).limit(5).sort({ id: 1 });
    
    
    
    products.forEach((p) => {
      
      
      
      }`);
      
    });
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed:", error.message);
    process.exit(1);
  }
}

checkProductImages();
