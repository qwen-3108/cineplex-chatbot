const { INLINE_KEYBOARD } = require('../../@global/CONSTANTS');
const Phrases = require('../../@global/PHRASES');
const post = require('../post');

module.exports = { welcome, cancel, end };

async function welcome(chat_id) {

    const text = Phrases.GREETING() + "How may I help you? 👩🏻‍💻 You may tap the button below to view all now showing movies, or simply tell me which movie you'd like to watch if you already have one in mind";
    const replyMarkup = { inline_keyboard: [[INLINE_KEYBOARD.MOVIE]] };
    await post.sendMessage(chat_id, text, { replyMarkup });
}

async function cancel(chat_id) {

    await post.sendMessage(chat_id, Phrases.CANCEL());

}

async function end(chat_id) {

    await post.sendMessage(chat_id, Phrases.END());

}