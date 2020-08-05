const axios = require('axios');

module.exports = async function deleteRepeatSeatPlan(chat_id, message_id) {

    const config = {
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/deleteMessage',
        data: { chat_id, message_id }
    }
    await axios(config);
}
