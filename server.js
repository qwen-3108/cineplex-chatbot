require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

async function start() {
    //#1: setup express app
    const app = express();

    //#2: connect db
    const connect = require('./_database/connect');
    await connect(process.env.MONGODB_URI, "cinemaDB");

    //#3: start change stream
    const { COLLECTIONS } = require('./@global/COLLECTIONS');
    const onShowtimeChange = require('./@changeStream/onShowtimeChange');
    const showtimeChangeStream = COLLECTIONS.showtimes.watch({ fullDocument: 'updateLookup' });
    showtimeChangeStream.on('change', onShowtimeChange);

    //#4: attach middleware and router
    app.use(bodyParser.json());
    app.use('/bot', require('./route/bot'));

    //#5: listen for request
    const PORT = process.env.PORT;
    app.listen(PORT, () => console.log(`listening requests on port ${PORT}...`));
}

start();
