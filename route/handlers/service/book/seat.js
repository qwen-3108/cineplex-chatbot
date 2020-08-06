const { INTENT } = require('../../../../@global/CONSTANTS');
const SEAT = INTENT.SERVICE.BOOK.SEAT;

const mutateSeatNumbers = require('./helpers/mutateSeatNumbers');
const assignAndValidateSeats = require('./helpers/assignAndValidateSeats');
const alertMultipleShowtimes = require('../../../../_telegram/reply/alertMultipleShowtimes');
const toEditSeatReq = require('../../../../_telegram/reply/toEditSeatReq');

module.exports = async function seat({ text, intentArr, extractedInfo, sessionToMutate }) {

    console.log('-----seat triggered-----');
    console.log('seat subintent: ', intentArr[3]);

    switch (intentArr[3]) {
        case SEAT.FIRST_CHOOSE.SELF:
        case SEAT.EDIT.SELF:
            {
                const { ticketing } = sessionToMutate.bookingInfo;
                if (ticketing.length > 1 && ticketing.every(selection => !selection.isSelected)) {
                    console.log('-----confirming chosen showtime-----');
                    sessionToMutate.payload.seatNumber = extractedInfo['seat-number'];
                    console.log("saved seat number to payload: ", sessionToMutate.payload.seatNumber);
                    await alertMultipleShowtimes(chat.id);
                } else {
                    const expandedSeatNumObj = await assignAndValidateSeats({ text, extractedInfo, sessionToMutate });
                    if (expandedSeatNumObj === undefined) break;
                    await mutateSeatNumbers({ expandedSeatNumObj, sessionToMutate });
                }
            }
            break;
        case SEAT.ADD.SELF:
        case SEAT.CHANGE.SELF:
        case SEAT.REMOVE.SELF:
            {
                sessionToMutate.status = {
                    main: MAIN_STATUS.CHOOSE_SEAT,
                    secondary: SEC_STATUS.MODIFY_SEAT
                };
                await toEditSeatReq(sessionToMutate.chatId, text, intentArr[3]);
            }
            break;
        default:
            throw `Unrecognized seat sub intent ${intentArr[3]}`;
    }

};
