const Phrases = require('../../@global/PHRASES');
const sendMessage = require('../post/sendMessage');

module.exports = async function getEditSeats(chat_id) {

    const text = Phrases.POSITIVE() + 'May I have the seat numbers?';
    await sendMessage(chat_id, text);

}