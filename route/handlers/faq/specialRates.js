const { INTENT } = require('../../../@global/CONSTANTS');
const SPECIAL_RATES = INTENT.FAQ.SPECIAL_RATES;
const { logInfo, } = require('../../../@global/LOGS');

const specialRatesHelper = require('./specialRates/specialRatesHelper');

module.exports = async function specialRates({ text, intentArr, extractedInfo, sessionToMutate }) {

    logInfo(sessionToMutate.chatId, '-----specialRates triggered-----');
    logInfo(sessionToMutate.chatId, `specialRates subintent: ${intentArr[2]}`);
    switch (intentArr[2]) {
        case SPECIAL_RATES.GENERAL.SELF:
            await specialRatesHelper.general({ text, extractedInfo, sessionToMutate });
            break;
        case SPECIAL_RATES.PRICE.SELF:
            await specialRatesHelper.price({ extractedInfo, sessionToMutate });
            break;
        default:
            throw `Unrecognized specialRates sub intent ${intentArr[2]}`;
    }

};
