const { MongoClient } = require('mongodb');
const { COLLECTIONS } = require('../@global/COLLECTIONS');

module.exports = async function connect(uri, dbName) {

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const db = client.db(dbName);
        console.log(`Connected to database ${db.databaseName}`);

        const collections = await db.collections();
        collections.forEach(c => COLLECTIONS[c.collectionName] = c);
        console.log('collections: ', JSON.stringify(Object.keys(COLLECTIONS)));
        return client;
    }

    catch (ex) {
        console.log('-----Error!-----');
        console.log('uri received: ', uri);
        console.log('dbName received: ', dbName);
        console.log(ex);
    }
};

