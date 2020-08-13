const { INTENT } = require('../../@global/CONSTANTS');
const PRODUCT_QUERY = INTENT.PRODUCT_QUERY;
const LOGS = require('../../@global/LOGS');

const nowShowing = require('./productQuery/nowShowing');
const movieHandler = require('./productQuery/movieHandler');

module.exports = async function productQueryHandler({ text, intentArr, extractedInfo, sessionToMutate }) {

    LOGS.logInfo(sessionToMutate.chatId, '-----productQueryHandler triggered-----');
    LOGS.logInfo(sessionToMutate.chatId, `product query subintent: ${intentArr[1]}`);

    switch (intentArr[1]) {
        case PRODUCT_QUERY.NOW_SHOWING.SELF:
            await nowShowing(sessionToMutate.chatId);
            break;
        case PRODUCT_QUERY.MOVIE.SELF:
            await movieHandler({ intentArr, extractedInfo, sessionToMutate });
            break;
        default:
            throw `Unrecognized product query sub intent ${intentArr[1]}`;
    }

}