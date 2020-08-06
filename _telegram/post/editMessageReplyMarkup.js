const axios = require('axios');

module.exports = async function editMessageReplyMarkup(chatId, messageId, replyMarkup) {

    const config = {
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/editMessageReplyMarkup',
        data: {
            chat_id: chatId,
            message_id: messageId,
            reply_markup: replyMarkup
        }
    }
    return await axios(config);

}