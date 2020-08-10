const post = require('../post');

module.exports = async function faqNowShowing(chat_id) {

    const text = "Server error 👾";
    await post.sendMessage(chat_id, text);

}
