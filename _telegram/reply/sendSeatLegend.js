const axios = require('axios');
const Phrases = require('../../@global/PHRASES');

module.exports = async function sendSeatLegend(chat_id) {

    const config = {
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/sendMessage',
        data: {
            chat_id,
            text: Phrases.POSITIVE() + "Here's the seating plan. The red seats are taken, the orange are reserved and the green are available. Please tell me the seat numbers you prefer\n‼️ The plan updates real-time. Please reply asap to secure your seats"
        }
    }
    axios(config).catch(err => console.log(JSON.stringify(err.response.data)));

};