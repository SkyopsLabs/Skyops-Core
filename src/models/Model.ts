import mongoose from "mongoose";

const Schema = mongoose.Schema;

const modelSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  pricePerInference: {
    type: Number,
    required: true,
  },
  pricePerFineTune: {
    type: Number,
    required: true,
  },
  downloads: {
    type: Number,
    default: 0,
  },
  link: {
    type: String,
    required: true,
  },
  type: {
    type: String,
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

export const Model = mongoose.model("models", modelSchema);
