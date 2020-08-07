const { COLLECTIONS } = require('../../@global/COLLECTIONS');
const { NO_RESULT_REASON } = require('../../@global/CONSTANTS');
const makeDbQuery = require('../../@util/makeDbQuery');
const whyNoSchedules = require('./whyNoSchedules');

module.exports = async function getShowtimes(bookingInfo, { projection = {}, offset }) {

    console.log('Filtering and retrieving showtimes - getShowtimes.js');
    const output = { success: undefined, showtimes: [], noResultReason: null, alternativeQuery: null };

    const { combinedQuery, availabilityQuery } = makeDbQuery(bookingInfo);

    if (offset !== undefined) {
        const searchCursor = await COLLECTIONS.showtimes.find({ ...combinedQuery, ...availabilityQuery }, projection).skip(offset).limit(10).sort({ dateTime: 1 });
        output.showtimes = await searchCursor.project(projection).toArray();
        if (output.showtimes.length === 0) {
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
        const { noResultReason, alternativeQuery } = await whyNoSchedules({ combinedQueryInput: combinedQuery, availabilityQueryInput: availabilityQuery });
        output.noResultReason = noResultReason;
        output.alternativeQuery = alternativeQuery;
        console.log('Reason & alternative query: ', output.noResultReason, JSON.stringify(output.alternativeQuery));
        return output;
    }
}