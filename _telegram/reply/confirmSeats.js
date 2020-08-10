const Phrases = require('../../@global/PHRASES');
const makeSeatNumPhrase = require('../../@util/makeSeatNumPhrase');
const post = require('../post');

module.exports = async function confirmSeats(chat_id, seatNumbers) {

    const text = seatNumbers.length > 1 ? `So it would be a total of ${seatNumbers.length} seats, ${makeSeatNumPhrase(seatNumbers)}. ${Phrases.DOUBLE_CHECK()}` : `So there would be just one seat and that is ${seatNumbers[0]}. ${Phrases.DOUBLE_CHECK()}`;

    await post.sendMessage(chat_id, text);
}