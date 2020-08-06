const { addDays } = require('date-fns');
const { MAIN_STATUS } = require('../../../../../@global/CONSTANTS');
const { fillSlot, noResult, warnPlatinum } = require('../../../../../_telegram/reply');
const { checkAvailable, getShowtimes, getCinemas, cache } = require('../../../../../_database/query');
const makeInlineQueryResult = require('../../../../../@util/makeInlineQueryResult');

module.exports = async function slotFilling({ text, sessionToMutate }) {

    console.log('-----slot filling-----');

    //decide status
    const { movie, cinema, place, dateTime } = sessionToMutate.bookingInfo;

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
    console.log('Evaluated status: ', JSON.stringify(sessionToMutate.status));

    const { chatId, status, bookingInfo } = sessionToMutate;
    //take appropriate action
    if (status.main === MAIN_STATUS.PROMPT_MOVIE) {
        await fillSlot.getMovie(chatId, text);
    } else {

        switch (status.main) {
            case MAIN_STATUS.PROMPT_DATETIME:
                {
                    console.log('-----Prepare to get date time-----');
                    const { available, noResultReason, alternativeQuery } = await checkAvailable(bookingInfo);
                    if (!available) {
                        sessionToMutate.status = { main: null, secondary: null };
                        await noResult(chatId, bookingInfo, noResultReason, alternativeQuery);
                        return;
                    }
                    await fillSlot.getDateTime(chatId, text, addDays(sessionToMutate.sessionInfo.startedAt, 6));
                    break;
                }
            case MAIN_STATUS.GET_CINEMA:
                {
                    console.log('-----Prepare to get cinema-----');
                    const { success, showtimes, noResultReason, alternativeQuery } = await getShowtimes(bookingInfo, { projection: {cinema: 1} });
                    if (!success) {
                        sessionToMutate.status = { main: null, secondary: null };
                        await noResult(chatId, bookingInfo, noResultReason, alternativeQuery);
                        return;
                    }
                    const cinemaSet = new Set(showtimes.map(showtime => showtime.cinema));
                    const cinemaList = Array.from(cinemaSet);
                    const cinemaArr = await getCinemas(cinemaList);
                    const cacheId = new Date().getTime().toString() + chatId;
                    console.log('Generated id for caching cinemas result: ', cacheId);
                    const cacheIdentifier = 'unique result ❤️ ' + cacheId;
                    const inlineQueryResult = makeInlineQueryResult.cinema(cinemaArr);
                    await cache.inlineQueryResult(cacheId, inlineQueryResult);
                    await fillSlot.getCinema(chatId, text, bookingInfo, cacheIdentifier);
                    break;
                }
            case MAIN_STATUS.GET_CINEMA_TIME_EXP:
            case MAIN_STATUS.GET_TIME_EXP:
                {
                    console.log('-----Prepare to get exact showtime-----');
                    const { success, showtimes, noResultReason, alternativeQuery } = await getShowtimes(bookingInfo, { projection: {} });
                    if (!success) {
                        sessionToMutate.status = { main: null, secondary: null };
                        await noResult(chatId, bookingInfo, noResultReason, alternativeQuery);
                        return;
                    }
                    const cacheId = new Date().getTime().toString() + chatId;
                    console.log('Generated id for caching showtimes result: ', cacheId);
                    const cacheIdentifier = 'unique result ❤️ ' + cacheId;
                    const inlineQueryResult = makeInlineQueryResult.showtime(showtimes, bookingInfo, cacheIdentifier);
                    await cache.inlineQueryResult(cacheId, inlineQueryResult);
                    await fillSlot.getExactSlot(chatId, text, bookingInfo, cacheIdentifier);
                    break;
                }
            case MAIN_STATUS.CONFIRM_PROCEED:
                {
                    console.log('-----Prepare to get final confirmation-----')
                    const { success, showtimes, noResultReason, alternativeQuery } = await getShowtimes(bookingInfo, { projection: {} });
                    if (!success) {
                        sessionToMutate.status = { main: null, secondary: null };
                        await noResult(chatId, bookingInfo, noResultReason, alternativeQuery);
                        return;
                    }
                    if (showtimes.length > 1) {
                        console.log('Need to choose experience')
                        sessionToMutate.status = { main: MAIN_STATUS.GET_EXP, secondary: null };
                        const cacheId = new Date().getTime().toString() + chatId;
                        console.log('id for caching showtimes (experiences) result: ', cacheId);
                        const cacheIdentifier = 'unique result ❤️ ' + cacheId;
                        const inlineQueryResult = makeInlineQueryResult.showtime(showtimes, bookingInfo, cacheIdentifier);
                        await cache.inlineQueryResult(cacheId, inlineQueryResult);
                        await fillSlot.getExperienceOnly(chatId, text, bookingInfo, showtimes, cacheIdentifier);
                    } else {
                        sessionToMutate.confirmPayload.uniqueSchedule = showtimes[0];
                        if (sessionToMutate.bookingInfo.experience === undefined && showtimes[0].isPlatinum) {
                            await warnPlatinum(chatId, text, bookingInfo, showtimes[0]);
                        } else {
                            await fillSlot.confirmProceed(chatId, bookingInfo);
                        }
                    }
                    break;
                }
            default:
                throw `${__filename} | Unrecognized status ${JSON.stringify(sessionToMutate.status)} for slot filling`;
        }
    }
};