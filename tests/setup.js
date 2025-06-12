const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');
const { app } = require('../server');
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

    jest.spyOn(database, 'getDatabase').mockImplementation(() => ({
        db: () => db,
        collection: (name) => db.collection(name)
    }))
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
    jest.restoreAllMocks();
});

module.exports = {
    getTestDb: () => db
};