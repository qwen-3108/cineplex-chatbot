const axios = require('axios');

module.exports = async function answerInlineQuery(inlineQueryId, inlineQueryResult, nextOffset) {

    const config = {
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/answerInlineQuery',
        data: {
            inline_query_id: inlineQueryId,
            results: inlineQueryResult,
            next_offset: nextOffset
        }
    };
    return await axios(config);

}