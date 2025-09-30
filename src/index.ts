#!/usr/bin/env node
import mongoose from "mongoose";
import "dotenv/config";
import { setup } from "./setup.js";

const args = process.argv.slice(2);

// Handle setup command
if (args[0] === "setup") {
  await setup();
  process.exit(0);
}

// Handle regular ping command
const dataBaseUri = process.env.DATABASE_URI;
if (!dataBaseUri) {
  console.error("❌ DATABASE_URI not configured");
  process.exit(1);
}

try {
  await mongoose.connect(dataBaseUri);
  const admin = mongoose.connection.db?.admin();
  await admin?.ping();
  console.log("✅ MongoDB ping successful");
  await mongoose.disconnect();
} catch (err) {
  if (err instanceof Error) {
    console.error("❌ MongoDB ping failed:", err.message);
  }
  process.exit(1);
}