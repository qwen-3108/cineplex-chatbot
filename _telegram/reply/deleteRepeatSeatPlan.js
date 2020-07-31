const axios = require('axios');

module.exports = async function deleteRepeatSeatPlan(chat_id, message_id) {

    const config = {
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/deleteMessage',
        data: { chat_id, message_id }
    }
    axios(config).catch(err => console.log(JSON.stringify(err.response.data)));
}
