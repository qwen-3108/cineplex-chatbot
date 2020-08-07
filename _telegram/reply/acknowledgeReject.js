const sendMessage = require('../post/sendMessage');

module.exports = async function askForMoreInfo(chat_id) {

    const text = "Okay sure. ";
    await sendMessage(chat_id, text);

}