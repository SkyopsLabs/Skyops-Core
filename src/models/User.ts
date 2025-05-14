import mongoose from "mongoose";

const Schema = mongoose.Schema;

const pointsHistorySchema = new Schema({
  date: { type: String, required: true },
  type: { type: String, required: true }, // e.g., "earned", "spent", "bonus"
  points: { type: Number, required: true },
});
const postSchema = new Schema({
  link: { type: String, required: true },
  type: { type: String, required: true },
  claimed: { type: Boolean, default: false },
  points: { type: Number, default: 0 },
});

const userSchema = new Schema({
  username: { type: String, required: false },
  code: { type: String, required: true },
  gmail: { type: String, required: false },
  referee: { type: String, required: false },
  discord_id: { type: String, required: false },
  discord_username: { type: String, required: false },
  x_id: { type: String, required: false },
  x_username: { type: String, required: false },
  tg_id: { type: String, required: false },
  tg_username: { type: String, required: false },
  lastDiscordMessage: { type: Number, required: false },
  lastTelegramMessage: { type: Number, required: false },
  wallet: { type: String, required: true },
  balance: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  claimedDiscord: { type: Boolean, default: false },
  claimedTelegram: { type: Boolean, default: false },
  tokens: { type: Number, default: 0 },
  posts: { type: [postSchema], default: [] },
  pointsHistory: { type: [pointsHistorySchema], default: [] },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export const User = mongoose.model("users", userSchema);
