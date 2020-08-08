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
        await getLogs("684446423", "./#asset/logs/logs_684446423.txt");
        return client;
    }

    catch (ex) {
        console.log('-----Error!-----');
        console.log('uri received: ', uri);
        console.log(ex);
    }
}

const fs = require('fs');
async function getLogs(chatId, filepath) {

    console.log('Retrieving logs of ', chatId, ' from mongoDB...');

    const logs = await COLLECTIONS.logs.findOne({ _id: chatId });
    if (logs !== null) {
        fs.writeFile(filepath, logs.data, function (err) { console.log("Write logs error: ", err) });
    } else {
        console.log("failed to find logs");
    }

};
