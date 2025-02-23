import mongoose from "mongoose";

const Schema = mongoose.Schema;

const conversationSchema = new Schema({
  sender: {
    type: String,
    enum: ["system", "user"],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: false,
  },
  tokens: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const texthubSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true  ,
  },
  type: {
    type: String,
    default: "text",
  },
  conversations: [conversationSchema],
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

export const TextHub = mongoose.model("texts", texthubSchema);
