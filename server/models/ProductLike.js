import mongoose from 'mongoose';

const productLikeSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },
    productId: {
      type: Number,
      required: true,
      index: true
    },
    productRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    likedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Create compound index to prevent duplicate likes
productLikeSchema.index({ userId: 1, productId: 1 }, { unique: true });

export default mongoose.model('ProductLike', productLikeSchema);
