import mongoose from "mongoose";

const Schema = mongoose.Schema;

const orgSchema = new Schema({
  name: {
    type: String,
    default: "-",
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  members: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

export const Organization = mongoose.model("organizations", orgSchema);
