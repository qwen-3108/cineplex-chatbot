const post = require('../post');

module.exports = async function deleteRepeatSeatPlan(chat_id, message_id) {

    await post.deleteMessage(chat_id, message_id);

}
