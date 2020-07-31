const axios = require('axios');

module.exports = async function answerPreCheckoutQuery(pre_checkout_query_id) {
    console.log('IN respondToTelegram.answerPreCheckoutQuery OF pre_checkout_query_id: ', pre_checkout_query_id);
    axios({
        url: process.env.TELEGRAM_ENDPOINT + '/answerPreCheckoutQuery',
        method: 'post',
        data: {
            pre_checkout_query_id,
            ok: true
        }
    })
        .catch(err => console.log(JSON.stringify(err.response.data)));
}