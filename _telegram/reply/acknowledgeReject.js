const post = require('../post');

module.exports = async function askForMoreInfo(chat_id) {

    const text = "Okay sure. ";
    await post.sendMessage(chat_id, text);

}