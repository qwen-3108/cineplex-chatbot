const fs = require('fs');
const FormData = require('form-data');
const sendPhoto = require('../post/sendPhoto');

module.exports = async function sendTickets(chat_id, ticketBuffers) {
    for (let i = 0; i < ticketBuffers.length; i++) {
        fs.writeFileSync(`#asset/image/e_ticket/${chat_id}_${i}.png`, ticketBuffers[i]);
        let formData = new FormData();
        formData.append('chat_id', chat_id);
        formData.append('photo', fs.createReadStream(`#asset/image/e_ticket/${chat_id}_${i}.png`));
        await sendPhoto(formData)
            .then(res => {
                fs.unlinkSync(`#asset/image/e_ticket/${chat_id}_${i}.png`);
                console.log(`#asset/image/e_ticket/${chat_id}_${i}.png was deleted`);
            })
    }
};