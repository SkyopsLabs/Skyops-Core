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
  gmail: {
    type: String,
    required: false,
  },
  discord_id: {
    type: String,
    required: false,
  },
  discord_username: {
    type: String,
    required: false,
  },
  x_id: {
    type: String,
    required: false,
  },
  x_username: {
    type: String,
    required: false,
  },
  tg_id: {
    type: String,
    required: false,
  },
  tg_username: {
    type: String,
    required: false,
  },
  lastDiscordMessage: {
    type: Date,
    required: false,
  },
  lastTelegramMessage: {
    type: Date,
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
  points: {
    type: Number,
    default: 0,
  },
  claimedDiscord: {
    type: Boolean,
    default: false,
  },
  claimedTelegram: {
    type: Boolean,
    default: false,
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
