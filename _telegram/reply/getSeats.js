const makeDateTimePhrase = require('../../@util/makeDateTimePhrase');
const mapDateTime = require('../../@util/mapDateTime');
const sendMessage = require('../post/sendMessage');

module.exports = async function getSeats(chat_id, bookingInfo) {

    const { daysToDbDate, nextWeekAreDaysLessThan } = bookingInfo.dateTime;
    const selected = bookingInfo.ticketing.filter(selection => selection.isSelected);
    const { movie, cinema, dateTime, isPlatinum } = selected[0];
    const mappedDate = mapDateTime(dateTime, daysToDbDate, nextWeekAreDaysLessThan);
    const ticketStr = isPlatinum ? 'Platinum tickets' : 'Tickets';

    const text = `Got it. ${ticketStr} for ${movie.title} ${makeDateTimePhrase({ start: mappedDate, end: mappedDate })} at ${cinema}. What are your preferred seats?`;
    await sendMessage(chat_id, text);

}