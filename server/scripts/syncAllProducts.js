import mongoose from "mongoose";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import Product from "../models/Product.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

// Frontend products data with correct image paths
const imageMap = {
  1: { image: "/assets/ring-1.jpg", images: ["/assets/ring-1.jpg", "/assets/ring-2.jpg", "/assets/ring-3.jpg"] },
  2: { image: "/assets/ring-2.jpg", images: ["/assets/ring-2.jpg", "/assets/ring-1.jpg", "/assets/ring-4.jpg"] },
  3: { image: "/assets/ring-3.jpg", images: ["/assets/ring-3.jpg", "/assets/ring-5.jpg", "/assets/ring-6.jpg"] },
  4: { image: "/assets/ring-4.jpg", images: ["/assets/ring-4.jpg", "/assets/ring-7.jpg", "/assets/ring-8.jpg"] },
  5: { image: "/assets/ring-5.jpg", images: ["/assets/ring-5.jpg", "/assets/ring-3.jpg", "/assets/ring-1.jpg"] },
  6: { image: "/assets/ring-6.jpg", images: ["/assets/ring-6.jpg", "/assets/ring-2.jpg", "/assets/ring-4.jpg"] },
  7: { image: "/assets/ring-7.jpg", images: ["/assets/ring-7.jpg", "/assets/ring-8.jpg", "/assets/ring-5.jpg"] },
  8: { image: "/assets/ring-8.jpg", images: ["/assets/ring-8.jpg", "/assets/ring-1.jpg", "/assets/ring-6.jpg"] },
  9: { image: "/assets/ring-1.jpg", images: ["/assets/ring-1.jpg", "/assets/ring-4.jpg", "/assets/ring-6.jpg"] },
  10: { image: "/assets/ring-4.jpg", images: ["/assets/ring-4.jpg", "/assets/ring-2.jpg", "/assets/ring-7.jpg"] },
  11: { image: "/assets/ring-2.jpg", images: ["/assets/ring-2.jpg", "/assets/ring-5.jpg", "/assets/ring-8.jpg"] },
  13: { image: "/assets/ring-1.jpg", images: ["/assets/ring-1.jpg", "/assets/ring-2.jpg", "/assets/ring-3.jpg"] },
  14: { image: "/assets/ring-2.jpg", images: ["/assets/ring-2.jpg", "/assets/ring-1.jpg", "/assets/ring-4.jpg"] },
  15: { image: "/assets/ring-3.jpg", images: ["/assets/ring-3.jpg", "/assets/ring-5.jpg", "/assets/ring-6.jpg"] },
  16: { image: "/assets/ring-4.jpg", images: ["/assets/ring-4.jpg", "/assets/ring-7.jpg", "/assets/ring-8.jpg"] },
  17: { image: "/assets/ring-5.jpg", images: ["/assets/ring-5.jpg", "/assets/ring-3.jpg", "/assets/ring-1.jpg"] },
  18: { image: "/assets/ring-6.jpg", images: ["/assets/ring-6.jpg", "/assets/ring-2.jpg", "/assets/ring-4.jpg"] },
  19: { image: "/assets/ring-7.jpg", images: ["/assets/ring-7.jpg", "/assets/ring-8.jpg", "/assets/ring-5.jpg"] },
  20: { image: "/assets/ring-8.jpg", images: ["/assets/ring-8.jpg", "/assets/ring-1.jpg", "/assets/ring-6.jpg"] },
  21: { image: "/assets/ring-1.jpg", images: ["/assets/ring-1.jpg", "/assets/ring-4.jpg", "/assets/ring-6.jpg"] },
  22: { image: "/assets/ring-2.jpg", images: ["/assets/ring-2.jpg", "/assets/ring-5.jpg", "/assets/ring-8.jpg"] },
  23: { image: "/assets/ring-3.jpg", images: ["/assets/ring-3.jpg", "/assets/ring-6.jpg", "/assets/ring-1.jpg"] },
  24: { image: "/assets/ring-4.jpg", images: ["/assets/ring-4.jpg", "/assets/ring-2.jpg", "/assets/ring-7.jpg"] },
};

