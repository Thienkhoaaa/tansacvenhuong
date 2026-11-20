import mongoose from 'mongoose';

export async function connectDatabase(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('⚠️ MONGODB_URI is not set. Running in in-memory fallback mode.');
    return;
  }

  mongoose.set('strictQuery', true);
  mongoose.set('bufferCommands', false);
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB Atlas successfully.');
  } catch (error) {
    console.warn('⚠️ MongoDB connection notice (Ensure IP 0.0.0.0/0 or server IP is in Atlas Network Access):', error);
  }
}
