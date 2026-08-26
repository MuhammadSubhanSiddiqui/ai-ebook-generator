import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';

dotenv.config();

let mongoServer;

export const connectTestDB = async () => {
  if (process.env.MONGO_URI) {
    const baseUri = process.env.MONGO_URI.includes('?')
      ? process.env.MONGO_URI.replace('/ai-ebook-generator?', '/ai-ebook-generator-test?')
      : `${process.env.MONGO_URI}_test`;
    await mongoose.connect(baseUri);
    return;
  }

  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
};

export const closeTestDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
};

export const clearTestDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
};
