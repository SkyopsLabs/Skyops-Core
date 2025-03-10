import mongoose from "mongoose";

const Schema = mongoose.Schema;

const discordUserSchema = new Schema({
  userId: String,
  username: String,
  lastMessage: Date,
  content:String
});

export const Discord = mongoose.model("discord", discordUserSchema);
