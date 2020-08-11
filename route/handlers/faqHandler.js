const { INTENT } = require('../../@global/CONSTANTS');
const FAQ = INTENT.FAQ;
const LOGS = require('../../@global/LOGS');

const cinema = require('./faq/cinema');
const operations = require('./faq/operations');
const programme = require('./faq/programme');
const specialRates = require('./faq/specialRates');

module.exports = async function faqHandler({ text, intentArr, extractedInfo, sessionToMutate }) {

    LOGS.logInfo(sessionToMutate.chatId, '-----faqHandler triggered-----');
    LOGS.logInfo(sessionToMutate.chatId, `faq subintent: ${intentArr[1]}`);

    switch (intentArr[1]) {
        case FAQ.NORMAL_RATES.SELF:
            await normalRates({ text, intentArr, extractedInfo, sessionToMutate });
            break;
        case FAQ.SPECIAL_RATES.SELF:
            await specialRates({ text, intentArr, extractedInfo, sessionToMutate });
            break;
        case FAQ.PROGRAMME.SELF:
            await programme({ text, intentArr, extractedInfo, sessionToMutate });
            break;
        case FAQ.EXPERIENCES.SELF:
            await experiences({ text, intentArr, extractedInfo, sessionToMutate });
            break;
        case FAQ.CINEMA.SELF:
            await cinema({ text, intentArr, extractedInfo, sessionToMutate });
            break;
        case FAQ.OPERATIONS.SELF:
            await operations({ text, intentArr, extractedInfo, sessionToMutate });
            break;
        default:
            throw `Unrecognized faq sub intent ${intentArr[1]}`;

    }

}