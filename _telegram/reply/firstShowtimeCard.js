const Phrases = require('../../@global/PHRASES');
const post = require('../post');

module.exports = async function showtimeCard(chat_id) {

    const text = Phrases.ACKNOWLEDGEMENT("") + "Now you may use the ‘Back to List’ and ‘Seating Plan’ buttons to compare as many showtimes and seating plans as you’d like. I’ll be here when you need me :)";
    await post.sendMessage(chat_id, text);

};