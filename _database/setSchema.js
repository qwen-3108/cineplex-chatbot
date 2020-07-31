const { MongoClient } = require('mongodb');
const MONGODB_URI = require('./connection_string');

module.exports = async function setSchema(collectionName, jsonSchema) {

    const client = new MongoClient(MONGODB_URI, { useUnifiedTopology: true });

    try {
        await client.connect();
        const db = client.db("cinemaDB");
        console.log(`Connected to database ${db.databaseName}`);
        await db.command({
            collMod: collectionName,
            validator: {
                $jsonSchema: jsonSchema
            }
        });
    }

    catch (ex) {
        console.log('-----Error!-----');
        console.log(ex);
    }

    finally {
        client.close();
    }

}

