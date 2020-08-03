const { ObjectId } = require('mongodb');
const { differenceInMinutes } = require('date-fns');
const { COLLECTIONS } = require('../../@global/COLLECTIONS');

module.exports = async function updateReservation(chatId, scheduleId, seatNumbers) {

    let stillAvailable = false;
    const showtime = await COLLECTIONS.showtimes.findOne({ _id: ObjectId(scheduleId) }, { seatingPlan: 1 });
    const releaseStr = {};
    const reserveStr = {};
    const takenSeats = [];
    const justTakenSeats = [];
    for (const seat in showtime.seatingPlan) {

        if (!stillAvailable && showtime.seatingPlan[seat].status === 0) stillAvailable = true;

        const { status, reserved, sold } = showtime.seatingPlan[seat];

        if (seatNumbers.includes(seat)) {

            const currentTime = new Date();
            switch (status) {
                case 0:
                    reserveStr[`seatingPlan.${seat}.status`] = 2;
                    reserveStr[`seatingPlan.${seat}.reserved.at`] = new Date();
                    reserveStr[`seatingPlan.${seat}.reserved.by`] = chatId;
                    break;
                case 1:
                    if (differenceInMinutes(currentTime, sold.at) > 1) {
                        console.log(`${seat} sold at ${sold.at} `, differenceInMinutes(currentTime, sold.at), ' minutes ago');
                        takenSeats.push(seat);
                    } else {
                        console.log(`${seat} sold at ${sold.at} `, differenceInMinutes(currentTime, sold.at), ' minutes ago');
                        justTakenSeats.push(seat);
                    }
                    break;
                case 2:
                    if (reserved.by === chatId) {
                        console.log(`Seat ${seat} is previously reserved seat, keep reservation.`);
                    } else {
                        if (differenceInMinutes(currentTime, reserved.at) > 2) {
                            console.log(`${seat} reserved at ${reserved.at} `, differenceInMinutes(currentTime, reserved.at), ' minutes ago');
                            takenSeats.push(seat);
                        } else {
                            console.log(`${seat} reserved at ${sold.at} `, differenceInMinutes(currentTime, reserved.at), ' minutes ago');
                            justTakenSeats.push(seat);
                        }
                    }
                    break;

            }

        } else {

            if (status === 2 && reserved.by === chatId) { //seat not present in newest seatNumbers but reserved by same user, need to release
                console.log(`Seat ${seat} is previously reserved seat that needs to be released. Releasing`);
                releaseStr[`seatingPlan.${seat}.status`] = 0;
                releaseStr[`seatingPlan.${seat}.reserved.at`] = null;
                releaseStr[`seatingPlan.${seat}.reserved.by`] = null;
            }

        }

    }
    console.log('Update query: ', JSON.stringify(reserveStr), JSON.stringify(releaseStr));

    if (Object.keys(reserveStr).length === 0 && Object.keys(releaseStr).length === 0) {
        return ({ justTakenSeats, takenSeats, stillAvailable });
    }

    const updateOutcome = await COLLECTIONS.showtimes.updateOne({ _id: ObjectId(scheduleId) }, { $set: { ...releaseStr, ...reserveStr } });
    console.log('update outcome: ', JSON.stringify(updateOutcome));

    if (seatNumbers.length !== 0) {
        console.log('not releasing call, seatNumbers.length: ', seatNumbers.length);
        setTimeout(updateReservation, 30000, chatId, scheduleId, []);
    }

    return ({ justTakenSeats, takenSeats, stillAvailable });

}

// showtimes.updateOne({ _id: ObjectId("5f19a6275af0b94537f70ae8") }, { $set: { "seatingPlan.C4.status": 2, "seatingPlan.C4.reserved.at": "2020-07-28T04:39:31.732Z", "seatingPlan.C4.reserved.by": "750594803", "seatingPlan.C5.status": 2, "seatingPlan.C5.reserved.at": "2020-07-28T04:39:31.732Z", "seatingPlan.C5.reserved.by": "750594803" } })


//{
//     status:
//     reserved:{
//     by:
//     at:
// },
// sold:{
//     to:
//     at:
//     ticketId:
// }