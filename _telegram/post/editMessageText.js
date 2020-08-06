const axios = require('axios');

module.exports = async function editMessageText(inlineMessageId, text, {parseMode, replyMarkup, disableWebPagePreview}) {

    const data = {inline_message_id: inlineMessageId, text: text};

    if(parseMode !== undefined){
        data['parse_mode'] = parseMode;
    }
    if(replyMarkup !== undefined){
        data['reply_markup'] = replyMarkup;
    }
    if(disableWebPagePreview !== undefined){
        data['disable_web_page_preview'] = disableWebPagePreview;
    }

    const config = {
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/editMessageText',
        data: data
    };

    await axios(config);

}