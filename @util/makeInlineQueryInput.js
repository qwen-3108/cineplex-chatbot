const { addDays } = require('date-fns');
const makeDateTimePhrase = require("./makeDateTimePhrase");

module.exports = function makeInlineQueryInput(alternativeQuery, bookingInfo) {

    console.log('Making inline query input. alternativeQuery received: ', alternativeQuery);

    const alternativeSearchStr = [];

    for (const prop in alternativeQuery) {
        switch (prop) {
            case '$or': {
                let date = { start: null, end: null };
                const { daysToDbDate } = bookingInfo.dateTime;
                const [week1, week2] = alternativeQuery.$or;
                const week1Start = week1.dateTime.$gte;
                const week1End = week1.dateTime.$lte;
                const week2Start = week2.dateTime.$gte;
                const week2End = week2.dateTime.$lte;
                date.start = week1Start.getDay() === 0 ? addDays(week2Start, daysToDbDate) : addDays(week1Start, daysToDbDate);
                date.end = week1Start.getDay() === 0 ? addDays(week1End, daysToDbDate + 7) : addDays(week2End, daysToDbDate + 7);
                alternativeSearchStr.push(makeDateTimePhrase(date));
            }
            case 'dateTime': {
                const { daysToDbDate, nextWeekAreDaysLessThan } = bookingInfo.dateTime;
                const { $gte, $lte } = alternativeQuery.dateTime;
                const start = $gte.getDay() < nextWeekAreDaysLessThan ? addDays($gte, daysToDbDate + 7) : addDays($gte, daysToDbDate);
                const end = $lte.getDay() < nextWeekAreDaysLessThan ? addDays($lte, daysToDbDate + 7) : addDays($lte, daysToDbDate);
                const dateTimeSearchStr = makeDateTimePhrase({ start, end });
                alternativeSearchStr.push(dateTimeSearchStr);
            }
            case 'isPlatinum':
                if (alternativeQuery.isPlatinum) alternativeSearchStr.push('platinum');
                break;
            case 'cinema':
                if (alternativeQuery.cinema.$in.length === 1) {
                    alternativeSearchStr.push(alternativeQuery.cinema.$in[0]);
                } else {
                    alternativeSearchStr.push(bookingInfo.place);
                }
                break;
            case 'movieId':
                alternativeSearchStr.push(bookingInfo.movie.title.toLowerCase());
            default:
                break;
        }
    }
    console.log('Inline query input: ', alternativeSearchStr);
    return alternativeSearchStr.join(' ');

}