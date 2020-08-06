const sendMessage = require("../../../../../_telegram/post/sendMessage");

module.exports = async function cancelBooking(chatId){
    
    const text = 'Unfortunately all tickets purchased are non-cancellable and non-refundable. Thank you for your kind understanding';
    await sendMessage(chatId, text);

}