const axios = require('axios');

module.exports = async function answerPreCheckoutQuery(preCheckoutQueryId) {

    const config = {
        url: process.env.TELEGRAM_ENDPOINT + '/answerPreCheckoutQuery',
        method: 'post',
        data: {
            pre_checkout_query_id: preCheckoutQueryId,
            ok: true
        }
    };

    await axios(config);

}