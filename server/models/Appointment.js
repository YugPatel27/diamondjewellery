import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    date: { type: Date, required: true, index: true },
    time: { type: String, required: true },
    message: String,
    status: { 
      type: String, 
      enum: ['pending', 'confirmed', 'completed', 'cancelled'], 
      default: 'pending',
      index: true
    },
  },
  { timestamps: true }
);

appointmentSchema.index({ userId: 1, status: 1 });
appointmentSchema.index(
  { date: 1, time: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $ne: 'cancelled' } }
  }
);

export default mongoose.model('Appointment', appointmentSchema);
