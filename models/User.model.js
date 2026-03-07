import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  telegramChatId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('User', userSchema)