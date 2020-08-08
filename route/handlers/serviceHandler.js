const { INTENT } = require('../../@global/CONSTANTS');
const SERVICE = INTENT.SERVICE;
const { logInfo, } = require('../../@global/LOGS');

const book = require('./service/book');

module.exports = async function serviceHandler({ text, intentArr, extractedInfo, sessionToMutate }) {

    logInfo(sessionToMutate.chatId, '-----serviceHandler triggered-----');
    logInfo(sessionToMutate.chatId, `service subintent: ${intentArr[1]}`);

    switch (intentArr[1]) {
        case SERVICE.BOOK.SELF:
            await book({ text, intentArr, extractedInfo, sessionToMutate });
            break;
        default:
            throw `Unrecognized service sub intent ${intentArr[1]}`;

    }

}