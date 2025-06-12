const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');

dotenv.config();
let database;

const initDB = (callback) => {
    if (database) {
        console.log("DB is already initialized!");
        return callback(null, database);
    }
    MongoClient.connect(process.env.MONGO_URL)
        .then((client) => {
            database = client;
            callback(null, database);
        })
        .catch((err) => {
            callback(err);
        });
}


const getDatabase = () =>{
    if (!database) {
        throw Error("Database not initialized");
    }
    return database;
}

// Add server cleanup function
const cleanup = async () => {
    if (database) {
        await database.close();
        database = null;
    }
};


module.exports = {
    initDB,
    getDatabase,
    cleanup
}