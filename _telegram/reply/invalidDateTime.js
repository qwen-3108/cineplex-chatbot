const post = require('../post');
const decideMaxDatePhrase = require('../../@util/decideMaxDatePhrase');

module.exports = async function invalidDateTime(chat_id, isTotal, maxDate) {

    const text = isTotal
        ? `😅 Our movie schedules are only updated until ${decideMaxDatePhrase(maxDate)}. Does any day before this works?`
        : `Okay. But showtimes are only updated until ${decideMaxDatePhrase(maxDate)}. So I’ll get back to you on showtimes before that?`;

    await post.sendMessage(chat_id, text);

}