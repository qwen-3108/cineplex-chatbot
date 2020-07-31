const fs = require('fs');

const { COLLECTIONS } = require('../@global/COLLECTIONS');
const { MAIN_STATUS } = require('../@global/CONSTANTS');
const drawSeatPlan = require('../@util/drawSeatPlan');
const editSeatPlan = require('../_telegram/reply/editSeatPlan');
const { SessionEntityTypesClient } = require('dialogflow');

module.exports = async function onShowtimeChange(data) {

    console.log('-----Change in showtimes collection detected-----');

    if (data.operationType === 'update') {

        console.log('-----Make real-time edits to active seating plans-----');

        try {
            //#1: draw seat plan
            console.log('Drawing seating plan');
            const { _id, seatingPlan, isPlatinum } = data.fullDocument;
            const seatPlanBuf = drawSeatPlan(_id, seatingPlan, isPlatinum);
            fs.writeFileSync(`#asset/image/seat_snapshot/${_id}.jpeg`, seatPlanBuf);

            //#2: get sessions that have retrieved seat plan of this schedule
            console.log('Retrieving messages to edit');
            const searchCursor = await COLLECTIONS.sessions.find({ "status.main": { $in: [MAIN_STATUS.CHOOSE_SEAT, MAIN_STATUS.CONFIRM_DETAILS, MAIN_STATUS.AWAIT_PAYMENT] }, "bookingInfo.ticketing.scheduleId": _id.toString() }, { chatId: 1, bookingInfo: 1 });
            const relevantSessions = await searchCursor.toArray();
            console.log('relevantSessions', JSON.stringify(relevantSessions));

            //#3: for each session, edit seat plan, update new file id
            console.log('Sending edit requests');
            const requests = relevantSessions.map(session => editSeatPlan(session._id, _id.toString(), session.bookingInfo));
            const outcome = await Promise.all(requests);
            console.log(outcome);

            //#4: when all done, delete seat plan from server
            console.log('Deleting seating plan from server');
            fs.unlinkSync(`#asset/image/seat_snapshot/${_id}.jpeg`);

        }

        catch (ex) {
            console.log('-----! Error-----');
            console.log(ex);
        }
    }
}