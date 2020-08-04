const axios = require('axios');
const { addDays } = require('date-fns');
const getShowTimes = require('../../_database/query/getShowtimes');
const assignDateTime = require('../../@util/assignDateTime');

module.exports = async function getOperatingHours(chat_id, extractedInfo){

    console.log('-----Getting operating hours-----')
    const cinema = extractedInfo['cinema'];
    const dateTime = assignDateTime(extractedInfo['date-time']);

    let text = '';
    if(cinema == '' || dateTime.start == null){
        text = 'We have different operating hours at different location and different day, as '+
        'we open half an hour before the first showtime, and close half an hour after the last showtime. '+
        'I could provide a more specific answer if you tell me the cineplex and the date you plan to pay us a visit :) ';
    }else{

        dateTime.start.setHours(6,0,0);
        dateTime.end = addDays(dateTime.start, 1);
        const tempBookingInfo = {movie: {id: null}, cinema: [cinema], dateTime: dateTime};
        const { showtimes } = await getShowTimes(tempBookingInfo, {projection: {movieId: 1, dateTime: 1}});

        const openingTime = showtimes[0].dateTime.toLocaleTimeString();
        const closingTime = showtimes[showtimes.length-1].dateTime.toLocaleTimeString();
        const dayName = dateTime.start.toLocaleDateString('en-US', {weekday: 'long'});
        text = 'Ah I am so glad to answer this. '+
        `On ${dayName} our cinema at ${cinema} opens from ${openingTime} to ${closingTime}. `+
        'Looking forward to see you there! (blink!)';
        // if date beyond confirmed schedule
        // text = 'Oh we still don\'t have a confirmed schedule for the date you asked. '
    }
    console.log("Operating hours respond: ", text);

    const config = {
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/sendMessage',
        data: {
            chat_id,
            text: text,
        }
    };
    axios(config).catch(err => console.log(JSON.stringify(err.response.data)));
}