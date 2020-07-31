const { addDays, subDays } = require('date-fns');

const { COLLECTIONS } = require('../../@global/COLLECTIONS');
const { NO_RESULT_REASON } = require('../../@global/CONSTANTS');

module.exports = async function whyNoSchedules({ combinedQueryInput, availabilityQueryInput }) {

    console.log('whyNoSchedules received input: ', JSON.stringify(combinedQueryInput), JSON.stringify(availabilityQueryInput));
    const output = { noResultReason: null, alternativeQuery: null };
    const combinedQuery = { ...combinedQueryInput };
    const availabilityQuery = { ...availabilityQueryInput };

    //try removing pax restriction to check if it's cause ticket sold out
    output.noResultReason = NO_RESULT_REASON.NO_SLOT;

    if (availabilityQuery.hasOwnProperty('$expr')) {
        console.log('Determining if is sold out...');
        const oneSchedule = await COLLECTIONS.showtimes.findOne(combinedQuery);
        if (oneSchedule !== null) {
            console.log('yes');
            output.noResultReason = NO_RESULT_REASON.SOLD_OUT;
        }
    }

    //widen search criteria to suggest schedules close to user request
    console.log('Widening search criteria...');
    let alternatives = await COLLECTIONS.showtimes.findOne({ combinedQuery, ...availabilityQuery });
    let timesWiden = 0;
    while (alternatives === null) {
        //only movieId and pax left in search criteria
        console.log('Query: ', JSON.stringify(combinedQuery));
        if (Object.keys(combinedQuery).length === 1 && combinedQuery.hasOwnProperty('movieId')) {
            output.noResultReason = NO_RESULT_REASON.ALL_SOLD_OUT;
            //if no pax, movie is now showing but no result in schedule, is bug
            if (!availabilityQuery.hasOwnProperty('$expr')) {
                throw `${__filename} | now showing movie (${bookingInfo.movie.title}) d.n.e. in schedule collection`;
            }
            break;
        } else {
            //if got other search criteria, widen
            for (const prop in combinedQuery) {
                switch (prop) {
                    case "dateTime":
                        if (timesWiden === 0) {
                            const newEndDate = addDays(combinedQuery.dateTime.$lte, 2);
                            newEndDate.setHours(6);
                            const newStartDate = subDays(combinedQuery.dateTime.$gte, 1);
                            newStartDate.setHours(0);
                            combinedQuery.dateTime = { $gte: newStartDate, $lte: newEndDate };
                        }
                        if (timesWiden === 1) delete combinedQuery.dateTime;
                        break;
                    case "cinema":
                        if (timesWiden === 1) delete combinedQuery.cinema;
                        break;
                    case "isPlatinum":
                        delete combinedQuery.isPlatinum;
                        break;
                    case "movieId":
                    default:
                        break;
                }
            }
            timesWiden++;
            alternatives = await COLLECTIONS.showtimes.findOne({ ...combinedQuery, ...availabilityQuery });
        }
    }

    output.alternativeQuery = { ...combinedQuery, ...availabilityQuery };
    return output;
}
