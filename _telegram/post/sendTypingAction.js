const axios = require('axios');

module.exports = async function typing(chatId) {

    const config = {
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/sendChatAction',
        data: {
            chat_id: chatId,
            action: 'typing'
        }
    };
    await axios(config);

}