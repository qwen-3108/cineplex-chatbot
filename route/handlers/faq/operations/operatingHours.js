const sendMessage = require("../../../../_telegram/post/sendMessage");
const getShowTimes = require('../../../../_database/query/getShowtimes');
const assignDateTime = require('../../../../@util/assignDateTime');
const CONSTANTS = require('../../../../@global/CONSTANTS');
const makeDateTimePhrase = require("../../../../@util/makeDateTimePhrase");
const { addDays, addMinutes, subMinutes } = require("date-fns");

const isYesNo = function (text) {
    return CONSTANTS.REGEX.IS_YES_NO.test(text);
}

const askAboutOpen = function (text) {
    const regex = /(?:open|from|am)/i;
    return regex.test(text);
}

const askAboutClose = function (text) {
    const regex = /(?:close|until|till|still)/i;
    return regex.test(text);
}

const extractTime = function (dateTime) {
    return [
        dateTime.getHours(),
        dateTime.getMinutes()
    ];
}

// t1, t2 are arrays of [hour, minute]
const isBefore = function (t1, t2) {
    if (t1[0] < t2[0]) {
        return true;
    } else if (t1[0] > t2[0]) {
        return false;
    } else if (t1[1] < t2[1]) {
        return true;
    } else {
        return false;
    }
}

module.exports = async function operatingHours(chatId, text, extractedInfo) {

    console.log('-----Getting operating hours-----')
    const cinema = extractedInfo['cinema'];
    const dateTime = assignDateTime(extractedInfo['date-time']);

    let reply = '';
    if (cinema == '' || dateTime.start === null) {
        reply = 'Our box office opens half an hour before the earliest movie of the day and ' +
            'closes half an hour after the last movie of the day, which is generally from 9:30am to 4:30am of the next day';
    } else {

        const dateTimePhrase = makeDateTimePhrase(dateTime);

        // calculate operating hours of the date
        const dateTimeCopy = {};
        dateTimeCopy.start = new Date(dateTime.start.getTime());
        dateTimeCopy.start.setHours(6, 0, 0);
        dateTimeCopy.end = addDays(dateTimeCopy.start, 1);
        const tempBookingInfo = { movie: { id: null }, cinema: [cinema], dateTime: dateTimeCopy };
        const { showtimes } = await getShowTimes(tempBookingInfo, { projection: { movieId: 1, dateTime: 1 } });

        if (showtimes.length === 0) {
            if (isYesNo(text)) {
                reply = 'Nope. ';
            }
            reply += `The box office at ${cinema} does not operate ${dateTimePhrase}. `;

        } else {
            const lastShowtime = showtimes[showtimes.length - 1].dateTime;
            const movieDuration = 120;  // minutes

            console.log("lastShowTime: ", lastShowtime);
            console.log("firstShowTime: ", showtimes[0].dateTime);
            const closingTime = addMinutes(lastShowtime, movieDuration + 30);
            const openingTime = subMinutes(showtimes[0].dateTime, 30);

            // if time not specified
            if (dateTime.start.toLocaleTimeString() === "12:00:00 AM" && dateTime.end.toLocaleTimeString() === "11:59:59 PM") {
                if (askAboutClose(text)) {
                    reply += `Our box office at ${cinema} will be open until ${closingTime.toLocaleTimeString()} ${dateTimePhrase}`;
                } else if (askAboutOpen(text)) {
                    reply += `Our box office at ${cinema} will be open from ${openingTime.toLocaleTimeString()} ${dateTimePhrase}`;
                } else {
                    if (isYesNo(text)) {
                        reply = "Yep. ";
                    }
                    reply += `The box office at ${cinema} will be open from ${openingTime.toLocaleTimeString()} to ${closingTime.toLocaleTimeString()} ${dateTimePhrase} `
                }
                // time specified, assume YesNo question
            } else {
                if (isBefore(extractTime(dateTime.start), extractTime(openingTime))) {
                    reply = `Nope, the box office at ${cinema} will be open after ${openingTime.toLocaleTimeString()} ${dateTimePhrase}, half an hour before the first movie of the day `;
                } else if (isBefore(extractTime(closingTime), extractTime(dateTime.start))) {
                    reply = `Nope, the box office at ${cinema} will be closing at ${closingTime.toLocaleTimeString()} ${dateTimePhrase}, half an hour after the last movie of the day `;
                } else {
                    reply = `Yep it will `;
                }
            }
        }
    }
    console.log("Operating hours respond: ", reply);

    await sendMessage(chatId, reply);

}