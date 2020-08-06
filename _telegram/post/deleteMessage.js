const axios = require('axios');

module.exports = async function deleteMessage(chatId, messageId) {

    const config = {
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/deleteMessage',
        data: { 
            chat_id: chatId, 
            message_id: messageId
        }
    }
    await axios(config);

}