const post = require("../../../../_telegram/post");

module.exports = async function cancelBooking(chatId) {

    const text = 'Unfortunately all tickets purchased are non-cancellable and non-refundable. Thank you for your kind understanding';
    await post.sendMessage(chatId, text);

}