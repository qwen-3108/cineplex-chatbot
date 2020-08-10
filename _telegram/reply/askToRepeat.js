const post = require('../post');

module.exports = async function askForMoreInfo(chat_id) {

    const text = "Perhaps I get it wrongly. Could you please say it again? ";
    await post.sendMessage(chat_id, text);

}