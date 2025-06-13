const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');
const database = require('../data/database');

let mongoServer;
let connection;
let db;


beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    
    connection = await MongoClient.connect(uri);
    db = connection.db();

    await db.createCollection('Books');
    await db.createCollection('Users');
    await db.createCollection('Authors');
    await db.createCollection('Locals');

    database.initDB = jest.fn((callback) => callback(null, connection));
    database.getDatabase = jest.fn(() => connection);
});

afterAll(async () => {
    if (db) {
        const collections = await db.collections();
        for (const collection of collections) {
            await collection.deleteMany({});
        }
    }
    if (connection) {
        await connection.close();
    }
    if (mongoServer) {
        await mongoServer.stop();
    }

    database.initDB.mockRestore();
    database.getDatabase.mockRestore();
});