const sendMessage = require('../post/sendMessage');

module.exports = async function getDayWithinSchedule(chat_id) {

    await sendMessage(chat_id, "Cool. May I know which day?");

}