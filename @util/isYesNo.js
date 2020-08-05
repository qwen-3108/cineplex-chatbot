const { FAQ } = require('../@global/CONSTANTS');

module.exports = function isYesNo(text) {

    let isYesNo;

    if (FAQ.YES_NO_REGEX.YES_NO.test(text)) {
        isYesNo = true;
    } else if (FAQ.YES_NO_REGEX.OPEN.test(text)) {
        isYesNo = false;
    } else {
        throw `Question structure not considered in YES_NO_REGEX, text: ${text}`;
    }

    return isYesNo;

}