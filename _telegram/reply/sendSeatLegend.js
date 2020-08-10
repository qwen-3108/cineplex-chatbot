const Phrases = require('../../@global/PHRASES');
const post = require('../post');

module.exports = async function sendSeatLegend(chat_id) {

    const text = Phrases.POSITIVE() + "Here's the seating plan. The red seats are taken, the orange are reserved and the green are available. Please tell me the seat numbers you prefer\n‼️ The plan updates real-time. Please reply asap to secure your seats";
    await post.sendMessage(chat_id, text);

};