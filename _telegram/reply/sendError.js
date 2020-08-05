const axios = require('axios');

module.exports = async function faqNowShowing(chat_id){
    const config = {
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/sendMessage',
        data: {
            chat_id,
            text: 'Server error',
        }
    };
    await axios(config);
}
