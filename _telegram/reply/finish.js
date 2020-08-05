const axios = require('axios');

module.exports = async function finish(chat_id, seatNumbers) {

    const tixStr = seatNumbers.length > 1 ? 'tickets' : 'ticket';
    const codeStr = seatNumbers.length > 1 ? 'codes' : 'code';

    await axios({
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/sendMessage',
        data: {
            chat_id,
            text: `Thanks. Here are your ${tixStr}. Please scan the QR ${codeStr} at the entrace to enter. Have a pleasant time :)`
        }
    });
}