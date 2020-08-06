const axios = require('axios');

module.exports = async function editMessageText(inlineMessageId, text, extraData) {

    const data = { inline_message_id: inlineMessageId, text: text };

    if (extraData !== undefined) {
        if (extraData.parseMode !== undefined) {
            data['parse_mode'] = extraData.parseMode;
        }
        if (extraData.replyMarkup !== undefined) {
            data['reply_markup'] = extraData.replyMarkup;
        }
        if (extraData.disableWebPagePreview !== undefined) {
            data['disable_web_page_preview'] = extraData.disableWebPagePreview;
        }
    }

    const config = {
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/editMessageText',
        data: data
    };

    return await axios(config);

}