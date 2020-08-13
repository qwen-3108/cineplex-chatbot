const post = require('../post');
const decideMaxDatePhrase = require('../../@util/decideMaxDatePhrase');

module.exports = async function invalidDateTime(chat_id, isTotal, maxDate) {

    let text;
    let responseCodeForTesting;
    if (isTotal) {
        text = `😅 Our movie schedules are only updated until ${decideMaxDatePhrase(maxDate)}. Does any day before this works?`;
        responseCodeForTesting = 'totalExceed';
    } else {
        text = `Okay. But showtimes are only updated until ${decideMaxDatePhrase(maxDate)}. So I’ll get back to you on showtimes before that?`;
        responseCodeForTesting = 'partialExceed';
    }

    await post.sendMessage(chat_id, text);
    return responseCodeForTesting;

}