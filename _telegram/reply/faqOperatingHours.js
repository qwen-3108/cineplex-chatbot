const axios = require('axios');
const { addDays, addMinutes, isBefore } = require('date-fns');
const getShowTimes = require('../../_database/query/getShowtimes');
const assignDateTime = require('../../@util/assignDateTime');
const isYesNo = require('../../@util/isYesNo');

module.exports = async function faqOperatingHours(chat_id, extractedInfo, text){

    console.log('-----Getting operating hours-----')
    const cinema = extractedInfo['cinema'];
    const dateTime = assignDateTime(extractedInfo['date-time']);

    let reply = '';
    if(cinema == '' || dateTime.start == null){
        reply = 'Our box office opens half an hour before the earliest movie of the day and '+
                'closes half an hour after the last movie of the day, which is generally from 9:30am to 4:30am of the next day';
    }else{

        const dateTimeCopy = JSON.parse(JSON.stringify(dateTime));

        // calculate operating hours of the date
        dateTimeCopy.start.setHours(6,0,0);
        dateTimeCopy.end = addDays(dateTime.start, 1);
        const tempBookingInfo = {movie: {id: null}, cinema: [cinema], dateTime: dateTimeCopy};
        const { showtimes } = await getShowTimes(tempBookingInfo, {projection: {movieId: 1, dateTime: 1}});

        if(showtimes.length == 0){
            if(isYesNo(text)){
                reply = 'Nope. ';
            }
            reply += 'Our box office does not operate on this date. ';

        }else{
            const lastShowtime = showtimes[showtimes.length-1].dateTime;
            const movieDuration = 120;  // minutes
            const closingTime = addMinutes(lastShowtime, movieDuration+30);
            const openingTime = addMinutes(showtimes[0].dateTime, -30);
            
            // if time not specified
            if(dateTime.start.toLocaleTimeString() == "12:00:00 AM" && dateTime.end.toLocaleTimeString() == "11:59:59 PM"){
                if(isYesNo(text)){
                    reply = "Yep. ";
                }
                reply += `Our box office operates from ${openingTime.toLocaleTimeString()} to ${closingTime.toLocaleTimeString()} on this day. `
            // time specified, assume YesNo question
            }else{
                if(isBefore(dateTime.start, openingTime)){
                    reply = `No, our box office at ${cinema} opens after ${openingTime} `;
                }else if(isBefore(closingTime, dateTime.end)){
                    reply = `No, our box office at ${cinema} closes at ${openingTime} `;
                }else{
                    reply = `Yep, our box office at ${cinema} is opening at ${dateTime.start.toLocaleTimeString()} `;
                }
            }
        }
    }
    console.log("Operating hours respond: ", reply);

    const config = {
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/sendMessage',
        data: {
            chat_id,
            text: reply,
        }
    };
    await axios(config);
}