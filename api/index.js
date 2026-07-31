import app from "../backend/server.js";
import mongoose from "mongoose";

let isConnected = false;

async function ensureDbConnection() {
  if (isConnected || mongoose.connection.readyState === 1) return;

  mongoose.set("strictQuery", true);

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI não definida nas variáveis de ambiente.");
  }

  await mongoose.connect(mongoUri);
  isConnected = true;
}

export default async function handler(req, res) {
  try {
    await ensureDbConnection();
    return app(req, res);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao inicializar API",
      error: String(error?.message || error),
    });
  }
}
