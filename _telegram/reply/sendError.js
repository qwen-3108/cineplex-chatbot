const sendMessage = require('../post/sendMessage');

module.exports = async function faqNowShowing(chat_id){

    const text = "Server error";
    await sendMessage(chat_id, text);

}
