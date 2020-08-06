const { INTENT } = require('../../../../@global/CONSTANTS');
const SPECIAL_RATES = INTENT.FAQ.SPECIAL_RATES;

const general = require('./general/general');
const channel = require('./channel/channel');
const price = require('./price/price');
const scope = require('./scope/scope');
const eligibility = require('./eligibility/eligibility');

module.exports = async function specialRates({ text, intentArr, extractedInfo, sessionToMutate }) {

    console.log('-----specialRates triggered-----');
    console.log('specialRates subintent: ', intentArr[2]);
    switch (intentArr[2]) {
        case SPECIAL_RATES.GENERAL.SELF:
            await general({ text, extractedInfo, sessionToMutate });
            break;
        case SPECIAL_RATES.CHANNEL.SELF:
            await channel({ text, extractedInfo, sessionToMutate });
            break;
        case SPECIAL_RATES.PRICE.SELF:
            await price({ text, extractedInfo, sessionToMutate });
            break;
        case SPECIAL_RATES.SCOPE.SELF:
            await scope({ text, extractedInfo, sessionToMutate });
            break;
        case SPECIAL_RATES.ELIGIBILITY.SELF:
            await eligibility({ text, extractedInfo, sessionToMutate });
            break;
        default:
            throw `Unrecognized specialRates sub intent ${intentArr[2]}`;
    }

};
