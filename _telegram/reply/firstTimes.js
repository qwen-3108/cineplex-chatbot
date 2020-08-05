const axios = require('axios');
const Phrases = require('../../@global/PHRASES');

module.exports = { movieCard, showtimeCard };

async function movieCard(chat_id) {

    const config = {
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/sendMessage',
        data: {
            chat_id,
            text: Phrases.POSITIVE() + "Feel free to browse as many movies as you want. When you wish to check the showtimes of a movie, simply tap the 'Showtime' button for instructions :) I'll be here when you need me"
        }
    }
    await axios(config);

}

async function showtimeCard(chat_id) {

    const config = {
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/sendMessage',
        data: {
            chat_id,
            text: Phrases.ACKNOWLEDGEMENT("") + "Now you may use the ‘Back to List’ and ‘Seating Plan’ buttons to compare as many showtimes and seating plans as you’d like. I’ll be here when you need me :)"
        }
    }
    await axios(config);

}