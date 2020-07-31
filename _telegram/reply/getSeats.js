const axios = require('axios');
const makeDateTimePhrase = require('../../@util/makeDateTimePhrase');
const mapDateTime = require('../../@util/mapDateTime');

module.exports = async function getSeats(chat_id, bookingInfo) {

    const { daysToDbDate, nextWeekAreDaysLessThan } = bookingInfo.dateTime;
    const selected = bookingInfo.ticketing.filter(selection => selection.isSelected);
    const { movie, cinema, dateTime, isPlatinum } = selected[0];
    const mappedDate = mapDateTime(dateTime, daysToDbDate, nextWeekAreDaysLessThan);
    const ticketStr = isPlatinum ? 'Platinum tickets' : 'Tickets';

    const config = {
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/sendMessage',
        data: {
            chat_id,
            text: `Got it. ${ticketStr} for ${movie.title} ${makeDateTimePhrase({ start: mappedDate, end: mappedDate })} at ${cinema}. What are your preferred seats?`
        }
    }
    axios(config).catch(err => console.log(JSON.stringify(err.response.data)));

}