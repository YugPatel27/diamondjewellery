import mongoose from 'mongoose';
import { config } from './config.js';

const connectDB = async () => {
  try {
    const mongoUri = config.mongoUri;
    console.log(`📡 Connecting to MongoDB: ${mongoUri.substring(0, 30)}...`);
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });
    
    console.log('✅ MongoDB Connected Successfully');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    
    if (config.nodeEnv === 'development') {
      console.warn('⚠️ Development mode: Server continuing without DB (some features will fail)');
      return false;
    }
    
    // In production, retry connection after a delay
    console.log('🔄 Retrying MongoDB connection in 5 seconds...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    return connectDB();
  }
};

export default connectDB;
