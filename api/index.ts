import mongoose from 'mongoose';
import { VercelRequest, VercelResponse } from '@vercel/node';
import config from '../src/config';
import app from '../src/app';

// MongoDB connection for serverless
let cachedConnection: typeof mongoose | null = null;

async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    cachedConnection = await mongoose.connect(config.database_url as string);
    console.log('Database connected');
    return cachedConnection;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await connectToDatabase();
  return app(req, res);
} 