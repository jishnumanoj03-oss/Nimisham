import mongoose from 'mongoose';
import env from './env.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✓ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`✗ MongoDB connection error: ${error.message}`);
    if (error.message.includes('SSL') || error.message.includes('tlsv1 alert') || error.message.includes('ECONNREFUSED')) {
      console.warn('\n💡 Troubleshooting MongoDB Connection:');
      console.warn('  1. Ensure your IP address is whitelisted in MongoDB Atlas Network Access (set to 0.0.0.0/0 for access from anywhere).');
      console.warn('  2. Verify your MongoDB connection string in .env is correct.\n');
    }
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.warn('⚠ MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error(`✗ MongoDB error: ${err.message}`);
});

export default connectDB;
