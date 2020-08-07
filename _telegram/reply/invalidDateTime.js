const { format, differenceInHours, addDays } = require('date-fns');
const Phrases = require('../../@global/PHRASES');
const makeDateTimePhrase = require('../../@util/makeDateTimePhrase');
const sendMessage = require('../post/sendMessage');
const decideMaxDate = require('../../@util/decideMaxDate');

module.exports = async function invalidDateTime(chat_id, isTotal, maxDate) {

    const text = isTotal
        ? `😅 Our movie schedules are only updated until ${decideMaxDate.phrase(maxDate)}. Does any day before this works?`
        : `Okay. But showtimes are only updated until ${decideMaxDate.phrase(maxDate)}. So I’ll get back to you on showtimes before that?`;

    await sendMessage(chat_id, text);

}