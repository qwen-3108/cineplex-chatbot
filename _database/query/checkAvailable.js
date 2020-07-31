const { COLLECTIONS } = require('../../@global/COLLECTIONS');
const makeDbQuery = require('../../@util/makeDbQuery');
const whyNoSchedules = require('./whyNoSchedules');

module.exports = async function checkAvailable(bookingInfo) {

    console.log('Checking showtime availability');

    const output = { available: undefined, noResultReason: null, alternativeQuery: null };

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
        const { noResultReason, alternativeQuery } = await whyNoSchedules({ combinedQuery, availabilityQuery });
        output.noResultReason = noResultReason;
        output.alternativeQuery = alternativeQuery;
        console.log('Reason & alternative query: ', output.noResultReason, JSON.stringify(output.alternativeQuery));
        return output;
    }
};