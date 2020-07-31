const { REGEX, ROW } = require('../@global/CONSTANTS');

module.exports = function validateSeatPhrases(seatPhraseArr, experience) {

    const invalidSeats = [];

    seatPhraseArr.forEach(phrase => {

        const { startSeat, endSeat } = phrase.match(REGEX.START_END_SEAT).groups;

        const startSeatValid = isValidSeatNum(startSeat, experience);
        if (!startSeatValid) invalidSeats.push(startSeat);

        if (endSeat !== undefined) {
            const endSeatValid = isValidSeatNum(endSeat, experience);
            if (!endSeatValid) invalidSeats.push(endSeat);
        }

    });

    return invalidSeats;

}

function isValidSeatNum(seatNumber, experience) {

    const { row, num } = seatNumber.match(REGEX.SEAT_CHAR_NUM).groups;

    return (experience === 'Platinum Movie Suites') ?
        ROW.PLATINUM.includes(row) && num >= 1 && num <= 8
        : ROW.REGULAR.includes(row) && num >= 1 && num <= 14;

}