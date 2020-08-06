const Phrases = require('../../@global/PHRASES');
const sendMessage = require('../post/sendMessage');

module.exports = async function toEditSeatReq(chat_id, text, actionStr) {

    const reply = Phrases.ACKNOWLEDGEMENT(text) + `But instead of the seats you want to ${actionStr}, it would be great if you could tell me your final preferred seats, is that alright?`;
    await sendMessage(chat_id, reply);

}