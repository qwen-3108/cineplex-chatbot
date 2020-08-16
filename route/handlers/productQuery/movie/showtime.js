const validateAndMutateInfo = require('../../service/book/helpers/validateAndMutateInfo');
const translateShowtimes = require('./helpers/translateShowtimes');
const reply = require('../../../../_telegram/reply');
const post = require('../../../../_telegram/post');
const LOGS = require('../../../../@global/LOGS');
const { INTENT, MAIN_STATUS } = require('../../../../@global/CONSTANTS');
const makeDetailsStr = require('../../../../@util/makeDetailsStr');
const makeInlineQueryInput = require('../../../../@util/makeInlineQueryInput');
const SHOWTIME = INTENT.PRODUCT_QUERY.MOVIE.SHOWTIME;

module.exports = async function showtime({ text, intentArr, extractedInfo, sessionToMutate }) {

    //um.. okay, what's the showtimes of tenet?
    LOGS.logInfo(sessionToMutate.chatId, '-----showtime triggered-----');
    LOGS.logInfo(sessionToMutate.chatId, `showtime subintent: ${intentArr[3]}`);

    switch (intentArr[3]) {
        case undefined:
            {
                const { ok } = await validateAndMutateInfo({ extractedInfo, sessionToMutate });
                if (ok) {
                    const { chatId, bookingInfo } = sessionToMutate;
                    if (bookingInfo.movie.id === null) {
                        throw `No movie in bookingInfo, should not match productQuery.movie.showtime intent`;
                    }
                    if (bookingInfo.dateTime.start === null) {
                        LOGS.logInfo(chatId, 'search range too wide, attempt to narrow by asking user follow up questions');
                        sessionToMutate.status.main = MAIN_STATUS.NARROW_SEARCH;
                        await reply.narrowSearch(chatId, bookingInfo);
                    } else {
                        LOGS.logInfo(chatId, 'reasonable search range, retrieving showtimes for user');
                        await translateShowtimes({ text, sessionToMutate });
                    }
                }
            }
            break;
        case SHOWTIME.ANY.SELF:
            {
                LOGS.logInfo('user request all showtimes');
                const { chatId, bookingInfo } = sessionToMutate;
                const reply = `Okay. Here are all the showtimes ${makeDetailsStr(bookingInfo)}. You can type in time/place as you view to filter the showtimes. I'll be back when you've made your choice :)`
                const replyMarkup = {
                    inline_keyboard: [
                        [{ text: `Showtimes · ${bookingInfo.movie.title}`, switch_inline_query_current_chat: makeInlineQueryInput(bookingInfo) }]
                    ]
                };
                await post.sendMessage(chatId, reply, { replyMarkup });
            }
            break;
        default:
            throw `Unrecognized product query sub intent ${intentArr[3]}`;
    }

}