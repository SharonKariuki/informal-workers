// Lib/mongoose.js

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in .env.local"
  );
}

// Global is used here to maintain a cached connection
// across hot reloads in development. Otherwise, many
// connections can be created and cause errors.

let cached = global._mongoose;

if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "kazi_link",
      bufferCommands: false,
    }).then((mongoose) => {
      console.log("✅ MongoDB connected");
      return mongoose;
    }).catch((error) => {
      console.error("❌ MongoDB connection error:", error);
      throw error;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
