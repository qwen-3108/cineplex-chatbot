const axios = require('axios');
const { logConv } = require('../../@global/LOGS');

module.exports = async function sendMessage(chat_id, text, extraData) {

    logConv(chat_id, `response: ${text}`);

    const data = { chat_id: chat_id, text: text };
    if (extraData !== undefined) {
        if (extraData.parseMode !== undefined) {
            data['parse_mode'] = extraData.parseMode;
        }
        if (extraData.replyMarkup !== undefined) {
            data['reply_markup'] = extraData.replyMarkup;
        }
    }
    const config = {
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/sendMessage',
        data: data
    }
    return await axios(config);

}