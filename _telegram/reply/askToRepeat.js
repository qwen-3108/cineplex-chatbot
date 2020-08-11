const post = require('../post');

module.exports = async function askForMoreInfo(chat_id, fineTunedText) {

    let text = '';
    if (fineTunedText === undefined) {
        text = "Perhaps I get it wrongly. Could you please say it again? ";
    } else {
        text = fineTunedText;
    }

    await post.sendMessage(chat_id, text);

}