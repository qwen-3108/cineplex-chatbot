const post = require('../post');
const axiosErrorCallback = require('../axiosErrorCallback');

module.exports = async function deleteRepeatSeatPlan(chat_id, message_id) {
    try {
        await post.deleteMessage(chat_id, message_id);
    } catch{
        axiosErrorCallback(chat_id, err);
    }

}
