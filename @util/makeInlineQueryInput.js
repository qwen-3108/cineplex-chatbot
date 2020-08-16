const mapDateTime = require("./mapDateTime");
const makeDateTimePhrase = require("./makeDateTimePhrase");

module.exports = function makeInlineQueryInput(alternativeQuery, bookingInfo) {

    console.log(`Making inline query input. alternativeQuery received: ${JSON.stringify(alternativeQuery)}`);

    const alternativeSearchStr = [];

    for (const prop in alternativeQuery) {
        switch (prop) {
            case '$or': {
                let date = { start: null, end: null };
                const [week1, week2] = alternativeQuery.$or;
                const week1Start = week1.dateTime.$gte;
                const week2End = week2.dateTime.$lte;
                date.start = mapDateTime(week1Start, bookingInfo.dateTime.sessionStartedAt);
                date.end = mapDateTime(week2End, bookingInfo.dateTime.sessionStartedAt);
                date.sessionStartedAt = bookingInfo.dateTime.sessionStartedAt;
                alternativeSearchStr.push(makeDateTimePhrase(date));
                break;
            }
            case 'dateTime': {
                const { $gte, $lte } = alternativeQuery.dateTime;
                const start = mapDateTime($gte, bookingInfo.dateTime.sessionStartedAt);
                const end = mapDateTime($lte, bookingInfo.dateTime.sessionStartedAt);
                const dateTimeSearchStr = makeDateTimePhrase({ start, end, sessionStartedAt: bookingInfo.dateTime.sessionStartedAt }, { lite: true });
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
    console.log(`Inline query input: ${alternativeSearchStr}`);
    return alternativeSearchStr.join(' ');

}