import mongoose from "mongoose";

const Schema = mongoose.Schema;

const texthubSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "text",
  },
  tokens: {
    type: Number,
    required: true,
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

export const TextHub = mongoose.model("texts", texthubSchema);
