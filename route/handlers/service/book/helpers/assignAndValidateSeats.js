
const validateSeatPhrases = require('../../../../../@util/validateSeatPhrases');
const assignSeatPhrases = require('../../../../../@util/assignSeatPhrases');
const expandSeatPhrases = require('../../../../../@util/expandSeatPhrases');
const { alertSeatProblem } = require('../../../../../_telegram/reply');

const { SEC_STATUS, MAIN_STATUS } = require('../../../../../@global/CONSTANTS');

module.exports = async function assignAndValidateSeats({ text, extractedInfo, sessionToMutate }) {

    console.log(extractedInfo);
    const seatPhraseArr = extractedInfo['seat-number'];
    const { chatId, status, bookingInfo } = sessionToMutate;

    //#1: assign and post-assignment based on status
    console.log('-----Assign seat phrases-----');
    let assignedSeatPhrases = { toPush: [], toRemove: [], toReplace: [] };

    if (status.main === MAIN_STATUS.CONFIRM_DETAILS || status.main === MAIN_STATUS.AWAIT_PAYMENT || status.secondary === SEC_STATUS.CONFIRM_SEAT) {

        const { toPush, toReplace, toRemove } = assignSeatPhrases(text);

        if (toPush.length !== 0) assignedSeatPhrases.toPush = toPush;
        if (toRemove.length !== 0) assignedSeatPhrases.toRemove = toRemove;
        if (toReplace.length !== 0) assignedSeatPhrases.toReplace = toReplace;


    } else if (status.secondary !== null) {

        const { toPush, toReplace } = assignSeatPhrases(text);
        assignedSeatPhrases.toReplace = [...toPush, ...toReplace];

    } else {

        assignedSeatPhrases.toReplace = seatPhraseArr;
    }

    console.log('assignedSeatPhrases: ', JSON.stringify(assignedSeatPhrases));

    //#2: validate
    console.log('-----Validate seat phrases-----');
    const validatedSeatPhrases = { toPush: [], toReplace: [], toRemove: [] };
    const collatedInvalidSeats = [];
    for (const type in assignedSeatPhrases) {
        if (assignedSeatPhrases[type].length !== 0) {
            const invalidSeats = validateSeatPhrases(assignedSeatPhrases[type], bookingInfo.experience);
            if (invalidSeats.length === 0) {
                validatedSeatPhrases[type] = assignedSeatPhrases[type];
            } else {
                collatedInvalidSeats.push(...invalidSeats);
            }
        }
    }
    if (collatedInvalidSeats.length !== 0) {
        console.log('invalidSeats ', collatedInvalidSeats);
        sessionToMutate.status = { main: MAIN_STATUS.CHOOSE_SEAT, secondary: SEC_STATUS.INVALID_SEAT };
        sessionToMutate.counter.invalidSeatCount++;
        await alertSeatProblem.invalidSeats(chatId, collatedInvalidSeats, bookingInfo.seatNumbers, sessionToMutate.counter.invalidSeatCount);
        return;
    }
    sessionToMutate.counter.invalidSeatCount = 0;
    console.log('validatedSeatPhrases: ', validatedSeatPhrases);

    //#3: expand
    console.log('-----Expanding seat phrases-----');
    let canExpand = true;
    const expandProgressObj = {
        expandedSeatNumbers: { toPush: [], toReplace: [], toRemove: [] },
        invalidSeatPhrases: {},
        correctedSeatPhrases: {}
    };
    for (const type in validatedSeatPhrases) {
        if (validatedSeatPhrases[type].length !== 0) {
            const { expandedSeatNumbers, invalidSeatPhrases, correctedSeatPhrases } = expandSeatPhrases(validatedSeatPhrases[type]);
            console.log('expansion result: ', expandedSeatNumbers, invalidSeatPhrases, correctedSeatPhrases);
            expandProgressObj.expandedSeatNumbers[type] = expandedSeatNumbers;
            if (invalidSeatPhrases.length !== 0) {
                canExpand = false;
                expandProgressObj.invalidSeatPhrases[type] = invalidSeatPhrases;
                expandProgressObj.correctedSeatPhrases[type] = correctedSeatPhrases;
            }
        }
    }
    if (!canExpand) {

        sessionToMutate.status = { main: MAIN_STATUS.CHOOSE_SEAT, secondary: SEC_STATUS.INVALID_SEAT_PHRASE };
        sessionToMutate.counter.invalidSeatPhraseCount++;
        sessionToMutate.confirmPayload.seatPhraseGuess = expandProgressObj;
        await alertSeatProblem.invalidSeatPhrases(chatId, expandProgressObj, sessionToMutate.counter.invalidSeatPhraseCount);
        return;
    }
    sessionToMutate.counter.invalidSeatPhraseCount = 0;
    console.log('expandProgressObj: ', JSON.stringify(expandProgressObj));
    return expandProgressObj.expandedSeatNumbers;

};