const axios = require('axios');
const { TELEGRAM, INLINE_KEYBOARD } = require('../../@global/CONSTANTS');
const Phrases = require('../../@global/PHRASES');

module.exports = { welcome, cancel, end };

async function welcome(chat_id) {
    axios({
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/sendMessage',
        data: {
            chat_id,
            text: Phrases.GREETING() + 'Just so you know, you can talk to me like you would to a box office clerk 👩🏻‍💻 How may I help you?',
            reply_markup: { inline_keyboard: [[INLINE_KEYBOARD.MOVIE]] }
        }
    }).catch(err => console.log(JSON.stringify(err.response.data)));
}

async function cancel(chat_id) {
    axios({
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/sendMessage',
        data: {
            chat_id,
            text: Phrases.CANCEL()
        }
    }).catch(err => console.log(JSON.stringify(err.response.data)));
}

async function end(chat_id) {
    axios({
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/sendMessage',
        data: {
            chat_id,
            text: Phrases.END()
        }
    }).catch(err => console.log(JSON.stringify(err.response.data)));
}