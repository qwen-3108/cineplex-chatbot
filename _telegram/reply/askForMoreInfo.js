const post = require('../post');

module.exports = async function askForMoreInfo(chat_id) {

    const text = "Oooh. Seems like I get it wrongly. Could you kindly tell me what should I change? ";
    await post.sendMessage(chat_id, text);

}