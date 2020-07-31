const axios = require('axios');
const Phrases = require('../../@global/PHRASES');
const mapDateTime = require('../../@util/mapDateTime');
const makeDateTimePhrase = require('../../@util/makeDateTimePhrase');
const makeSeatNumPhrase = require('../../@util/makeSeatNumPhrase');

module.exports = async function confirmDetails(chat_id, bookingInfo) {

    const seatNumbers = bookingInfo.seatNumbers;
    const { daysToDbDate, nextWeekAreDaysLessThan } = bookingInfo.dateTime;
    const selected = bookingInfo.ticketing.filter(selection => selection.isSelected);
    const { movie, cinema, isPlatinum, dateTime } = selected[0];

    const mappedDate = mapDateTime(dateTime, daysToDbDate, nextWeekAreDaysLessThan);
    const experienceStr = isPlatinum ? 'platinum ' : '';
    const ticketStr = seatNumbers.length > 1 ? 'tickets' : 'ticket';
    const seatStr = seatNumbers.length > 1 ? 'seats' : 'seat';
    const text = `Great! So ${seatNumbers.length} ${experienceStr}movie ${ticketStr} for ${movie.title} ${makeDateTimePhrase({ start: mappedDate, end: mappedDate })} at ${cinema}, ${seatStr} ${makeSeatNumPhrase(bookingInfo.seatNumbers)}. ${Phrases.DOUBLE_CHECK()}`

    axios({
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/sendMessage',
        data: { chat_id, text }
    }).catch(err => console.log(JSON.stringify(err.response.data)));
};