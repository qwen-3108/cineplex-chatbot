const listInEnglish = require('./listInEnglish');
const { REGEX } = require('../@global/CONSTANTS');

//from expanded seat num arr
module.exports = function makeSeatNumPhrase(seatNumbers) {

    //#1: make seatNumbers into Obj form
    const seatNumObj = {};
    seatNumbers.forEach(seatNum => {
        const { row: rowChar, num } = seatNum.match(REGEX.SEAT_CHAR_NUM).groups;

        if (seatNumObj[rowChar] === undefined) seatNumObj[rowChar] = [];
        seatNumObj[rowChar].push(Number(num));
    });


    //#2: Group rows together and convert to phrase
    let seatNumPhraseArr = [];

    for (const row in seatNumObj) {
        if (seatNumObj[row].length > 2) {
            seatNumObj[row].sort((a, b) => a - b);
            const brokeArr = breakRow(seatNumObj[row]);
            brokeArr.forEach(arr => {
                if (arr.length > 1) {
                    const startSeat = row + arr[0].toString();
                    const endSeat = row + arr[arr.length - 1].toString();
                    seatNumPhraseArr.push(`${startSeat} to ${endSeat}`);
                } else {
                    seatNumPhraseArr.push(row + arr[0].toString());
                }
            });
        } else if (seatNumObj[row].length === 0) {
            throw `${__filename} | seatNumObj[row] length should not be zero`;
        } else {
            seatNumObj[row].forEach(num => {
                seatNumPhraseArr.push(row + num.toString());
            })
        }
    }

    let seatNumPhrase = listInEnglish(seatNumPhraseArr);

    return seatNumPhrase;
}

/*---helper functions ---*/

function breakRow(arr) {
    let tempArr = [...arr];
    let firstBreakIndex;
    for (let j = 1; j < tempArr.length; j++) {
        if (tempArr[j] - tempArr[j - 1] > 1) {
            firstBreakIndex = j;
            break;
        }
    }
    if (firstBreakIndex === undefined) {
        return [tempArr];
    } else {
        // console.log('tempArr: ', tempArr);
        // console.log('First break index: ', firstBreakIndex);
        // console.log(tempArr.slice(0, firstBreakIndex));
        // console.log(tempArr.slice(firstBreakIndex));
        return [tempArr.slice(0, firstBreakIndex), ...breakRow(tempArr.slice(firstBreakIndex))];
    }
}

