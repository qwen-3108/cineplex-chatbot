const axios = require('axios');
const Phrases = require('../../@global/PHRASES');

module.exports = async function getEditSeats(chat_id) {
    const config = {
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/sendMessage',
        data: {
            chat_id,
            text: Phrases.POSITIVE() + 'May I have the seat numbers?'
        }
    }
    axios(config).catch(err => console.log(JSON.stringify(err.response.data)));
}