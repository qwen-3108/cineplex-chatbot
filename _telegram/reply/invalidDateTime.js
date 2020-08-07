const { format, differenceInHours, addDays } = require('date-fns');
const Phrases = require('../../@global/PHRASES');
const makeDateTimePhrase = require('../../@util/makeDateTimePhrase');
const sendMessage = require('../post/sendMessage');

module.exports = async function invalidDateTime(chat_id, adjustedDateTime, maxTimePhrase) {

    const { start, end: max } = adjustedDateTime;

    let maxStr;
    let dateTimeStr;
    if (differenceInHours(max, start) > 24) {
        const startStart = new Date(start); startStart.setHours(0);
        const startEnd = new Date(start); startEnd.setHours(23);
        dateTimeStr = `from ${makeDateTimePhrase({ start: startStart, end: startEnd })} to ${maxTimePhrase}`;
        maxStr = `after ${format(max, 'd MMMM (E)')}`;
    } else {
        //use case: On Sunday, user query for showtime 'this weekend' > start = max = sat
        dateTimeStr = makeDateTimePhrase(adjustedDateTime);
        maxStr = `past ${format(max, 'EEEE')} midnight and after`;
    }

    const text = `Showtimes ${maxStr} are not available yet. But I can get back to you on showtimes ${dateTimeStr}. ` + Phrases.SUGGEST_ALTERNATIVE_ACTIONS();
    await sendMessage(chat_id, text);

}