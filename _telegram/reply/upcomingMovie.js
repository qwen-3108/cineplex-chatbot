const axios = require('axios');
const { format } = require('date-fns');
const { TELEGRAM, INLINE_KEYBOARD } = require('../../@global/CONSTANTS');

module.exports = async function upcomingMovie(chat_id, upcomingMovieInfo) {

    const { title, debutDateTime } = upcomingMovieInfo;
    const config = {
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/sendMessage',
        data: {
            chat_id,
            text: `${title} will be released on ${format(debutDateTime, 'd MMMM (E)')} and tickets will be available for sales from ${format(new Date('2020-08-24'), 'd MMMM (E)')}. Be sure to check back again! :) Meanwhile, is there anything I can help?`,
            reply_markup: { inline_keyboard: [[INLINE_KEYBOARD.MOVIE]] }
        }
    };
    await axios(config);

}