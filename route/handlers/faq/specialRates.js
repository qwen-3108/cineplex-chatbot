const { INTENT } = require('../../../@global/CONSTANTS');
const SPECIAL_RATES = INTENT.FAQ.SPECIAL_RATES;

const general = require('./specialRates/general');
const price = require('./specialRates/price');

module.exports = async function specialRates({ text, intentArr, extractedInfo, sessionToMutate }) {

    console.log('-----specialRates triggered-----');
    console.log('specialRates subintent: ', intentArr[2]);
    switch (intentArr[2]) {
        case SPECIAL_RATES.GENERAL.SELF:
            await general({ text, extractedInfo, sessionToMutate });
            break;
        case SPECIAL_RATES.PRICE.SELF:
            await price({ extractedInfo, sessionToMutate });
            break;
        default:
            throw `Unrecognized specialRates sub intent ${intentArr[2]}`;
    }

};
