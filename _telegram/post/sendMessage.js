const axios = require('axios');

module.exports = async function sendMessage(chat_id, text, {parseMode, replyMarkup}) {

    const data = {chat_id: chat_id, text: text};
    if(parseMode !== undefined){
        data['parse_mode'] = parseMode;
    }
    if(replyMarkup !== undefined){
        data['reply_markup'] = replyMarkup;
    }

    const config = {
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/sendMessage',
        data: data
    }
    await axios(config);

}