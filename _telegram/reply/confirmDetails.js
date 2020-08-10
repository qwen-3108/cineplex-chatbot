const Phrases = require('../../@global/PHRASES');
const makeDateTimePhrase = require('../../@util/makeDateTimePhrase');
const mapDateTime = require('../../@util/mapDateTime');
const makeSeatNumPhrase = require('../../@util/makeSeatNumPhrase');
const post = require('../post');

module.exports = async function confirmDetails(chat_id, bookingInfo) {

    const seatNumbers = bookingInfo.seatNumbers;
    const selected = bookingInfo.ticketing.filter(selection => selection.isSelected);
    const { movie, cinema, isPlatinum, dateTime } = selected[0];

    const mappedDate = mapDateTime(dateTime, bookingInfo.dateTime.sessionStartedAt);
    const experienceStr = isPlatinum ? 'platinum ' : '';
    const ticketStr = seatNumbers.length > 1 ? 'tickets' : 'ticket';
    const seatStr = seatNumbers.length > 1 ? 'seats' : 'seat';
    const text = `Great! So ${seatNumbers.length} ${experienceStr}movie ${ticketStr} for ${movie.title} ${makeDateTimePhrase({ start: mappedDate, end: mappedDate })} at ${cinema}, ${seatStr} ${makeSeatNumPhrase(bookingInfo.seatNumbers)}. ${Phrases.DOUBLE_CHECK()}`

    await post.sendMessage(chat_id, text);

};