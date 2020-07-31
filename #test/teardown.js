let { COLLECTIONS } = require("../@global/COLLECTIONS");

module.exports = async function () {
    global._client.close();
    COLLECTIONS = {};
};