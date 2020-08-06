const axiosAnswerPreCheckoutQuery = require('../post/answerPreCheckoutQuery');

module.exports = async function answerPreCheckoutQuery(pre_checkout_query_id) {

    console.log('IN respondToTelegram.answerPreCheckoutQuery OF pre_checkout_query_id: ', pre_checkout_query_id);
    await axiosAnswerPreCheckoutQuery(pre_checkout_query_id);

}