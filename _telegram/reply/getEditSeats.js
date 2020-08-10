const Phrases = require('../../@global/PHRASES');
const post = require('../post');

module.exports = async function getEditSeats(chat_id) {

    const text = Phrases.POSITIVE() + 'May I have the seat numbers?';
    await post.sendMessage(chat_id, text);

}