const { addDays } = require('date-fns');
const makeDateTimePhrase = require('../../@util/makeDateTimePhrase');
const mapDateTime = require('../../@util/mapDateTime');
const { SEC_STATUS } = require('../../@global/CONSTANTS');
const { COLLECTIONS } = require('../../@global/COLLECTIONS');
const post = require('../post');
const { logInfo } = require('../../@global/LOGS');

module.exports = async function faqMovieAvailability(chat_id, extractedInfo, currentSession) {
    logInfo('-----checking movie availability-----');
    const movie = await COLLECTIONS.movies.findOne({ title: extractedInfo.movie }, { projection: { title: 1, debutDateTime: 1, isBlockBuster: 1 } });
    const latestDate = addDays(new Date('2020-05-17T23:59'), 7);

    let text = '';
    if (movie === null) throw `${__filename} | movie ${extractedInfo.movie} not found in db`;
    if (movie.debutDateTime > latestDate) {
        const debutDate = mapDateTime(movie.debutDateTime, currentSession.bookingInfo.dateTime.sessionStartedAt);
        const ticketAvailableDate = addDays(debutDate, -7);
        logInfo('requested movie is upcoming. Debut date: ', debutDate.getLocaleDateString());

        const debutDatePhrased = makeDateTimePhrase(debutDate);
        const ticketDatePhrased = makeDateTimePhrase(ticketAvailableDate);
        text = `Sorry not yet. ${movie.title} will be released on ${debutDatePhrased} and ticket will be available for sales from ${ticketDatePhrased}. Do check back again :) `;

    } else {
        logInfo('requested movie is available');
        text = `Yup. Would you like to purchase tickets for ${movie.title} now?`;
        currentSession.status.main = null;
        currentSession.status.secondary = SEC_STATUS.CONFIRM_MOVIE;
        currentSession.payload.movie = {};
        currentSession.payload.movie.id = movie._id;
        currentSession.payload.movie.title = movie.title;
        currentSession.payload.movie.debutDateTime = movie.debutDateTime;
        currentSession.payload.movie.isBlockBuster = movie.isBlockBuster;
    }

    await post.sendMessage(chat_id, text);

}
