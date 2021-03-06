const { INLINE_KEYBOARD } = require('../../../@global/CONSTANTS');
const post = require('../../../_telegram/post');

module.exports = async function nowShowing(chat_id) {

    const text = 'Here’s a list of all movies showing at our cinemas 😁 Tap the button to view 👇🏻';
    const replyMarkup = { inline_keyboard: [[INLINE_KEYBOARD.MOVIE]] };
    await post.sendMessage(chat_id, text, { replyMarkup });

}
