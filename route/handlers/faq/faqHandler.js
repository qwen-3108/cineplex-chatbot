const { INTENT } = require('../../../@global/CONSTANTS');
const FAQ = INTENT.FAQ;

const cinema = require('./cinema/cinema');
const experiences = require('./experiences/experiences');
const normalRates = require('./normalRates/normalRates');
const operations = require('./operations/operations');
const programme = require('./programme/programme');
const specialRates = require('./specialRates/specialRates');

module.exports = async function faqHandler({ text, intentArr, extractedInfo, sessionToMutate }) {

    console.log('-----faqHandler triggered-----');
    console.log('faq subintent: ', intentArr[1]);

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