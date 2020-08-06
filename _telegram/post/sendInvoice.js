const axios = require('axios');

module.exports = async function sendInvoice(chatId, invoice, {photoUrl}) {

    const config = {
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/sendInvoice',
        data: {
            chat_id: chatId,
            provider_token: process.env.STRIPE_TOKEN,
            start_parameter: '123',
            payload: '.',
            currency: 'SGD',
            photo_url: photoUrl,
            need_name: true,
            need_phone_number: true,
            ...invoice
        }
    };
    await axios(config);

}