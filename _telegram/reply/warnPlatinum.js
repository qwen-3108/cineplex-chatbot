const axios = require('axios');
const Phrases = require('../../@global/PHRASES');
const makeDateTimePhrase = require('../../@util/makeDateTimePhrase');
const calculatePrice = require('../../@util/calculatePrice');


module.exports = async function warnPlatinum(chat_id, text, bookingInfo, schedule) {

    const { dateTime, isPlatinum } = schedule;
    const { movie } = bookingInfo;

    const unitPrice = await calculatePrice({ movie: movie, dateTime: dateTime, isPlatinum: isPlatinum });

    const config = {
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/sendMessage',
        data: {
            chat_id,
            text: Phrases.ACKNOWLEDGEMENT(text) + `I found showtimes for ${bookingInfo.movie.title} ${makeDateTimePhrase(bookingInfo.dateTime)} at ${bookingInfo.cinema}, but it's at our Platnum Movie Suites so each ticket costs SGD${unitPrice}). Is that alright for you?`
        }
    };
    axios(config).catch(err => console.log(JSON.stringify(err.response.data)));
}