const { DATES_IN_DB } = require('../@global/CONSTANTS');

module.exports = function makeDbQuery(bookingInfo) {

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
        const startDay = dateTime.start.getDay();
        const endDay = dateTime.end.getDay();
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
            console.log('thisWeekArr', thisWeekArr);
            console.log('nextWeekArr', nextWeekArr);
            const thisWeekStartDateTime = new Date(DATES_IN_DB[thisWeekArr[0]] + 'T00:00');
            const thisWeekEndDateTime = new Date(DATES_IN_DB[thisWeekArr[thisWeekArr.length - 1]] + 'T23:59');
            const nextWeekStartDateTime = new Date(DATES_IN_DB[nextWeekArr[0]] + 'T00:00');
            const nextWeekEndDateTime = new Date(DATES_IN_DB[nextWeekArr[nextWeekArr.length - 1]] + 'T23:59');
            dateTimeQuery = {
                $or: [
                    { dateTime: { $gte: thisWeekStartDateTime, $lte: thisWeekEndDateTime } },
                    { dateTime: { $gte: nextWeekStartDateTime, $lte: nextWeekEndDateTime } }
                ]
            };
            // if (startDay === 6 && endDay === 0) { //special case for weekend mapping
            //     dateTimeQuery = { $or: [{ dateTime: { $gte: new Date(DATES_IN_DB[6] + 'T00:00'), $lte: new Date(DATES_IN_DB[6] + 'T23:59') } }, { dateTime: { $gte: new Date(DATES_IN_DB[0] + 'T00:00'), $lte: new Date(DATES_IN_DB[0] + 'T23:59') } }] };
        } else {
            const dbStart = new Date(DATES_IN_DB[startDay]); dbStart.setHours(dateTime.start.getHours());
            const dbEnd = new Date(DATES_IN_DB[endDay]); dbEnd.setHours(dateTime.end.getHours());
            dateTimeQuery = { dateTime: { $gte: dbStart, $lte: dbEnd } };
        }
    }

    if (bookingInfo.cinema.length !== 0) cinemaQuery = { cinema: { $in: cinema } };

    if (bookingInfo.experience !== undefined) {
        if (bookingInfo.experience === 'Platinum Movie Suites') experienceQuery = { isPlatinum: true };
        if (bookingInfo.experience === 'Regular') experienceQuery = { isPlatinum: false };
    }
    const combinedQuery = { ...movieQuery, ...dateTimeQuery, ...cinemaQuery, ...experienceQuery };

    console.log("Update: Resulting query based on current info - ", JSON.stringify({ ...combinedQuery, ...availabilityQuery }));

    return ({ combinedQuery, availabilityQuery });
}