const mapDateTime = require("./mapDateTime");
const makeDateTimePhrase = require("./makeDateTimePhrase");

module.exports = function makeInlineQueryInput(alternativeBookingInfo) {

    console.log(`Making inline query input. alternativeBookingInfo received: ${JSON.stringify(alternativeBookingInfo)}`);

    const movieStr = alternativeBookingInfo.movie.title.toLowerCase();
    const dateTimeStr = alternativeBookingInfo.dateTime.start === null ? '' : makeDateTimePhrase(alternativeBookingInfo.dateTime, { lite: true });
    let locationStr = "";
    if (alternativeBookingInfo.place === null && alternativeBookingInfo.cinema.length === 0) {
        //do nth
    } else if (alternativeBookingInfo.place !== null) {
        locationStr = alternativeBookingInfo.place;
    } else if (alternativeBookingInfo.cinema.length === 1) {
        locationStr = alternativeBookingInfo.cinema[0];
    }

    const experienceStr = alternativeBookingInfo.experience === 'Platinum Movie Suites' ? 'platinum' : '';

    const alternativeSearchStr = `${movieStr} ${dateTimeStr} ${locationStr} ${experienceStr}`;
    console.log(`Inline query input: ${alternativeSearchStr}`);

    return alternativeSearchStr;

}