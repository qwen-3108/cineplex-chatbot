const { INTENT } = require('../../@global/CONSTANTS');
const PRODUCT_QUERY = INTENT.PRODUCT_QUERY;

const nowShowing = require('./productQuery/nowShowing');
const movie = require('./productQuery/movie');

module.exports = async function productQueryHandler({ text, intentArr, extractedInfo, sessionToMutate }) {

    console.log('-----productQueryHandler triggered-----');
    console.log('product query subintent: ', intentArr[1]);

    switch (intentArr[1]) {
        case PRODUCT_QUERY.NOW_SHOWING.SELF:
            await nowShowing(sessionToMutate.chatId);
            break;
        case PRODUCT_QUERY.MOVIE.SELF:
            await movie(extractedInfo, sessionToMutate);
            break;
        default:
            throw `Unrecognized product query sub intent ${intentArr[1]}`;
    }

}