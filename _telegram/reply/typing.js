const post = require('../post');

module.exports = async function typing(chat_id) {
    await post.sendTypingAction(chat_id);
}