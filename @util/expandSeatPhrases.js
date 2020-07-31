const { REGEX } = require('../@global/CONSTANTS');

module.exports = function expandSeatPhrases(seatNumArr) {

    const output = { expandedSeatNumbers: [], invalidSeatPhrases: [], correctedSeatPhrases: [] };

    for (let i = 0; i < seatNumArr.length; i++) {
        const seatNumStr = seatNumArr[i];
        let { startSeat, endSeat } = seatNumStr.match(REGEX.START_END_SEAT).groups;
        const startRowChar = startSeat.match(REGEX.ROW_CHAR)[0].toUpperCase();
        const startNum = Number(startSeat.match(REGEX.NUM)[0]);
        console.log('startSeat, endSeat: ', startSeat, endSeat);

        if (endSeat !== undefined) {
            const endRowChar = endSeat.match(REGEX.ROW_CHAR)[0].toUpperCase();
            const endNum = Number(endSeat.match(REGEX.NUM)[0]);
            if (startRowChar !== endRowChar) {
                const parsedStartNum = startNum > endNum ? endNum : startNum;
                const parsedEndNum = startNum > endNum ? startNum : endNum;
                const guessRow1 = `${startRowChar + parsedStartNum.toString()} to ${startRowChar + parsedEndNum.toString()}`;
                const guessRow2 = `${endRowChar + parsedStartNum.toString()} to ${endRowChar + parsedEndNum.toString()}`;
                output.invalidSeatPhrases.push(seatNumStr);
                output.correctedSeatPhrases.push(guessRow1, guessRow2);
            } else if (endNum < startNum) {
                const educatedGuess = `${startRowChar}${endNum} to ${endRowChar}${startNum}`;
                output.invalidSeatPhrases.push(seatNumStr);
                output.correctedSeatPhrases.push(educatedGuess);
            } else {
                for (let i = startNum; i <= endNum; i++) {
                    output.expandedSeatNumbers.push(startRowChar + i.toString());
                }
            }
        } else {
            output.expandedSeatNumbers.push(seatNumStr.toUpperCase());
        }
    }


    return output;
}

//add repeatability check before push