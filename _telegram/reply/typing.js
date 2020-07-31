const axios = require('axios');

module.exports = async function typing(chat_id) {
    axios({
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/sendChatAction',
        data: {
            chat_id,
            action: 'typing'
        }
    }).catch(err => console.log(JSON.stringify(err.response.data)));
}