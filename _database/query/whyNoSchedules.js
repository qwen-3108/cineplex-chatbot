const { addDays, subDays, isBefore, differenceInCalendarDays } = require('date-fns');

const { COLLECTIONS } = require('../../@global/COLLECTIONS');
const { NO_RESULT_REASON } = require('../../@global/CONSTANTS');
const makeDbQuery = require('../../@util/makeDbQuery');
const decideMaxDate = require('../../@util/decideMaxDate');

module.exports = async function whyNoSchedules(bookingInfo) {

    const { combinedQuery, availabilityQuery } = makeDbQuery(bookingInfo);

    //copying bookingInfo to output.alternativeBookingInfo
    const { movie, dateTime, place, cinema, experience } = bookingInfo;
    const output = {
        noResultReason: null,
        alternativeBookingInfo: {
            movie: { title: movie.title, id: movie.id, isBlockBuster: movie.isBlockBuster, debutDateTime: new Date(movie.debutDateTime) },
            dateTime: {
                start: new Date(dateTime.start),
                end: new Date(dateTime.end),
                sessionStartedAt: new Date(dateTime.sessionStartedAt)
            },
            place,
            cinema: [...cinema],
            experience
        }
    };

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
        if (output.alternativeBookingInfo.dateTime.start === null && output.alternativeBookingInfo.place === null && output.alternativeBookingInfo.cinema.length === 0 && output.alternativeBookingInfo.experience === undefined) {
            output.noResultReason = NO_RESULT_REASON.ALL_SOLD_OUT;
            //if no pax, movie is now showing but no result in schedule, is bug
            if (!availabilityQuery.hasOwnProperty('$expr')) {
                throw `${__filename} | now showing movie (${bookingInfo.movie.title}) d.n.e. in schedule collection`;
            }
            break;
        } else {
            //if got other search criteria, widen
            for (const param in output.alternativeBookingInfo) {
                switch (param) {
                    case 'dateTime':
                        if (timesWiden === 0) {
                            const { start, end, sessionStartedAt } = output.alternativeBookingInfo.dateTime;
                            output.alternativeBookingInfo.dateTime.start = subDays(start, 1);
                            output.alternativeBookingInfo.dateTime.end = addDays(end, 2);
                            if (output.alternativeBookingInfo.dateTime.start < sessionStartedAt) {
                                output.alternativeBookingInfo.dateTime.start = new Date(sessionStartedAt);
                            }
                            if (output.alternativeBookingInfo.dateTime.end > decideMaxDate(sessionStartedAt)) {
                                output.alternativeBookingInfo.dateTime.end = decideMaxDate(sessionStartedAt);
                            }
                        }
                        if (timesWiden === 1) {
                            output.alternativeBookingInfo.dateTime.start = null;
                            output.alternativeBookingInfo.dateTime.end = null;
                        }
                        break;
                    case 'place':
                        if (timesWiden === 1) {
                            output.alternativeBookingInfo.place = null;
                        }
                        break;
                    case 'cinema':
                        if (timesWiden === 1) {
                            output.alternativeBookingInfo.cinema = [];
                        }
                        break;
                    case 'experience':
                        delete output.alternativeBookingInfo.experience;
                        break;
                    default:
                        break;
                }
            }
            timesWiden++;
            const { combinedQuery: newCombinedQuery, availabilityQuery: newAvailabilityQuery } = makeDbQuery(output.alternativeBookingInfo);
            alternatives = await COLLECTIONS.showtimes.findOne({ ...newCombinedQuery, ...newAvailabilityQuery });
        }
    }

    return output;
}
