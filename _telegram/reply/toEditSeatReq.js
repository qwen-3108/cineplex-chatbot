const axios = require('axios');
const { TELEGRAM, INTENT } = require('../../@global/CONSTANTS');
const Phrases = require('../../@global/PHRASES');

module.exports = async function toEditSeatReq(chat_id, text, intent) {

    let actionStr;
    switch (intent) {
        case INTENT.ADD_SEAT:
            actionStr = 'add';
            break;
        case INTENT.CHANGE_SEAT:
            actionStr = 'change';
            break;
        case INTENT.REMOVE_SEAT:
            actionStr = 'remove';
            break;
        default:
            throw `Unrecognized choose seat sub intents ${intent}`;
    }


    const config = {
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/sendMessage',
        data: { chat_id, text: Phrases.ACKNOWLEDGEMENT(text) + `But instead of the seats you want to ${actionStr}, it would be great if you could tell me your final preferred seats, is that alright?` }
    }
    await axios(config);

}