const post = require('../post');

module.exports = async function acknowledgeReject(chat_id) {

    const text = "Okay sure. ";
    await post.sendMessage(chat_id, text);

}