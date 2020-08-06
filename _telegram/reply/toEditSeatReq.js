const { INTENT } = require('../../@global/CONSTANTS');
const Phrases = require('../../@global/PHRASES');
const sendMessage = require('../post/sendMessage');

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

    const reply = Phrases.ACKNOWLEDGEMENT(text) + `But instead of the seats you want to ${actionStr}, it would be great if you could tell me your final preferred seats, is that alright?`;
    await sendMessage(chat_id, reply);

}