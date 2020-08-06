const { INLINE_KEYBOARD } = require('../../../../../@global/CONSTANTS');
const sendMessage = require("../../../../../_telegram/post/sendMessage");

module.exports = async function showtimeUpdating(chatId){
    
    const text = 'Showtimes are usually released one week before the actual showtime. Any movie you’d like me to check now?';
    const replyMarkup = { inline_keyboard: [[INLINE_KEYBOARD.MOVIE]] };
    await sendMessage(chatId, text, {replyMarkup});

}