const { COLLECTIONS } = require('../../@global/COLLECTIONS');
const makeDbQuery = require('../../@util/makeDbQuery');
const whyNoSchedules = require('./whyNoSchedules');

module.exports = async function checkAvailable(bookingInfo) {

    console.log('Checking showtime availability');

    const output = { available: undefined, noResultReason: null, alternativeBookingInfo: null };

    const { combinedQuery, availabilityQuery } = makeDbQuery(bookingInfo);

    const oneAvailableSchedule = await COLLECTIONS.showtimes.findOne({ ...combinedQuery, ...availabilityQuery });

    if (oneAvailableSchedule !== null) {
        console.log('> At least one showtime with matching condition exists');
        output.available = true;
        return output;

    } else {
        console.log('> No showtime matches given condition, determining reason...');
        output.available = false;
        //determine no result reason (no slot or sold out)
        const { noResultReason, alternativeBookingInfo } = await whyNoSchedules(bookingInfo);
        output.noResultReason = noResultReason;
        output.alternativeBookingInfo = alternativeBookingInfo;
        console.log('Reason & alternative booking info: ', output.noResultReason, JSON.stringify(output.alternativeBookingInfo));
        return output;
    }
};