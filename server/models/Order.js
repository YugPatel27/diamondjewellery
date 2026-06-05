import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: String,
        price: Number,
        quantity: Number,
        image: String,
        description: String,
        
        // Price breakdown fields
        diamondPrice: { type: Number, default: 0 },
        metalPrice: { type: Number, default: 0 },
        makingCharges: { type: Number, default: 0 },
        certificationCharges: { type: Number, default: 0 },
        
        // Customization details
        customization: {
          type: Object,
          default: undefined
        },
        customizationPrice: { type: Number, default: 0 },
        
        // Metal and gold details
        metalType: String,
        goldWeight: { type: Number, default: null }
      }
    ],
    totalPrice: { type: Number, required: true },
    gst: { type: Number, default: 0 },
    finalTotal: { type: Number, required: true },
    totalItems: { type: Number, required: true },
    
    // Pricing summary
    priceSummary: {
      diamondTotal: { type: Number, default: 0 },
      metalTotal: { type: Number, default: 0 },
      makingChargesTotal: { type: Number, default: 0 },
      certificationTotal: { type: Number, default: 0 }
    },
    
    // Price conflict handling
    priceLocked: { type: Boolean, default: false },
    priceLockedAt: { type: Date, default: null },
    originalPrice: { type: Number, default: null },
    priceConflictNotified: { type: Boolean, default: false },
    priceConflictReason: { type: String, default: null },
    
    shippingAddress: {
      name: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      pincode: String,
    },
    notes: String,
    status: { 
      type: String, 
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'price_conflict'], 
      default: 'pending',
      index: true
    },
    paymentStatus: { 
      type: String, 
      enum: ['pending', 'paid', 'failed'], 
      default: 'pending' 
    },
    paymentMethod: { type: String, enum: ['cod', 'stripe', 'upi', 'bank_transfer', 'check'], default: 'cod' },
    checkoutToken: { type: String, default: undefined },
    pricingSnapshotHash: { type: String, default: undefined },
    paymentVerificationToken: { type: String, default: undefined },
    pricingSnapshot: { type: Object, default: undefined },
    trackingNumber: String,
  },
  { timestamps: true }
);

orderSchema.index({ userId: 1, status: 1 });
orderSchema.index({ orderId: 1 });
orderSchema.index({ userId: 1, checkoutToken: 1 }, { unique: true, sparse: true });
orderSchema.index({ priceLocked: 1, status: 1 });

export default mongoose.model('Order', orderSchema);
