const post = require('../post');

module.exports = async function getDayWithinSchedule(chat_id) {

    await post.sendMessage(chat_id, "Cool. May I know which day?");

}