const LOGS = require('../../../../../@global/LOGS');
const reply = require('../../../../../_telegram/reply');
const post = require('../../../../../_telegram/post');
const { checkAvailable } = require('../../../../../_database/query');
const makeInlineQueryInput = require('../../../../../@util/makeInlineQueryInput');
const PHRASES = require('../../../../../@global/PHRASES');
const makeDetailsStr = require('../../../../../@util/makeDetailsStr');

module.exports = async function translateShowtimes({ text, sessionToMutate }) {
    const { chatId, bookingInfo } = sessionToMutate;
    LOGS.logInfo(chatId, 'product query received, translating showtimes into inline query for user');
    const { available, noResultReason, alternativeBookingInfo } = await checkAvailable(bookingInfo);
    if (!available) {
        sessionToMutate.status = { main: null, secondary: null };
        await reply.noResult(chatId, bookingInfo, noResultReason, alternativeBookingInfo);
        return;
    }

    const replyPhraseBank = [
        `Here are the showtimes ${makeDetailsStr(bookingInfo)}. `,
        `We have the following showtimes ${makeDetailsStr(bookingInfo)}. `,
        `These showtimes are available ${makeDetailsStr(bookingInfo)}`
    ];
    const replyText = PHRASES.ACKNOWLEDGEMENT(text) + replyPhraseBank[Math.floor(Math.random() * (replyPhraseBank.length - 1))] + PHRASES.PREFERENCE();
    const replyMarkup = {
        inline_keyboard: [
            [{ text: `Showtimes · ${bookingInfo.movie.title}`, switch_inline_query_current_chat: makeInlineQueryInput(bookingInfo) }]
        ]
    }
    await post.sendMessage(chatId, replyText, { replyMarkup });

} 