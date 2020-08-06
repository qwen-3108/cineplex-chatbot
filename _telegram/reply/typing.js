const sendTypingAction = require('../post/sendTypingAction');

module.exports = async function typing(chat_id) {
    await sendTypingAction(chat_id);
}