import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  accountType:{type:String, required: true },
  phone:  { type: String, required: true, unique: true },
  password: { type: String, required: true },
  sessionId: {type:String,  },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

export const User = mongoose.model('task-manager-users', userSchema);
