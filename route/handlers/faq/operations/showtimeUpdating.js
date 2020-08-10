const { INLINE_KEYBOARD } = require('../../../../@global/CONSTANTS');
const post = require("../../../../_telegram/post");

module.exports = async function showtimeUpdating(chatId) {

    const text = 'Showtimes are usually released one week before the actual showtime. Any movie you’d like me to check now?';
    const replyMarkup = { inline_keyboard: [[INLINE_KEYBOARD.MOVIE]] };
    await post.sendMessage(chatId, text, { replyMarkup });

}