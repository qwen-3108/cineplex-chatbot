const FormData = require('form-data');
const axios = require('axios');

module.exports = async function editMessageMedia(formData) {

    if (formData instanceof FormData) {

        const config = {
            method: 'post',
            url: process.env.TELEGRAM_ENDPOINT + '/editMessageMedia',
            data: formData,
            headers: formData.getHeaders()
        }
        return await axios(config);

    } else {
        throw new Error("edit message media: formData parameter must be of type FormData");
    }

}