const frontendProducts = [
  {
    id: 1, name: "Delicacy", style: "Solitaire", metal: "White Gold", shape: "Round", category: "Rings",
    price: 64100, originalPrice: 72800, image: imageMap[1].image, images: imageMap[1].images,
    cut: "Excellent", clarity: "VVS1", color: "D", carat: 1.0, isNew: false, diamondType: "lab",
    description: "A timeless solitaire setting that lets the diamond take center stage. The Delicacy features a slim, polished band crafted in white gold."
  },
  {
    id: 2, name: "Aria", style: "Diamond Band", metal: "White Gold", shape: "Round", category: "Rings",
    price: 85450, originalPrice: 94940, image: imageMap[2].image, images: imageMap[2].images,
    cut: "Excellent", clarity: "VS1", color: "E", carat: 1.2, diamondType: "lab",
    description: "The Aria Diamond Band features a stunning center stone complemented by a band of brilliant pavé-set diamonds."
  },
  {
    id: 3, name: "Starlight", style: "Vintage", metal: "White Gold", shape: "Round", category: "Rings",
    price: 60410, originalPrice: 68660, image: imageMap[3].image, images: imageMap[3].images, isNew: true,
    cut: "Very Good", clarity: "VVS2", color: "F", carat: 0.8, diamondType: "natural",
    description: "Inspired by Art Deco elegance, the Starlight features intricate milgrain detailing and a beautifully set center stone."
  },
  {
    id: 4, name: "Aphrodite", style: "Halo", metal: "White Gold", shape: "Round", category: "Rings",
    price: 112960, originalPrice: 125510, image: imageMap[4].image, images: imageMap[4].images,
    cut: "Excellent", clarity: "IF", color: "D", carat: 1.5, diamondType: "natural",
    description: "The Aphrodite Halo surrounds a stunning center diamond with a circle of smaller brilliant-cut diamonds."
  },
  {
    id: 5, name: "Valencia", style: "Trilogy", metal: "White Gold", shape: "Round", category: "Rings",
    price: 85820, originalPrice: 95360, image: imageMap[5].image, images: imageMap[5].images,
    cut: "Very Good", clarity: "VS2", color: "G", carat: 1.8, diamondType: "lab",
    description: "Three beautiful stones symbolize past, present, and future in this classic trilogy design."
  },
  {
    id: 6, name: "Hope", style: "Solitaire", metal: "Yellow Gold", shape: "Oval", category: "Rings",
    price: 58380, originalPrice: 66340, image: imageMap[6].image, images: imageMap[6].images,
    cut: "Good", clarity: "SI1", color: "H", carat: 0.7, diamondType: "natural",
    description: "A delicate oval solitaire set in warm yellow gold. The Hope ring brings understated elegance to any hand."
  },
  {
    id: 7, name: "Kindrea", style: "Diamond Band", metal: "Rose Gold", shape: "Cushion", category: "Rings",
    price: 82560, originalPrice: 91730, image: imageMap[7].image, images: imageMap[7].images,
    cut: "Excellent", clarity: "VVS1", color: "E", carat: 2.0, diamondType: "lab",
    description: "A breathtaking cushion-cut diamond set in a rose gold diamond band with stunning side stones."
  },
  {
    id: 8, name: "Contour", style: "Solitaire", metal: "Platinum", shape: "Princess", category: "Rings",
    price: 53410, originalPrice: 60700, image: imageMap[8].image, images: imageMap[8].images, isNew: true,
    cut: "Very Good", clarity: "VS1", color: "F", carat: 0.9, diamondType: "natural",
    description: "The Contour features a modern princess-cut diamond set in durable platinum with clean, geometric lines."
  },
  {
    id: 9, name: "Luminance", style: "Solitaire", metal: "White Gold", shape: "Pear", category: "Necklaces",
    price: 133750, originalPrice: 155150, image: imageMap[9].image, images: imageMap[9].images,
    cut: "Excellent", clarity: "FL", color: "D", carat: 2.5, diamondType: "lab",
    description: "A spectacular pear-shaped diamond pendant on a delicate white gold chain."
  },
  {
    id: 10, name: "Celeste", style: "Halo", metal: "Yellow Gold", shape: "Round", category: "Earrings",
    price: 98440, originalPrice: 117700, image: imageMap[10].image, images: imageMap[10].images,
    cut: "Excellent", clarity: "VVS2", color: "E", carat: 1.0, diamondType: "natural",
    description: "Stunning halo diamond stud earrings set in warm yellow gold, perfect for every occasion."
  },
  {
    id: 11, name: "Eternal", style: "Diamond Band", metal: "Platinum", shape: "Emerald", category: "Rings",
    price: 202230, originalPrice: 224700, image: imageMap[11].image, images: imageMap[11].images,
    cut: "Excellent", clarity: "IF", color: "D", carat: 3.0, diamondType: "lab",
    description: "A magnificent emerald-cut diamond set with a full eternity diamond band in platinum."
  },
  {
    id: 13, name: "Bracelet Classic", style: "Solitaire", metal: "White Gold", shape: "Round", category: "Rings",
    price: 45600, originalPrice: 51200, image: imageMap[13].image, images: imageMap[13].images,
    cut: "Excellent", clarity: "VS1", color: "G", carat: 0.8, diamondType: "lab",
    description: "Classic bracelet design with round diamonds."
  },
  {
    id: 14, name: "Wedding Promise", style: "Diamond Band", metal: "Platinum", shape: "Princess", category: "Rings",
    price: 125000, originalPrice: 140000, image: imageMap[14].image, images: imageMap[14].images,
    cut: "Very Good", clarity: "VVS1", color: "E", carat: 1.5, diamondType: "natural",
    description: "Perfect wedding band with princess cut diamonds."
  },
  {
    id: 15, name: "Ring Collaboration", style: "Halo", metal: "Rose Gold", shape: "Oval", category: "Rings",
    price: 89000, originalPrice: 98000, image: imageMap[15].image, images: imageMap[15].images,
    cut: "Excellent", clarity: "IF", color: "D", carat: 1.2, diamondType: "lab",
    description: "Collaborative design with oval halo setting."
  },
  {
    id: 16, name: "Solitaire Dream", style: "Solitaire", metal: "Yellow Gold", shape: "Heart", category: "Rings",
    price: 67500, originalPrice: 75000, image: imageMap[16].image, images: imageMap[16].images,
    cut: "Good", clarity: "VS2", color: "F", carat: 1.0, diamondType: "natural",
    description: "Heart-shaped solitaire in yellow gold."
  },
  {
    id: 17, name: "Custom Earrings", style: "Vintage", metal: "White Gold", shape: "Pear", category: "Earrings",
    price: 78000, originalPrice: 86000, image: imageMap[17].image, images: imageMap[17].images,
    cut: "Very Good", clarity: "SI1", color: "H", carat: 0.9, diamondType: "lab",
    description: "Custom vintage pear-shaped earrings."
  },
  {
    id: 18, name: "Necklace Elegant", style: "Trilogy", metal: "Platinum", shape: "Emerald", category: "Necklaces",
    price: 145000, originalPrice: 160000, image: imageMap[18].image, images: imageMap[18].images,
    cut: "Excellent", clarity: "VVS2", color: "E", carat: 2.2, diamondType: "natural",
    description: "Elegant emerald cut trilogy necklace."
  },
  {
    id: 19, name: "Bracelet Modern", style: "Diamond Band", metal: "Rose Gold", shape: "Cushion", category: "Rings",
    price: 92000, originalPrice: 102000, image: imageMap[19].image, images: imageMap[19].images,
    cut: "Very Good", clarity: "VS1", color: "G", carat: 1.3, diamondType: "lab",
    description: "Modern cushion cut bracelet design."
  },
  {
    id: 20, name: "Wedding Ring Set", style: "Halo", metal: "White Gold", shape: "Round", category: "Rings",
    price: 168000, originalPrice: 185000, image: imageMap[20].image, images: imageMap[20].images,
    cut: "Excellent", clarity: "IF", color: "D", carat: 2.5, diamondType: "natural",
    description: "Complete wedding ring set with halo design."
  },
  {
    id: 21, name: "Diamond Pendant", style: "Solitaire", metal: "Yellow Gold", shape: "Marquise", category: "Necklaces",
    price: 112000, originalPrice: 125000, image: imageMap[21].image, images: imageMap[21].images,
    cut: "Good", clarity: "SI2", color: "I", carat: 1.8, diamondType: "lab",
    description: "Marquise diamond pendant necklace."
  },
  {
    id: 22, name: "Earrings Luxe", style: "Diamond Band", metal: "Platinum", shape: "Princess", category: "Earrings",
    price: 135000, originalPrice: 150000, image: imageMap[22].image, images: imageMap[22].images,
    cut: "Excellent", clarity: "VVS1", color: "F", carat: 1.6, diamondType: "natural",
    description: "Luxurious princess cut diamond earrings."
  },
  {
    id: 23, name: "Bracelet Chain", style: "Vintage", metal: "Rose Gold", shape: "Oval", category: "Rings",
    price: 76000, originalPrice: 84000, image: imageMap[23].image, images: imageMap[23].images,
    cut: "Very Good", clarity: "VS2", color: "H", carat: 1.1, diamondType: "lab",
    description: "Vintage oval bracelet with chain design."
  },
  {
    id: 24, name: "Ring Special", style: "Trilogy", metal: "White Gold", shape: "Heart", category: "Rings",
    price: 98000, originalPrice: 108000, image: imageMap[24].image, images: imageMap[24].images,
    cut: "Excellent", clarity: "SI1", color: "G", carat: 1.4, diamondType: "natural",
    description: "Special trilogy heart-shaped ring."
  },
];

async function syncProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    

    // Count existing products before sync
    const beforeCount = await Product.countDocuments();
    

    // Delete all existing products
    await Product.deleteMany({});
    

    // Insert all frontend products
    await Product.insertMany(frontendProducts);
    

    // Verify final count
    const afterCount = await Product.countDocuments();
    

    
     are now in the database.\n");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Sync failed:", error.message);
    process.exit(1);
  }
}

syncProducts();
