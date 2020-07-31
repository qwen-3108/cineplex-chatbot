const connect = require('../_database/connect');

module.exports = async function () {
    global._client = await connect(process.env.MONGODB_URI, "cinemaDB");
}