const sendMessage = require("../../../../_telegram/post/sendMessage");
const getShowTimes = require('../../../../_database/query/getShowtimes');
const assignDateTime = require('../../../../@util/assignDateTime');
const CONSTANTS = require('../../../../@global/CONSTANTS');
const makeDateTimePhrase = require("../../../../@util/makeDateTimePhrase");
const isTimeLessThan = require('../../../../@util/isTimeLessThan');
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

module.exports = async function operatingHours(chatId, text, extractedInfo) {

    console.log('-----Getting operating hours-----')
    const cinema = extractedInfo['cinema'];
    let dateTime = {};
    if (extractedInfo['date-time'] != '') {
        dateTime = assignDateTime(extractedInfo['date-time']);
    } else {
        dateTime = { start: null, end: null };
    }

    let reply = '';
    if (cinema == '' || dateTime.start === null) {
        reply = 'Our box office opens half an hour before the earliest movie of the day and ' +
            'closes half an hour after the last movie of the day, which is generally from 9:30am to 4:30am of the next day';
    } else {

        const dateTimePhrase = makeDateTimePhrase(dateTime);

        // calculate operating hours of the date
        const tempBookingInfo = { movie: { id: null }, cinema: [cinema], dateTime: dateTime };
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
                if (isTimeLessThan(dateTime.start, openingTime)) {
                    reply = `Nope, the box office at ${cinema} will be open after ${openingTime.toLocaleTimeString()} ${dateTimePhrase}, half an hour before the first movie of the day `;
                } else if (isTimeLessThan(closingTime, dateTime.start)) {
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