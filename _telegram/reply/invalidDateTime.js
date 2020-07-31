const axios = require('axios');
const { format, differenceInHours, addDays } = require('date-fns');
const Phrases = require('../../@global/PHRASES');
const makeDateTimePhrase = require('../../@util/makeDateTimePhrase');

module.exports = async function invalidDateTime(chat_id, adjustedDateTime) {

    const { start, end: max } = adjustedDateTime;

    let maxStr;
    let dateTimeStr;
    if (differenceInHours(max, start) > 24) {
        const startStart = new Date(start); startStart.setHours(0);
        const startEnd = new Date(start); startEnd.setHours(23);
        dateTimeStr = `from ${makeDateTimePhrase({ start: startStart, end: startEnd })} to ${format(max, 'd MMMM')}`;
        maxStr = `after ${format(max, 'd MMMM (E)')}`;
    } else {
        dateTimeStr = makeDateTimePhrase(adjustedDateTime);
        maxStr = `past ${format(max, 'EEEE')} midnight and after`;
    }

    const config = {
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/sendMessage',
        data: {
            chat_id,
            text: `Showtimes ${maxStr} are not available yet. But I can get back to you on showtimes ${dateTimeStr}. ` + Phrases.SUGGEST_ALTERNATIVE_ACTIONS()
        }
    };

    axios(config).catch(err => console.log(JSON.stringify(err.response.data)));
}