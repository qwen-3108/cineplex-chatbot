const fs = require('fs');
const FormData = require('form-data');
const post = require('../post');
const axiosErrorCallback = require('../axiosErrorCallback');
const { logInfo } = require('../../@global/LOGS');

module.exports = async function sendTickets(chat_id, ticketBuffers) {
    for (let i = 0; i < ticketBuffers.length; i++) {
        fs.writeFileSync(`#asset/image/e_ticket/${chat_id}_${i}.png`, ticketBuffers[i]);
        let formData = new FormData();
        formData.append('chat_id', chat_id);
        formData.append('photo', fs.createReadStream(`#asset/image/e_ticket/${chat_id}_${i}.png`));
        try {
            await post.sendPhoto(formData);
            fs.unlinkSync(`#asset/image/e_ticket/${chat_id}_${i}.png`);
            logInfo(`#asset/image/e_ticket/${chat_id}_${i}.png was deleted`);

        } catch (err) {
            axiosErrorCallback(chat_id, err);

        }
    }
};