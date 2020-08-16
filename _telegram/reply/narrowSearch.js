const post = require('../post');

module.exports = async function narrowSearch(chat_id, bookingInfo) {

    const { place, cinema } = bookingInfo;

    text = place === null && cinema.length === 0 ? 'Lemme check. Any preferred time/area?' : 'Lemme check. Any preferred time?';

    await post.sendMessage(chat_id, text);

}