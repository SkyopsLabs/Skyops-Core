import mongoose from "mongoose";

const Schema = mongoose.Schema;

const discordUserSchema = new Schema({
  userId: String,
  username: String,
  lastMessage: Date,
});


const userSchema = new Schema({
  username: {
    type: String,
    required: false,
  },
  wallet: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  tokens: {
    type: Number,
    default: 0,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.model("users", userSchema);
