const { DATES_IN_DB } = require('../@global/CONSTANTS');
const { differenceInCalendarDays, addHours, isSameWeek } = require('date-fns');
const decideMaxDate = require('./decideMaxDate');

module.exports = function makeDbQuery(bookingInfo) {

    console.log('making dbQuery');
    const { movie, dateTime, cinema } = bookingInfo;

    //make query
    let movieQuery = {};
    let dateTimeQuery = {};
    let cinemaQuery = {};
    let experienceQuery = {};
    const availabilityQuery = { $expr: { $gt: ["$totalSeats", "$sold"] } };

    if (movie.id !== null) {
        movieQuery = { movieId: movie.id };
    }

    if (dateTime.start !== null) {

        console.log('bookingInfo/queryFiler has dateTime');
        console.log('dateTime: ', JSON.stringify(dateTime));
        const { start, end, sessionStartedAt } = dateTime;

        let adjustedStart;
        let adjustedEnd;

        const isWholeDay = start.getDay() === end.getDay() && start.getHours() === 0 && end.getHours() === 23;
        const isToday = start.toDateString() === sessionStartedAt.toDateString();

        //if dateTime.start is before session start, trim away time before ask time
        if (dateTime.start < sessionStartedAt) {
            console.log('dateTime.start is before sessionStartedAt, trimming start time');
            adjustedStart = new Date(sessionStartedAt);
        } else {
            console.log('dateTime.start is later than sessionStartedAt, no action required');
            adjustedStart = new Date(start);
        }

        //if ask for whole day, include time up till 6am of second day
        if (isWholeDay) {
            adjustedEnd = addHours(end, 6);
        } else {
            adjustedEnd = new Date(end);
        }

        //if end on next week overlapping date, trim time after sessionStartTime
        const maxDate = decideMaxDate(sessionStartedAt);
        if (adjustedEnd > maxDate) {
            adjustedEnd = maxDate;
        }

        console.log(`adjustedStart: ${adjustedStart}`);
        console.log(`adjustedEnd: ${adjustedEnd}`);
        const dayDiff = differenceInCalendarDays(adjustedEnd, adjustedStart);

        //if startDay =/= endDay (e.g. weekend, night, adjusted whole day)
        const startDay = adjustedStart.getDay();
        const endDay = adjustedEnd.getDay();
        if (dayDiff > 0 && startDay >= endDay) {
            console.log("startDay > endDay, spliting query..");
            const thisWeekStartDateTime = new Date(DATES_IN_DB[startDay]);
            thisWeekStartDateTime.setHours(adjustedStart.getHours(), adjustedStart.getMinutes(), adjustedStart.getSeconds());
            const thisWeekEndDateTime = new Date(DATES_IN_DB[6] + 'T23:59:59');
            const nextWeekStartDateTime = new Date(DATES_IN_DB[0] + 'T00:00:00');
            const nextWeekEndDateTime = new Date(DATES_IN_DB[endDay]);
            nextWeekEndDateTime.setHours(adjustedEnd.getHours(), adjustedEnd.getMinutes(), adjustedEnd.getSeconds());
            dateTimeQuery = {
                $or: [
                    { dateTime: { $gte: thisWeekStartDateTime, $lte: thisWeekEndDateTime } },
                    { dateTime: { $gte: nextWeekStartDateTime, $lte: nextWeekEndDateTime } }
                ]
            };

        } else {
            console.log("forming dateTime filter as usual");
            const dbStart = new Date(DATES_IN_DB[startDay]); dbStart.setHours(adjustedStart.getHours());
            const dbEnd = new Date(DATES_IN_DB[endDay]); dbEnd.setHours(adjustedEnd.getHours(), adjustedEnd.getMinutes(), adjustedEnd.getSeconds());
            dateTimeQuery = { dateTime: { $gte: dbStart, $lte: dbEnd } };
        }
    }

    if (bookingInfo.cinema.length !== 0) cinemaQuery = { cinema: { $in: cinema } };

    if (bookingInfo.experience !== undefined) {
        if (bookingInfo.experience === 'Platinum Movie Suites') experienceQuery = { isPlatinum: true };
        if (bookingInfo.experience === 'Regular') experienceQuery = { isPlatinum: false };
    }
    const combinedQuery = { ...movieQuery, ...dateTimeQuery, ...cinemaQuery, ...experienceQuery };

    console.log(`Update: Resulting query based on current info - ${JSON.stringify({ ...combinedQuery, ...availabilityQuery })}`);

    return ({ combinedQuery, availabilityQuery });
}