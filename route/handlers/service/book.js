const { INTENT } = require('../../../@global/CONSTANTS');
const BOOK = INTENT.SERVICE.BOOK;
const start = require('./book/start');

module.exports = async function bookHandler({ text, intentArr, extractedInfo, sessionToMutate }) {

    console.log('-----bookHandler triggered-----');
    console.log('booking subintent: ', intentArr[2]);

    switch (intentArr[2]) {
        case BOOK.START.SELF:
            await start({ text, intentArr, extractedInfo, sessionToMutate });
            break;
        case BOOK.EDIT_INFO.SELF:
            await editInfo({ text, intentArr, extractedInfo, sessionToMutate });
            break;
        case BOOK.ANSWER_PROMPT.SELF:
            await answerPrompt({ text, intentArr, extractedInfo, sessionToMutate });
            break;
        case BOOK.WHAT_ABOUT.SELF:
            await whatAbout({ text, intentArr, extractedInfo, sessionToMutate });
            break;
        case BOOK.SEAT.SELF:
            await seat({ text, intentArr, extractedInfo, sessionToMutate });
            break;
        default:
            throw `Unrecognized service sub intent ${intentArr[1]}`;
    }

}