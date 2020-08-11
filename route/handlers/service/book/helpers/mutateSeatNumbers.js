const { checkAvailable, updateReservation } = require('../../../../../_database/query');
const { alertSeatProblem, confirmSeats, confirmDetails } = require('../../../../../_telegram/reply');

const { MAIN_STATUS, SEC_STATUS } = require('../../../../../@global/CONSTANTS');
const LOGS = require('../../../../../@global/LOGS');

module.exports = async function mutateSeatNumbers({ expandedSeatNumObj, sessionToMutate }) {

    const { chatId, bookingInfo } = sessionToMutate; //destructure here to get mutated seatNumbers
    LOGS.logInfo(chatId, '-----Modify booking info-----');
    const isEdit = sessionToMutate.bookingInfo.seatNumbers.length !== 0;
    LOGS.logInfo(chatId, `expandSeatNumObj received: ${JSON.stringify(expandedSeatNumObj)}`);
    //#4: modify seat numbers in booking info
    const { toPush, toReplace, toRemove } = expandedSeatNumObj;
    if (toReplace.length !== 0) {
        sessionToMutate.bookingInfo.seatNumbers = toReplace;
    } else {
        if (toPush.length !== 0) sessionToMutate.bookingInfo.seatNumbers.push(...toPush);
        if (toRemove.length !== 0) sessionToMutate.bookingInfo.seatNumbers = sessionToMutate.bookingInfo.seatNumbers.filter(seatNum => !toRemove.includes(seatNum));
    }
    LOGS.logInfo(chatId, `Modified booking info: ${JSON.stringify(sessionToMutate.bookingInfo.seatNumbers)}`);

    //#5: update seat reservation to reflect booking info
    LOGS.logInfo(chatId, '-----Update reservation-----');
    const { movie, ticketing, seatNumbers } = bookingInfo;
    const selected = ticketing.filter(selection => selection.isSelected);
    LOGS.logInfo(chatId, `Using this showtime: ${JSON.stringify(selected)}`);
    if (selected.length !== 1) throw `Seating plan selected is not unique in mutateSeatNumber.js`;
    const { takenSeats, justTakenSeats, stillAvailable } = await updateReservation(chatId, selected[0].scheduleId, seatNumbers);
    if (!stillAvailable) {
        const { available } = await checkAvailable({ movie: { title: movie.title } });
        sessionToMutate.status = {
            main: available ? MAIN_STATUS.GET_CINEMA_TIME_EXP : null,
            secondary: null
        };
        await alertSeatProblem.fullyBooked(chatId, bookingInfo, available);
        return;
    }
    LOGS.logInfo(chatId, `> Outcome - takenSeats: ${JSON.stringify(takenSeats)} justTakenSeats: ${JSON.stringify(justTakenSeats)} stillAvailable: ${stillAvailable}`);

    sessionToMutate.status = { main: MAIN_STATUS.CHOOSE_SEAT, secondary: SEC_STATUS.SEAT_TAKEN };
    sessionToMutate.bookingInfo.seatNumbers = seatNumbers.filter(seatNum => ![...takenSeats, ...justTakenSeats].includes(seatNum));
    if (takenSeats.length !== 0 && justTakenSeats.length !== 0) {
        sessionToMutate.counter.seatTakenCount++;
        sessionToMutate.counter.justTakenCount++;
        await alertSeatProblem.mixedTakenSeats(chatId, takenSeats, justTakenSeats);
        return;
    } else if (takenSeats.length !== 0) {
        sessionToMutate.counter.seatTakenCount++;
        const seatTakenCount = sessionToMutate.counter.seatTakenCount;
        await alertSeatProblem.takenSeats(chatId, takenSeats, seatTakenCount);
        return;
    } else if (justTakenSeats.length !== 0) {
        sessionToMutate.counter.justTakenCount++;
        const justTakenCount = sessionToMutate.counter.justTakenCount;
        await alertSeatProblem.justTakenSeats(chatId, justTakenSeats, justTakenCount);
        return;
    }
    sessionToMutate.counter.seatTakenCount = 0;
    sessionToMutate.counter.justTakenCount = 0;
    //#6: if isEdit, confirmSeats. else confirmDetails
    if (isEdit) {
        LOGS.logInfo(chatId, '-----Confirm seats-----');
        sessionToMutate.status = { main: MAIN_STATUS.CHOOSE_SEAT, secondary: SEC_STATUS.CONFIRM_SEAT };
        await confirmSeats(chatId, bookingInfo.seatNumbers);
    } else {
        LOGS.logInfo(chatId, '-----Confirm details-----');
        sessionToMutate.status = { main: MAIN_STATUS.CONFIRM_DETAILS, secondary: null };
        await confirmDetails(chatId, bookingInfo);
    }
    return;

}