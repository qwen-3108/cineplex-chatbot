
const validateSeatPhrases = require('../../../../../@util/validateSeatPhrases');
const assignSeatPhrases = require('../../../../../@util/assignSeatPhrases');
const expandSeatPhrases = require('../../../../../@util/expandSeatPhrases');
const reply = require('../../../../../_telegram/reply');

const { SEC_STATUS, MAIN_STATUS } = require('../../../../../@global/CONSTANTS');
const LOGS = require('../../../../../@global/LOGS');

module.exports = async function assignAndValidateSeats({ text, extractedInfo, sessionToMutate }) {

    const seatPhraseArr = extractedInfo['seat-number'];
    const { chatId, status, bookingInfo } = sessionToMutate;
    LOGS.logInfo(chatId, extractedInfo);

    //#1: assign and post-assignment based on status
    LOGS.logInfo(chatId, '-----Assign seat phrases-----');
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

    LOGS.logInfo(chatId, `assignedSeatPhrases: ${JSON.stringify(assignedSeatPhrases)}`);

    //#2: validate
    LOGS.logInfo(chatId, '-----Validate seat phrases-----');
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
        LOGS.logInfo(chatId, `invalidSeats ${collatedInvalidSeats}`);
        sessionToMutate.status = { main: MAIN_STATUS.CHOOSE_SEAT, secondary: SEC_STATUS.INVALID_SEAT };
        sessionToMutate.counter.invalidSeatCount++;
        await reply.alertSeatProblem.invalidSeats(chatId, collatedInvalidSeats, bookingInfo.seatNumbers, sessionToMutate.counter.invalidSeatCount);
        return;
    }
    sessionToMutate.counter.invalidSeatCount = 0;
    LOGS.logInfo(chatId, `validatedSeatPhrases: ${validatedSeatPhrases}`);

    //#3: expand
    LOGS.logInfo(chatId, '-----Expanding seat phrases-----');
    let canExpand = true;
    const expandProgressObj = {
        expandedSeatNumbers: { toPush: [], toReplace: [], toRemove: [] },
        invalidSeatPhrases: {},
        correctedSeatPhrases: {}
    };
    for (const type in validatedSeatPhrases) {
        if (validatedSeatPhrases[type].length !== 0) {
            const { expandedSeatNumbers, invalidSeatPhrases, correctedSeatPhrases } = expandSeatPhrases(validatedSeatPhrases[type]);
            LOGS.logInfo(chatId, `expansion result: ${expandedSeatNumbers} ${invalidSeatPhrases} ${correctedSeatPhrases}`);
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
        await reply.alertSeatProblem.invalidSeatPhrases(chatId, expandProgressObj, sessionToMutate.counter.invalidSeatPhraseCount);
        return;
    }
    sessionToMutate.counter.invalidSeatPhraseCount = 0;
    LOGS.logInfo(chatId, `expandProgressObj: ${JSON.stringify(expandProgressObj)}`);
    return expandProgressObj.expandedSeatNumbers;

};