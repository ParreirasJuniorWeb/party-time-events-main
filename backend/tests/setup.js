import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Service from "../models/Service.js";
import Party from "../models/Party.js";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterEach(async () => {
  await Service.deleteMany({});
  await Party.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});
