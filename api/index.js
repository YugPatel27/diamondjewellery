import mongoose from 'mongoose';
import app from '../server/server.js';
import connectDB from '../server/config/database.js';

let isConnected = false;

// Ensure database connection before handling requests
const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }

  // Check mongoose connection state
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }

  try {
    console.log('Connecting to database from Vercel Serverless Function...');
    await connectDB();
    isConnected = true;
  } catch (error) {
    console.error('Failed to connect to database in serverless function:', error);
    throw error;
  }
};

export default async function handler(req, res) {
  try {
    await connectToDatabase();
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Database connection failed'
    });
  }

  // Pass the request to the Express app
  return app(req, res);
}
