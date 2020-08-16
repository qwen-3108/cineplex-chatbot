const { NO_RESULT_REASON, INLINE_KEYBOARD } = require('../../@global/CONSTANTS');
const makeDetailsStr = require('../../@util/makeDetailsStr');
const makeInlineQueryInput = require('../../@util/makeInlineQueryInput');
const post = require('../post');

module.exports = async function noResult(chat_id, bookingInfo, noResultReason, alternativeBookingInfo) {

    const suggestionStr = 'But we do have tickets for these showtimes. Does any of these work for you? If not, you can edit the input field to explore other options! :)';

    let text = '';
    let replyMarkup;
    let responseCodeforTesting;

    switch (noResultReason) {
        case NO_RESULT_REASON.NO_SLOT:
            text = `I'm afraid we don't have showtime ${makeDetailsStr(bookingInfo)}. ${suggestionStr}`;
            replyMarkup = {
                inline_keyboard: [[
                    {
                        text: `Showtimes · ${bookingInfo.movie.title}`,
                        switch_inline_query_current_chat: makeInlineQueryInput(alternativeBookingInfo)
                    }]]
            };
            responseCodeforTesting = 'noSlot';
            break;
        case NO_RESULT_REASON.SOLD_OUT:
            text = `Unfortunately tickets ${makeDetailsStr(bookingInfo)} are sold out. ${suggestionStr}`;
            replyMarkup = {
                inline_keyboard: [[
                    {
                        text: `Showtimes · ${bookingInfo.movie.title}`,
                        switch_inline_query_current_chat: makeInlineQueryInput(alternativeBookingInfo)
                    }]]
            };
            responseCodeforTesting = 'soldOut';
            break;
        case NO_RESULT_REASON.ALL_SOLD_OUT:
            text = `Sorry, it seems like all showtimes for ${bookingInfo.movie.title} are fully booked. New showtimes will be released on Wednesday, Thursday and Friday afternoon. Do check back if you are still interested. Meanwhile, let me know if there is anything else I can help :)`;
            replyMarkup = { inline_keyboard: [[INLINE_KEYBOARD.MOVIE]] };
            responseCodeforTesting = 'allSoldOut';
            break;
        default:
            throw `${__filename} | Unrecognized no result reason during slot filling ${noResultReason}`;
    }

    await post.sendMessage(chat_id, text, { replyMarkup });
    return responseCodeforTesting;

}