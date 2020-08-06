const deleteMessage = require('../post/deleteMessage');

module.exports = async function deleteRepeatSeatPlan(chat_id, message_id) {

    await deleteMessage(chat_id, message_id);

}
