const post = require('../post');

module.exports = async function finish(chat_id, seatNumbers) {

    const tixStr = seatNumbers.length > 1 ? 'tickets' : 'ticket';
    const codeStr = seatNumbers.length > 1 ? 'codes' : 'code';

    const text = `Thanks. Here are your ${tixStr}. Please scan the QR ${codeStr} at the entrace to enter. Have a pleasant time :)`;
    await post.sendMessage(chat_id, text);

}