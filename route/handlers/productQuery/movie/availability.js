const { addDays } = require('date-fns');
const makeDateTimePhrase = require('../../../../@util/makeDateTimePhrase');
const { SEC_STATUS } = require('../../../../@global/CONSTANTS');
const { COLLECTIONS } = require('../../../../@global/COLLECTIONS');
const LOGS = require('../../../../@global/LOGS');
const post = require('../../../../_telegram/post');
const decideMaxDate = require('../../../../@util/decideMaxDate');

module.exports = async function movieAvailability(extractedInfo, sessionToMutate) {
    LOGS.logInfo(sessionToMutate.chatId, '-----checking movie availability-----');
    const movie = await COLLECTIONS.movies.findOne({ title: extractedInfo.movie }, { projection: { title: 1, debutDateTime: 1, isBlockBuster: 1 } });
    const latestDate = decideMaxDate(sessionToMutate.sessionInfo.startedAt);

    let text = '';
    if (movie === null) throw `${__filename} | movie ${extractedInfo.movie} not found in db`;
    if (movie.debutDateTime > latestDate) {
        const { debutDateTime: debutDate } = movie;
        const ticketAvailableDate = addDays(debutDate, -7);
        LOGS.logInfo(sessionToMutate.chatId, `requested movie is upcoming. Debut date: ${debutDate.toLocaleDateString()}`);

        const debutDatePhrased = makeDateTimePhrase(debutDate, { sessionStartedAt: sessionToMutate.sessionInfo.startedAt, includeTimePhrase: false });
        const ticketDatePhrased = makeDateTimePhrase(ticketAvailableDate, { sessionStartedAt: sessionToMutate.sessionInfo.startedAt, includeTimePhrase: false });
        text = `Not yet. ${movie.title} will be released ${debutDatePhrased} and ticket will be available for sales from ${ticketDatePhrased.slice(3)}. Do check back again :) `;

    } else {
        LOGS.logInfo(sessionToMutate.chatId, 'requested movie is available');
        text = `Yup. Would you like to purchase tickets for ${movie.title} now?`;
        sessionToMutate.status.main = null;
        sessionToMutate.status.secondary = SEC_STATUS.CONFIRM_MOVIE;
        sessionToMutate.payload.movie = {};
        sessionToMutate.payload.movie.id = movie._id;
        sessionToMutate.payload.movie.title = movie.title;
        sessionToMutate.payload.movie.debutDateTime = movie.debutDateTime;
        sessionToMutate.payload.movie.isBlockBuster = movie.isBlockBuster;
    }

    await post.sendMessage(sessionToMutate.chatId, text);

}
