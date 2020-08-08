const { addDays } = require('date-fns');
const mapDateTime = require('../../../@util/mapDateTime');
const makeDateTimePhrase = require('../../../@util/makeDateTimePhrase');
const { SEC_STATUS } = require('../../../@global/CONSTANTS');
const { COLLECTIONS } = require('../../../@global/COLLECTIONS');
const { logInfo, } = require('../../../@global/LOGS');
const sendMessage = require('../../../_telegram/post/sendMessage');

module.exports = async function movieAvailability(extractedInfo, currentSession) {
    logInfo(sessionToMutate.chatId, '-----checking movie availability-----');
    const movie = await COLLECTIONS.movies.findOne({ title: extractedInfo.movie }, { projection: { title: 1, debutDateTime: 1, isBlockBuster: 1 } });
    const latestDate = addDays(new Date('2020-05-17T23:59'), 7);

    let text = '';
    if (movie === null) throw `${__filename} | movie ${extractedInfo.movie} not found in db`;
    if (movie.debutDateTime > latestDate) {
        const { daysToDbDate, nextWeekAreDaysLessThan } = currentSession.bookingInfo.dateTime;
        const debutDate = mapDateTime(movie.debutDateTime, daysToDbDate, nextWeekAreDaysLessThan);
        const ticketAvailableDate = addDays(debutDate, -7);
        logInfo(sessionToMutate.chatId, `requested movie is upcoming. Debut date: ${debutDate.toLocaleDateString()}`);

        const debutDateEnd = new Date(debutDate)
        debutDateEnd.setHours(23, 59, 59);
        const ticketAvailableDateEnd = new Date(ticketAvailableDate)
        ticketAvailableDateEnd.setHours(23, 59, 59);
        const debutDatePhrased = makeDateTimePhrase({ start: debutDate, end: debutDateEnd });
        const ticketDatePhrased = makeDateTimePhrase({ start: ticketAvailableDate, end: ticketAvailableDateEnd });
        text = `Sorry not yet. ${movie.title} will be released on ${debutDatePhrased} and ticket will be available for sales from ${ticketDatePhrased}. Do check back again :) `;

    } else {
        logInfo(sessionToMutate.chatId, 'requested movie is available');
        text = `Yup. Would you like to purchase tickets for ${movie.title} now?`;
        currentSession.status.main = null;
        currentSession.status.secondary = SEC_STATUS.CONFIRM_MOVIE;
        currentSession.payload.movie = {};
        currentSession.payload.movie.id = movie._id;
        currentSession.payload.movie.title = movie.title;
        currentSession.payload.movie.debutDateTime = movie.debutDateTime;
        currentSession.payload.movie.isBlockBuster = movie.isBlockBuster;
    }

    await sendMessage(currentSession.chatId, text);

}
