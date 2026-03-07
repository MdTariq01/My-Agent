import mongoose from 'mongoose'

export async function connectDB() {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('MongoDB connected')
  } catch (error) {
    console.error('MongoDB connection failed:', error)
    process.exit(1)
  }
}