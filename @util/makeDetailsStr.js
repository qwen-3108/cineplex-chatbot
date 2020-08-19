const makeDateTimePhrase = require("./makeDateTimePhrase");

module.exports = function makeDetailsStr(bookingInfo, options) {

    const { movie, dateTime, place, cinema, experience } = bookingInfo;

    let ignoreExperience = false;
    if (options !== undefined) {
        if (options.ignoreExperience !== undefined) {
            ignoreExperience = options.ignoreExperience;
        }
    }

    if (movie.title === null) {
        throw `movie title needed to make details str, got ${movie.title}`;
    }

    const movieStr = bookingInfo.movie.title;

    let dateTimeStr = '';
    let cinemaStr = '';
    let placeStr = '';
    let experienceStr = '';

    if (dateTime.start !== null) {
        dateTimeStr = ' ' + makeDateTimePhrase(dateTime);
    }

    if (place === null && cinema.length === 0) {
        //do nth
    } else if (place !== null) {
        placeStr = ` near ${place}`;
    } else if (cinema.length === 1) {
        cinemaStr = ` at ${cinema[0]}`;
    } else {
        throw `getExactSlot.js - More than one cinema with no place value in bookingInfo`;
    }

    if (experience === 'Platinum Movie Suites' && !ignoreExperience) {
        experienceStr = ' in Platinum Movie Suites';
    }

    return `for ${movieStr}${cinemaStr}${experienceStr}${dateTimeStr}${placeStr}`;

}