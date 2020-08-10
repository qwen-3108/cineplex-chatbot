const { NO_RESULT_REASON, INLINE_KEYBOARD } = require('../../@global/CONSTANTS');
const makeDateTimePhrase = require('../../@util/makeDateTimePhrase');
const makeInlineQueryInput = require('../../@util/makeInlineQueryInput');
const post = require('../post');

module.exports = async function noResult(chat_id, bookingInfo, noResultReason, alternativeQuery) {

    const { movie, dateTime } = bookingInfo;
    const movieStr = movie.title + ' ';

    let locationStr = '';
    if (bookingInfo.cinema !== undefined) {
        locationStr = `at ${bookingInfo.cinema}`;
    } else if (bookingInfo.place !== undefined) {
        locationStr = `near ${bookingInfo.place}`;
    }

    let dateTimeStr = '';
    if (dateTime !== undefined) {
        dateTimeStr = makeDateTimePhrase(dateTime) + ' ';
    }

    const suggestionStr = 'But we do have tickets for these showtimes. Does any of them work for you?(If not, feel free to edit the input field to explore other options)';

    let text = '';
    let replyMarkup;
    switch (noResultReason) {
        case NO_RESULT_REASON.NO_SLOT:
            text = `I'm afraid we don't have showtime for ${movieStr}${dateTimeStr}${locationStr}. ${suggestionStr}`;
            replyMarkup = {
                inline_keyboard: [[
                    {
                        text: `Showtimes · ${movie.title}`,
                        switch_inline_query_current_chat: makeInlineQueryInput(alternativeQuery, bookingInfo)
                    }]]
            };
            break;
        case NO_RESULT_REASON.SOLD_OUT:
            text = `Unfortunately tickets for ${movieStr}${dateTimeStr}${locationStr} are sold out. ${suggestionStr}`;
            replyMarkup = {
                inline_keyboard: [[
                    {
                        text: `Showtimes · ${movie.title}`,
                        switch_inline_query_current_chat: makeInlineQueryInput(alternativeQuery, bookingInfo)
                    }]]
            };
            break;
        case NO_RESULT_REASON.ALL_SOLD_OUT:
            text = `Sorry, it seems like all showtimes for ${movie.title} are fully booked. New showtimes will be released on Wednesday, Thursday and Friday afternoon. Do check back if you are still interested. Meanwhile, let me know if there is anything else I can help :)`;
            replyMarkup = { inline_keyboard: [[INLINE_KEYBOARD.MOVIE]] };
            break;
        default:
            throw `${__filename} | Unrecognized no result reason during slot filling ${noResultReason}`;
    }

    await post.sendMessage(chat_id, text, { replyMarkup });

}