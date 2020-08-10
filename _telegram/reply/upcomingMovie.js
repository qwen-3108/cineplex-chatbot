const { format } = require('date-fns');
const { INLINE_KEYBOARD } = require('../../@global/CONSTANTS');
const post = require('../post');

module.exports = async function upcomingMovie(chat_id, upcomingMovieInfo) {

    const { title, debutDateTime } = upcomingMovieInfo;
    const text = `${title} will be released on ${format(debutDateTime, 'd MMMM (E)')} and tickets will be available for sales from ${format(new Date('2020-08-24'), 'd MMMM (E)')}. Be sure to check back again! :) Meanwhile, is there anything I can help?`;
    const replyMarkup = { inline_keyboard: [[INLINE_KEYBOARD.MOVIE]] };
    await post.sendMessage(chat_id, text, { replyMarkup });

}