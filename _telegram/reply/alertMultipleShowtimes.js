const post = require('../post');

module.exports = async function alertMultipleShowtimes(chat_id) {

    const text = "It seems like you've viewed multiple seating plans. Could you use the 'Choose seats' button to let me know which is your final choice? Thanks :)";
    await post.sendMessage(chat_id, text);

}