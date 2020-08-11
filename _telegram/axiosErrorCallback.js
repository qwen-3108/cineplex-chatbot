const { logError } = require("../@global/LOGS")

module.exports = function axiosErrorCallback(chatId, err) {
    console.log("entered axiosErrorCallback");
    if (err.response) {
        // Request made and server responded
        console.log("axios error has response data");
        logError(chatId, JSON.stringify(err.response.data));
    } else if (err.request) {
        // The request was made but no response was received
        console.log("error has request data");
        logError(chatId, JSON.stringify(err.request));
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log("error happened before sending request");
        logError(chatId, JSON.stringify(err.message));
    }
}