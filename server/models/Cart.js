import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        customization: { type: Object, default: undefined },
        customizationPrice: { type: Number, default: 0 },
      }
    ],
    totalPrice: { type: Number, default: 0 },
    totalItems: { type: Number, default: 0 },
  },
  { timestamps: true }
);

cartSchema.index({ userId: 1 });

export default mongoose.model('Cart', cartSchema);
