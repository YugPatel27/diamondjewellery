import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

// Default to development if not specified
const NODE_ENV = process.env.NODE_ENV || 'development';

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/jewellery',
  jwtSecret: process.env.JWT_SECRET || 'your_secret_key_here',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  nodeEnv: NODE_ENV,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};

export const corsOptions = {
  origin: function(origin, callback) {
    // In development, allow all origins
    if (NODE_ENV === 'development') {
      callback(null, true);
    } else {
      // In production, restrict to known URLs
      const allowedOrigins = [
        'https://diamondjewels.com',
        process.env.FRONTEND_URL,
        process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
        process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null,
        'http://localhost:5173'
      ].filter(Boolean);
      
      // Allow Vercel preview deployments
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
  maxAge: 86400
};
