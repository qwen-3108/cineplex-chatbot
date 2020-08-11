const Phrases = require('../../@global/PHRASES');
const post = require('../post');

module.exports = async function movieCard(chat_id) {

    const text = Phrases.POSITIVE() + "Feel free to browse as many movies as you want. When you wish to check the showtimes of a movie, simply tap the 'Showtime' button for instructions :) I'll be here when you need me";
    await post.sendMessage(chat_id, text);

}