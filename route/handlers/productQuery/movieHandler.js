const LOGS = require('../../../@global/LOGS');
const { INTENT } = require('../../../@global/CONSTANTS');
const MOVIE = INTENT.PRODUCT_QUERY.MOVIE;

const availability = require('./movie/availability');
const showtime = require('./movie/showtime');

module.exports = async function movieHandler({ text, intentArr, extractedInfo, sessionToMutate }) {

    LOGS.logInfo(sessionToMutate.chatId, '-----movieHandler triggered-----');
    LOGS.logInfo(sessionToMutate.chatId, `movie subintent: ${intentArr[2]}`);

    switch (intentArr[2]) {
        case MOVIE.AVAILABLE.SELF:
            await availability(extractedInfo, sessionToMutate);
            break;
        case MOVIE.SHOWTIME.SELF:
            await showtime({ text, intentArr, extractedInfo, sessionToMutate });
            break;
        default:
            throw `Unrecognized product query sub intent ${intentArr[2]}`;
    }

}
