const sendMessage = require('../post/sendMessage');

module.exports = async function askForMoreInfo(chat_id) {

    const text = "Perhaps I get it wrongly. Could you please say it again? ";
    await sendMessage(chat_id, text);

}