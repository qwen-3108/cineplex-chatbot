const { INLINE_KEYBOARD } = require('../../@global/CONSTANTS');
const Phrases = require('../../@global/PHRASES');
const post = require('../post');

module.exports = { welcome, cancel, end };

async function welcome(chat_id) {

    const text = Phrases.GREETING() + "How may I help you? 👩🏻‍💻 You may tap the button below to view all now showing movies, or simply tell me the movie you have in mind";
    const replyMarkup = { inline_keyboard: [[INLINE_KEYBOARD.MOVIE]] };
    await post.sendMessage(chat_id, text, { replyMarkup });
}

async function cancel(chat_id, text) {

    const message = Phrases.CANCEL(text);
    await post.sendMessage(chat_id, message);

}

async function end(chat_id, text) {

    const message = Phrases.END(text);
    await post.sendMessage(chat_id, message);

}