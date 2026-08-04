import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import Service from "../models/Service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI;

async function seedServices() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI não definida no ambiente.");
  }

  const filePath = path.join(__dirname, "servicesmocj.json");
  const fileContent = await fs.readFile(filePath, "utf-8");
  const services = JSON.parse(fileContent);

  await mongoose.connect(MONGODB_URI);
  console.log("Conectado ao MongoDB.");

  try {
    await Service.deleteMany({});
    const inserted = await Service.insertMany(services);
    console.log(`Serviços inseridos com sucesso: ${inserted.length}`);
  } finally {
    await mongoose.disconnect();
    console.log("Desconectado do MongoDB.");
  }
}

seedServices().catch((error) => {
  console.error("Erro ao executar seed de services:", error);
  process.exit(1);
});
