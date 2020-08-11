const post = require('../post');

module.exports = async function askForMoreInfo(chat_id, fineTunedText) {

    let text = '';
    if (fineTunedText === undefined) {
        text = "Oooh. Seems like I get it wrongly. Could you kindly tell me what should I change? ";
    } else {
        text = fineTunedText;
    }

    await post.sendMessage(chat_id, text);

}