// tests/db-handler.js

import mongoose from 'mongoose';

import { MongoMemoryServer } from 'mongodb-memory-server';

export class TestDatabase {
  memoryServer: MongoMemoryServer;

  private constructor(memoryServer: MongoMemoryServer) {
    this.memoryServer = memoryServer;
  }

  public static async create() {
    return new TestDatabase(await MongoMemoryServer.create());
  }

  public async connect() {
    const uri = await this.memoryServer.getUri();
    await mongoose.connect(uri);
  }

  public async closeDatabase() {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await this.memoryServer.stop();
  }

  public async clearDatabase() {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany();
    }
  }
}
