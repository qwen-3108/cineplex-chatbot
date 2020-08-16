const { MAIN_STATUS, SEC_STATUS } = require('../../../../../@global/CONSTANTS');
const LOGS = require('../../../../../@global/LOGS');
const reply = require('../../../../../_telegram/reply');
const { checkAvailable, getShowtimes, getCinemas, cache } = require('../../../../../_database/query');
const makeInlineQueryResult = require('../../../../../@util/makeInlineQueryResult');
const decideMaxDate = require('../../../../../@util/decideMaxDate');

module.exports = async function slotFilling({ text, sessionToMutate }) {

    LOGS.logInfo(sessionToMutate.chatId, '-----slot filling-----');
    const { movie, cinema, place, dateTime } = sessionToMutate.bookingInfo;

    //decide status
    if (movie.title === null) {
        sessionToMutate.status = { main: MAIN_STATUS.PROMPT_MOVIE, secondary: null };
    } else if (dateTime.start === null) {
        sessionToMutate.status = { main: MAIN_STATUS.PROMPT_DATETIME, secondary: null };
    } else if (cinema.length === 0 && place === null) {
        sessionToMutate.status = { main: MAIN_STATUS.GET_CINEMA, secondary: null };
    } else if (cinema.length === 0) {
        sessionToMutate.status = { main: MAIN_STATUS.GET_CINEMA_TIME_EXP, secondary: null };
    } else if (dateTime.start.getHours() !== dateTime.end.getHours()) {
        sessionToMutate.status = { main: MAIN_STATUS.GET_TIME_EXP, secondary: null };
    } else {
        sessionToMutate.status = { main: MAIN_STATUS.CONFIRM_PROCEED, secondary: null };
    }
    LOGS.logInfo(sessionToMutate.chatId, `Evaluated status: ${JSON.stringify(sessionToMutate.status)}`);

    const { chatId, status, bookingInfo } = sessionToMutate;

    //take appropriate action
    if (status.main === MAIN_STATUS.PROMPT_MOVIE) {
        await reply.fillSlot.getMovie(chatId, text);
    } else {

        switch (status.main) {
            case MAIN_STATUS.PROMPT_DATETIME:
                {
                    LOGS.logInfo(chatId, '-----Prepare to get date time-----');
                    const { available, noResultReason, alternativeBookingInfo } = await checkAvailable(bookingInfo);
                    if (!available) {
                        sessionToMutate.status = { main: null, secondary: null };
                        await reply.noResult(chatId, bookingInfo, noResultReason, alternativeBookingInfo);
                        return;
                    }
                    await reply.fillSlot.getDateTime(chatId, text, decideMaxDate(sessionToMutate.sessionInfo.startedAt));
                    break;
                }
            case MAIN_STATUS.GET_CINEMA:
                {
                    LOGS.logInfo(chatId, '-----Prepare to get cinema-----');
                    const { success, showtimes, noResultReason, alternativeBookingInfo } = await getShowtimes(bookingInfo, { projection: { cinema: 1 } });
                    if (!success) {
                        sessionToMutate.status = { main: null, secondary: null };
                        await reply.noResult(chatId, bookingInfo, noResultReason, alternativeBookingInfo);
                        return;
                    }
                    const cinemaSet = new Set(showtimes.map(showtime => showtime.cinema));
                    const cinemaList = Array.from(cinemaSet);
                    const cinemaArr = await getCinemas(cinemaList);
                    const cacheId = new Date().getTime().toString() + chatId;
                    LOGS.logInfo(chatId, `Generated id for caching cinemas result: ${cacheId}`);
                    const cacheIdentifier = 'unique result ❤️ ' + cacheId;
                    const inlineQueryResult = makeInlineQueryResult.cinema(cinemaArr);
                    await cache.inlineQueryResult(cacheId, inlineQueryResult);
                    await reply.fillSlot.getCinema(chatId, text, bookingInfo, cacheIdentifier);
                    break;
                }
            case MAIN_STATUS.GET_CINEMA_TIME_EXP:
            case MAIN_STATUS.GET_TIME_EXP:
                {
                    LOGS.logInfo(chatId, '-----Prepare to get exact showtime-----');
                    const { success, showtimes, noResultReason, alternativeBookingInfo } = await getShowtimes(bookingInfo, { projection: {} });
                    if (!success) {
                        sessionToMutate.status = { main: null, secondary: null };
                        await reply.noResult(chatId, bookingInfo, noResultReason, alternativeBookingInfo);
                        return;
                    }
                    const cacheId = new Date().getTime().toString() + chatId;
                    LOGS.logInfo(chatId, `Generated id for caching showtimes result: ${cacheId}`);
                    const cacheIdentifier = 'unique result ❤️ ' + cacheId;
                    const inlineQueryResult = makeInlineQueryResult.showtime(showtimes, bookingInfo, cacheIdentifier);
                    await cache.inlineQueryResult(cacheId, inlineQueryResult);
                    await reply.fillSlot.getExactSlot(chatId, text, bookingInfo, cacheIdentifier);
                    break;
                }
            case MAIN_STATUS.CONFIRM_PROCEED:
                {
                    LOGS.logInfo(chatId, '-----Prepare to get final confirmation-----')
                    const { success, showtimes, noResultReason, alternativeBookingInfo } = await getShowtimes(bookingInfo, { projection: {} });
                    if (!success) {
                        sessionToMutate.status = { main: null, secondary: null };
                        await reply.noResult(chatId, bookingInfo, noResultReason, alternativeBookingInfo);
                        return;
                    }
                    if (showtimes.length > 1) {
                        LOGS.logInfo(chatId, 'Need to choose experience')
                        sessionToMutate.status = { main: MAIN_STATUS.GET_EXP, secondary: null };
                        const cacheId = new Date().getTime().toString() + chatId;
                        LOGS.logInfo(chatId, `id for caching showtimes (experiences) result: ${cacheId}`);
                        const cacheIdentifier = 'unique result ❤️ ' + cacheId;
                        const inlineQueryResult = makeInlineQueryResult.showtime(showtimes, bookingInfo, cacheIdentifier);
                        await cache.inlineQueryResult(cacheId, inlineQueryResult);
                        await reply.fillSlot.getExperienceOnly(chatId, text, bookingInfo, showtimes, cacheIdentifier);
                    } else {
                        sessionToMutate.confirmPayload.uniqueSchedule = showtimes[0];
                        if (sessionToMutate.bookingInfo.experience === undefined && showtimes[0].isPlatinum) {
                            sessionToMutate.status.secondary = SEC_STATUS.WARN_PLATINUM;
                            await reply.warnPlatinum(chatId, text, bookingInfo, showtimes[0]);
                        } else {
                            await reply.fillSlot.confirmProceed(chatId, bookingInfo);
                        }
                    }
                    break;
                }
            default:
                throw `${__filename} | Unrecognized status ${JSON.stringify(sessionToMutate.status)} for slot filling`;
        }
    }
};