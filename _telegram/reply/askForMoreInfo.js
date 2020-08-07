const sendMessage = require('../post/sendMessage');

module.exports = async function askForMoreInfo(chat_id) {

    const text = "Oooh. Seems like I get it wrongly. Could you kindly tell me what should I change? ";
    await sendMessage(chat_id, text);

}