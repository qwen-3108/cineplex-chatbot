const makeDateTimePhrase = require('../../@util/makeDateTimePhrase');
const mapDateTime = require('../../@util/mapDateTime');
const post = require('../post');

module.exports = async function getSeats(chat_id, bookingInfo) {

    const selected = bookingInfo.ticketing.filter(selection => selection.isSelected);
    const { movie, cinema, dateTime, isPlatinum } = selected[0];
    const mappedDate = mapDateTime(dateTime, bookingInfo.dateTime.sessionStartedAt);
    const ticketStr = isPlatinum ? 'Platinum tickets' : 'Tickets';

    const text = `Got it. ${ticketStr} for ${movie.title} ${makeDateTimePhrase(mappedDate, { sessionStartedAt: bookingInfo.dateTime.sessionStartedAt })} at ${cinema}. What are your preferred seats?`;
    await post.sendMessage(chat_id, text);

}