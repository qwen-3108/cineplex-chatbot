const { INTENT } = require("../../../@global/CONSTANTS");
const OPERATIONS = INTENT.FAQ.OPERATIONS;
const { logInfo, } = require('../../../@global/LOGS');

const advanceBooking = require('./operations/advanceBooking');
const cancelBooking = require('./operations/cancelBooking');
const changeBooking = require('./operations/changeBooking');
const operatingHours = require('./operations/operatingHours');
const showtimeUpdating = require('./operations/showtimeUpdating');

module.exports = async function ({ text, intentArr, extractedInfo, sessionToMutate }) {

    logInfo(sessionToMutate.chatId, '-----operationHandler triggered-----');
    logInfo(sessionToMutate.chatId, `operation subintent: ${intentArr[2]}`);

    const { chatId, sessionInfo } = sessionToMutate;

    switch (intentArr[2]) {
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
                await operatingHours(chatId, text, extractedInfo, sessionInfo);
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