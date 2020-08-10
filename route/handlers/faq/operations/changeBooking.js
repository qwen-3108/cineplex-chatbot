const post = require("../../../../_telegram/post");

module.exports = async function changeBooking(chatId, extractedInfo) {

    const { movie, cinema } = extractedInfo;
    const hasDateTime = extractedInfo['date-time'].length != 0;
    let text = '';
    if (hasDateTime || movie != '' || cinema != '') {
        text = 'My apologies, I can’t handle booking modification requests yet so please visit our box office counters to get assistance. ' +
            'But work is underway so I’ll be able to process such requests very soon! :)';
    } else {
        text = 'Yep, you may change to another showtime, but only for the same movie and at the same cinema. ' +
            'Currently that can only be done at our box office counter, not later than 2 hours before the movie. ' +
            'But work is underway so you’ll be able to modify your bookings through me very soon! :)';
    }
    await post.sendMessage(chatId, text);

}