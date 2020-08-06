const { INTENT } = require('../../../@global/CONSTANTS');
const SERVICE = INTENT.SERVICE;

const book = require('./book/book');

module.exports = async function serviceHandler({ text, intentArr, extractedInfo, sessionToMutate }) {

    console.log('-----serviceHandler triggered-----');
    console.log('service subintent: ', intentArr[1]);

    switch (intentArr[1]) {
        case SERVICE.BOOK.SELF:
            await book({ text, intentArr, extractedInfo, sessionToMutate });
            break;
        default:
            throw `Unrecognized service sub intent ${intentArr[1]}`;

    }

}