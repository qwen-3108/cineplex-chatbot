const axios = require('axios');

module.exports = { faqCancelBooking, faqModifyBooking, faqAdvancedBooking };

async function faqCancelBooking(chat_id) {
    const config = {
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/sendMessage',
        data: {
            chat_id,
            text: 'You know, in our case, once a booking is made it is not cancellable nor refundable... '+
            'You could request to change the date/time of the movie though. Hope that helps.',
        }
    };
    axios(config).catch(err => console.log(JSON.stringify(err.response.data)));
}

async function faqModifyBooking(chat_id) {
    const config = {
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/sendMessage',
        data: {
            chat_id,
            text: 'You could change the date/time of the booking as long as it\'s 2 hrs before '+
            'the originally booked showtime. Just come to our Box Office of that location and '+
            'our staff would help you with that! Do note that there is a swop fee of $1.50 per '+
            'regular ticket, and $5.00 per platinum ticket. So... please make your bookings carefully :)',
        }
    };
    axios(config).catch(err => console.log(JSON.stringify(err.response.data)));
}

async function faqAdvancedBooking(chat_id) {
    const config = {
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/sendMessage',
        data: {
            chat_id,
            text: 'Oh yes. We update our schedules three times a week: Wednesday, Thursday, and Friday. '+
            'Generally, the update on Wed and Thu release new schedules for the day after, and the update '+
            'on Fri releases schedules till the next Wednesday (but it\'s also possible that the schedules '+
            'of a blockbuster movie are released earlier). And once the schedule is available, the showtimes '+
            'are open for booking~',
        }
    };
    axios(config).catch(err => console.log(JSON.stringify(err.response.data)));
}
