const post = require('../../../../_telegram/post');
const LOGS = require('../../../../@global/LOGS');
const { COLLECTIONS } = require('../../../../@global/COLLECTIONS');
const { addDays } = require('date-fns');
const mapDateTime = require('../../../../@util/mapDateTime');

module.exports = async function movieShowtime(extractedInfo, sessionToMutate) {

    //um.. okay, what's the showtimes of tenet?

    LOGS.logInfo(sessionToMutate.chatId, '-----checking movie showtime-----');

    const movie = await COLLECTIONS.movies.findOne({ title: extractedInfo.movie }, { projection: { title: 1, debutDateTime: 1, isBlockBuster: 1 } });
    const latestDate = addDays(new Date('2020-05-17T23:59'), 7);

    if (movie === null) throw `${__filename} | movie ${extractedInfo.movie} not found in db`;

    let text = '';
    if (movie.debutDateTime > latestDate) {
        const mappedDebutDate = mapDateTime(movie.debutDateTime, sessionToMutate.bookingInfo.dateTime.sessionStartedAt);
        text = `The showtime of ${movie.title} is not available yet... It debuts only at ${mappedDebutDate.toLocaleDateString()}. `;
        await post.sendMessage(sessionToMutate.chatId, text);
    } else {
        text = `Just tap the button below to view the showtimes of ${movie.title}. This button simply shows the result of '@cathay_sg_bot ${movie.title}'. To filter the showtimes, you could also type your preferred date and place, e.g. '@cathay_sg_bot ${movie.title} tomorrow JEM' :)`;
        const replyMarkup = { inline_keyboard: [[{ text: 'Showtime', switch_inline_query_current_chat: `${movie.title}` }]] };
        await post.sendMessage(sessionToMutate.chatId, text, { replyMarkup });
    }

}
