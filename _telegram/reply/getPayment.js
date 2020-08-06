const { format } = require('date-fns');
const Phrases = require('../../@global/PHRASES');
const calculatePrice = require('../../@util/calculatePrice');
const mapDateTime = require('../../@util/mapDateTime');
const sendMessage = require('../post/sendMessage');
const sendInvoice = require('../post/sendInvoice');

module.exports = async function getPayment(chatId, bookingInfo) {
    //make & send invoice
    const invoice = makeInvoice(bookingInfo);
    const photoUrl = 'https://cdn.dribbble.com/users/2108918/screenshots/6414729/popcorn2-_recovered_.jpg';
    await sendInvoice(chatId, invoice, {photoUrl});
    
    //send msg
    const text = Phrases.POSITIVE() + "I've just sent you a payment link, kindly review the order details. Once you've completed the payment, we'll send you your digital tickets";
    await sendMessage(chat_id, text);

};

/*---helper functions--*/

function makeInvoice(bookingInfo) {

    const { daysToDbDate, nextWeekAreDaysLessThan } = bookingInfo.dateTime;
    const seatNumbers = bookingInfo.seatNumbers;
    const selected = bookingInfo.ticketing.filter(selection => selection.isSelected);
    const { movie, cinema, isPlatinum, dateTime } = selected[0];

    const title = seatNumbers.length > 1 ? 'Movie Tickets' : 'Movie Ticket';
    const mappedDate = mapDateTime(dateTime, daysToDbDate, nextWeekAreDaysLessThan);
    const unitPrice = calculatePrice(selected[0]);

    const description = `·  ${movie.title}\n·  ${format(mappedDate, 'd MMMM y')}, ${format(mappedDate, 'h aa')}\n·  ${cinema}${isPlatinum ? '\n·  (Platinum Movie Suites)' : ''}\n·  ${seatNumbers.length > 1 ? 'Seats' : 'Seat'} ${seatNumbers.join(', ')}\n·  Unit price: $${unitPrice.toFixed(2)} `

    const label = `${isPlatinum ? 'Platinum' : 'Regular'} Ticket x ${seatNumbers.length} `;

    const amount = unitPrice * seatNumbers.length * 100;

    return ({
        title,
        description,
        prices: [{
            label,
            amount
        }],
    });
};
