const LOGS = require('../../../../../@global/LOGS');
const reply = require('../../../../../_telegram/reply');
const makeInlineQueryInput = require('../../../../../@util/makeInlineQueryInput');
const PHRASES = require('../../../../../@global/PHRASES');
const makeDetailsStr = require('../../../../../@util/makeDetailsStr');

module.exports = async function translateShowtimes({ text, sessionToMutate }) {
    const { chatId, bookingInfo } = sessionToMutate;
    LOGS.logInfo(chatId, 'product query received, translating showtimes into inline query for user');
    const { available, noResultReason, alternativeQuery } = await checkAvailable(bookingInfo);
    if (!available) {
        sessionToMutate.status = { main: null, secondary: null };
        await reply.noResult(chatId, bookingInfo, noResultReason, alternativeQuery);
        return;
    }

    const reply = PHRASES.ACKNOWLEDGEMENT(text) + `Here are the showtimes ${makeDetailsStr(bookingInfo)}. ` + PHRASES.PREFERENCE();
    const replyMarkup = {
        inline_keyboard: [
            [{ text: `Showtimes · ${bookingInfo.movie.title}`, switch_inline_query_current_chat: makeInlineQueryInput(bookingInfo) }]
        ]
    }
    await post.sendMessage(chatId, reply, { replyMarkup });

} 