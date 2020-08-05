const axios = require('axios');

module.exports = async function alertMultipleShowtimes(chat_id) {

    const config = {
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/sendMessage',
        data: {
            chat_id,
            text: `It seems like you've viewed multiple seating plans. Could you use the 'Choose seats' button to let me know which is your final choice? Thanks :)`
        }
    }
    await axios(config);

}