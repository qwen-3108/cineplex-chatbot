const fs = require('fs');
const { MongoClient } = require('mongodb');
const MONGODB_URI = require('./connection_string');

async function getLogs(chatId) {

    const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    try {

        await client.connect();
        const db = client.db('cinemaDB');
        console.log(`Connected to database ${db.databaseName}`);
        const logCollection = await db.collection("logs");

        console.log('Retrieving logs of ', chatId, ' from mongoDB...');

        const logs = await logCollection.findOne({ _id: chatId });
        if (logs !== null) {
            fs.writeFile(`../#asset/logs/logs_${chatId}.txt`, logs.data, function (err) { console.log("Write logs error: ", err) });
        } else {
            console.log("failed to find logs");
        }
    }

    catch (ex) {
        console.log('-----Error!-----');
        console.log('uri:', MONGODB_URI);
        console.log('chatId: ', chatId);
        console.log(ex);
    }
};

getLogs("750594803");