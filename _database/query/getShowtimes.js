const { COLLECTIONS } = require('../../@global/COLLECTIONS');
const { NO_RESULT_REASON } = require('../../@global/CONSTANTS');
const makeDbQuery = require('../../@util/makeDbQuery');
const whyNoSchedules = require('./whyNoSchedules');

module.exports = async function getShowtimes(bookingInfo, { projection = {}, offset }) {

    console.log('Filtering and retrieving showtimes - getShowtimes.js');
    const output = { success: undefined, showtimes: [], noResultReason: null, alternativeBookingInfo: null };

    const { combinedQuery, availabilityQuery } = makeDbQuery(bookingInfo);

    if (offset !== undefined) {
        const searchCursor = await COLLECTIONS.showtimes.find({ ...combinedQuery, ...availabilityQuery }, projection).skip(offset).limit(10).sort({ dateTime: 1 });
        output.showtimes = await searchCursor.project(projection).toArray();
        if (output.showtimes.length === 0 && offset !== 0) {
            output.success = false;
            output.noResultReason = NO_RESULT_REASON.END_PAGINATION;
            return output;
        }
    } else {
        const searchCursor = await COLLECTIONS.showtimes.find({ ...combinedQuery, ...availabilityQuery }, projection).sort({ dateTime: 1 });
        output.showtimes = await searchCursor.project(projection).toArray();
    }

    if (output.showtimes.length > 0) {
        console.log('> Found matching schedules');
        output.success = true;
        return output;
    } else {
        console.log('> No matching schedules found, determining reason...');
        output.success = false;
        const { noResultReason, alternativeBookingInfo } = await whyNoSchedules(bookingInfo);
        output.noResultReason = noResultReason;
        output.alternativeBookingInfo = alternativeBookingInfo;
        console.log('Reason & alternative booking info: ', output.noResultReason, JSON.stringify(output.alternativeBookingInfo));
        return output;
    }
}