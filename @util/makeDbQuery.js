const { DATES_IN_DB } = require('../@global/CONSTANTS');
const { differenceInCalendarDays, addHours } = require('date-fns');
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

        //if ask for whole day, include time up till 6am of second day
        if (isWholeDay) {
            //if day is today, trim away time before ask time
            if (isToday) {
                console.log('isToday, trimming start time');
                console.log(`Enquiry hour: ${sessionStartedAt.getHours()}`);
                const sessionStartTime = sessionStartedAt.getHours();
                adjustedStart = new Date(start);
                adjustedStart.setHours(sessionStartTime);
                adjustedEnd = addHours(end, 6);
            } else {
                adjustedStart = addHours(start, 6);
                adjustedEnd = addHours(end, 6);
            }

        } else {
            adjustedStart = new Date(start);
            adjustedEnd = new Date(end);
        }

        //if end on next week overlapping date, trim time after sessionStartTime
        if (adjustedEnd.getDay() === sessionStartedAt.getDay() && differenceInCalendarDays(adjustedEnd, sessionStartedAt) !== 0) {
            const maxDate = decideMaxDate.date(sessionStartedAt);
            adjustedEnd.setHours(maxDate.getHours(), 59, 59);
        }

        console.log(`adjustedStart: ${adjustedStart}`);
        console.log(`adjustedEnd: ${adjustedEnd}`);

        //if startDay =/= endDay (e.g. weekend, night, adjusted whole day)
        const startDay = adjustedStart.getDay();
        const endDay = adjustedEnd.getDay();
        if (startDay !== endDay && startDay > endDay) {
            let day = startDay;
            const thisWeekArr = [day];
            const nextWeekArr = [];
            while ((day % 7) !== endDay) {
                day += 1;
                if (day % 7 < day) {
                    nextWeekArr.push(day % 7);
                } else {
                    thisWeekArr.push(day % 7);
                }
            }
            console.log(`thisWeekArr ${thisWeekArr}`);
            console.log(`nextWeekArr ${nextWeekArr}`);
            const thisWeekStartDateTime = new Date(DATES_IN_DB[thisWeekArr[0]]);
            thisWeekStartDateTime.setHours(adjustedStart.getHours());
            const thisWeekEndDateTime = new Date(DATES_IN_DB[thisWeekArr[thisWeekArr.length - 1]] + 'T23:59');
            const nextWeekStartDateTime = new Date(DATES_IN_DB[nextWeekArr[0]] + 'T00:00');
            const nextWeekEndDateTime = new Date(DATES_IN_DB[nextWeekArr[nextWeekArr.length - 1]]);
            nextWeekEndDateTime.setHours(adjustedEnd.getHours());
            dateTimeQuery = {
                $or: [
                    { dateTime: { $gte: thisWeekStartDateTime, $lte: thisWeekEndDateTime } },
                    { dateTime: { $gte: nextWeekStartDateTime, $lte: nextWeekEndDateTime } }
                ]
            };
        } else {
            const dbStart = new Date(DATES_IN_DB[startDay]); dbStart.setHours(adjustedStart.getHours());
            const dbEnd = new Date(DATES_IN_DB[endDay]); dbEnd.setHours(adjustedEnd.getHours());
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