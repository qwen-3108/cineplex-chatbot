const { INLINE_KEYBOARD } = require('../../@global/CONSTANTS');
const Phrases = require('../../@global/PHRASES');
const sendMessage = require('../post/sendMessage');

module.exports = { welcome, cancel, end };

async function welcome(chat_id) {

    const text = Phrases.GREETING() + 'Just so you know, you can talk to me like you would to a box office clerk 👩🏻‍💻 How may I help you?';
    const replyMarkup = { inline_keyboard: [[INLINE_KEYBOARD.MOVIE]] };
    await sendMessage(chat_id, text, {replyMarkup});

}

async function cancel(chat_id) {

    await sendMessage(chat_id, Phrases.CANCEL());

}

async function end(chat_id) {

    await sendMessage(chat_id, Phrases.END());

}