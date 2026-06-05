import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true, index: true },
    style: { type: String, enum: ['Solitaire', 'Vintage', 'Diamond Band', 'Halo', 'Trilogy', 'Eternity'], required: true },
    metal: { type: String, enum: ['White Gold', 'Yellow Gold', 'Rose Gold', 'Platinum'], required: true },
    shape: { type: String, enum: ['Round', 'Princess', 'Cushion', 'Oval', 'Pear', 'Emerald', 'Heart', 'Marquise'], required: true },
    category: { type: String, enum: ['Rings', 'Necklaces', 'Earrings', 'Bracelets'], required: true, index: true },
    price: { type: Number, required: true, index: true },
    originalPrice: { type: Number, required: true },
    
    // New: Pricing breakdown fields
    diamondPrice: { type: Number, default: null },
    metalPrice: { type: Number, default: null },
    makingCharges: { type: Number, default: null },
    certificationCharges: { type: Number, default: 0 },
    
    // New: Metal and gold details
    goldWeight: { type: Number, default: null },
    metalDetails: {
      purity: { type: String, default: '18K' },
      weight: { type: Number, default: null },
      composition: String,
      makingChargesPerGram: { type: Number, default: null }
    },
    
    image: { type: String, required: true },
    images: [String],
    isNew: { type: Boolean, default: false },
    cut: { type: String, enum: ['Excellent', 'Very Good', 'Good'], required: true },
    clarity: { type: String, enum: ['FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2'], required: true },
    color: { type: String, enum: ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'], required: true },
    carat: { type: Number, required: true },
    description: { type: String, required: true },
    diamondType: { type: String, enum: ['natural', 'lab'], default: 'lab' },
    stock: { type: Number, default: 1 },
    rating: { type: Number, default: 5, min: 0, max: 5 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    likesCount: { type: Number, default: 0, index: true },
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

productSchema.index({ name: 'text', category: 1, price: 1 });

export default mongoose.model('Product', productSchema);
