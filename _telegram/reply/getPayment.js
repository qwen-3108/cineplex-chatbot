const axios = require('axios');
const { format } = require('date-fns');
const Phrases = require('../../@global/PHRASES');
const calculatePrice = require('../../@util/calculatePrice');
const mapDateTime = require('../../@util/mapDateTime');

module.exports = async function getPayment(chatId, bookingInfo) {
    //make & send invoice
    const invoice = makeInvoice(bookingInfo);
    const invoiceConfig = {
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/sendInvoice',
        data: {
            chat_id: chatId,
            provider_token: TELEGRAM.STRIPE_TOKEN,
            start_parameter: '123',
            payload: '.',
            currency: 'SGD',
            photo_url: 'https://cdn.dribbble.com/users/2108918/screenshots/6414729/popcorn2-_recovered_.jpg',
            need_name: true,
            need_phone_number: true,
            ...invoice
        }
    };
    await axios(invoiceConfig);
    //send msg
    const msgConfig = {
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/sendMessage',
        data: {
            chat_id: chatId,
            text: Phrases.POSITIVE() + "I've just sent you a payment link, kindly review the order details. Once you've completed the payment, we'll send you your digital tickets"
        }
    };
    await axios(msgConfig);
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
