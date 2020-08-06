const { INLINE_KEYBOARD } = require('../../@global/CONSTANTS');
const sendMessage = require('../post/sendMessage');

module.exports = { faqNowShowing, faqCancelBooking, faqModifyBooking, faqAdvanceBooking, faqMovieScheduleUpdate };

async function faqNowShowing(chat_id){

    const text = 'Here’s a list of all movies showing at our cinemas 😁 Tap the button to view 👇🏻';
    const replyMarkup = { inline_keyboard: [[INLINE_KEYBOARD.MOVIE]] };
    await sendMessage(chat_id, text, {replyMarkup});

}

async function faqModifyBooking(chat_id, extractedInfo) {

    const { movie, cinema } = extractedInfo;
    const hasDateTime = extractedInfo['date-time'].length != 0;
    let text = '';
    if(hasDateTime || movie != '' || cinema != ''){
        text = 'My apologies, I can’t handle booking modification requests yet so please visit our box office counters to get assistance. '+
                'But work is underway so I’ll be able to process such requests very soon! :)';
    }else{
        text = 'Yep, you may change to another showtime, but only for the same movie and at the same cinema. '+
                'Currently that can only be done at our box office counter, not later than 2 hours before the movie. '+
                'But work is underway so you’ll be able to modify your bookings through me very soon! :)';
    }
    await sendMessage(chat_id, text);

}

async function faqCancelBooking(chat_id) {

    const text = 'Unfortunately all tickets purchased are non-cancellable and non-refundable. Thank you for your kind understanding';
    await sendMessage(chat_id, text);

}

async function faqAdvanceBooking(chat_id) {

    const text = 'One week in advance. Any movie you’d like me to check now? :)';
    const replyMarkup = { inline_keyboard: [[INLINE_KEYBOARD.MOVIE]] };
    await sendMessage(chat_id, text, {replyMarkup});

}

async function faqMovieScheduleUpdate(chat_id) {

    const text = 'Showtimes are usually released one week before the actual showtime. Any movie you’d like me to check now?';
    const replyMarkup = { inline_keyboard: [[INLINE_KEYBOARD.MOVIE]] };
    await sendMessage(chat_id, text, {replyMarkup});

}
