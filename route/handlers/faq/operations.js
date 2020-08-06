const { INTENT } = require("../../../../@global/CONSTANTS");
const OPERATIONS = INTENT.FAQ.OPERATIONS;

const advanceBooking = require('./advanceBooking/advanceBooking');
const cancelBooking = require('./cancelBooking/cancelBooking');
const changeBooking = require('./changeBooking/changeBooking');
const operatingHours = require('./operatingHours/operatingHours');
const showtimeUpdating = require('./showtimeUpdating/showtimeUpdating');

module.exports = async function({ text, intentArr, extractedInfo, sessionToMutate }){

    console.log('-----operationHandler triggered-----');
    console.log('operation subintent: ', intentArr[2]);

    const chatId = sessionToMutate.chatId;

    switch(intentArr[2]){
        case OPERATIONS.ADVANCE_BOOKING.SELF:
            {
                await advanceBooking(chatId);
            }
            break;
        case OPERATIONS.CANCEL_BOOKING.SELF:
            {
                await cancelBooking(chatId);
            }
            break;
        case OPERATIONS.CHANGE_BOOKING.SELF:
            {
                await changeBooking(chatId, extractedInfo);
            }
            break;
        case OPERATIONS.OPERATING_HOURS.SELF:
            {
                await operatingHours(chatId, text, extractedInfo);
            }
            break;
        case OPERATIONS.SHOWTIME_UPDATING.SELF:
            {
                await showtimeUpdating(chatId);
            }
            break;
        default:
            throw `Custom error: Unrecognized operations sub intent ${intentArr[2]}`;
    }

}