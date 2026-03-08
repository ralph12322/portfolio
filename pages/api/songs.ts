import type { NextApiRequest, NextApiResponse } from "next";
import { connectDb } from "@/app/lib/db";
import { Song } from "@/app/lib/models/songs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectDb();
    const songs = await Song.find({}).select("name desc album image file duration");
    res.status(200).json({ success: true, count: songs.length, songs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch songs", error });
  }
}