const { INLINE_KEYBOARD } = require('../../../../@global/CONSTANTS');
const post = require("../../../../_telegram/post");

module.exports = async function advanceBooking(chatId) {

    const text = 'One week in advance. Any movie you’d like me to check now? :)';
    const replyMarkup = { inline_keyboard: [[INLINE_KEYBOARD.MOVIE]] };
    await post.sendMessage(chatId, text, { replyMarkup });

}