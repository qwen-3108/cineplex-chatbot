const FormData = require('form-data');
const axios = require('axios');

module.exports = async function sendPhoto(formData) {

    if (formData instanceof FormData) {

        const config = {
            method: 'post',
            url: process.env.TELEGRAM_ENDPOINT + '/sendPhoto',
            data: formData,
            headers: formData.getHeaders()
        }
        return await axios(config);

    } else {
        throw new Error("sendPhoto: formData parameter must be of type FormData");
    }

}