const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

module.exports = async function sendTickets(chat_id, ticketBuffers) {
    for (let i = 0; i < ticketBuffers.length; i++) {
        fs.writeFileSync(`#asset/image/e_ticket/${chat_id}_${i}.png`, ticketBuffers[i]);
        let formData = new FormData();
        formData.append('chat_id', chat_id);
        formData.append('photo', fs.createReadStream(`#asset/image/e_ticket/${chat_id}_${i}.png`));
        await axios({
            method: 'post',
            url: process.env.TELEGRAM_ENDPOINT + '/sendPhoto',
            data: formData,
            headers: formData.getHeaders()
        })
            .then(res => {
                fs.unlinkSync(`#asset/image/e_ticket/${chat_id}_${i}.png`);
                console.log(`#asset/image/e_ticket/${chat_id}_${i}.png was deleted`);
            })
            .catch(err => console.log(JSON.stringify(err.response.data)));
    }
};