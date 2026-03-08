import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
  name: String,
  desc: String,
  album: String,
  image: String,
  file: String,
  duration: String,
});

export const Song =
  mongoose.models.Song || mongoose.model("Song", songSchema);