const { MAIN_STATUS } = require('../../@global/CONSTANTS');
const Phrases = require('../../@global/PHRASES');
const makeDateTimePhrase = require('../../@util/makeDateTimePhrase');
const post = require('../post');

module.exports = async function toFallback({ chat_id, currentSession }) {

    const { status, bookingInfo, counter } = currentSession;

    if (counter.fallbackCount > 2) return;

    let text = '';

    if (counter.fallbackCount === 2) {
        if (status.main === MAIN_STATUS.COMPLETE || status.main === MAIN_STATUS.CANCELLED) return;
        text = "I think I'm not trained to handle this request yet. 😥 Would you contact our human assistants at 1111 1111, please? They will do their best to help";
    }

    if (counter.fallbackCount === 1) {
        switch (status.main) {
            case MAIN_STATUS.NARROW_SEARCH:
                text = Phrases.DONT_UNDERSTAND() + "Let me know if you have any time/place preferences, else you could also say things like 'not particularly', then I will get back to you with all showtimes available :)";
                break;
            case MAIN_STATUS.PROMPT_MOVIE:
                text = Phrases.DONT_UNDERSTAND() + "To see the full list of now showing movie, type \n\`@cathay_sg_bot now showing\`";
                break;
            case MAIN_STATUS.PROMPT_DATETIME:
                text = "Um that does not sound like a date? You can say phrases like 'this evening', 'Tuesday', or 'tonight' to let me know when you'd like to watch the movie";
                break;
            case MAIN_STATUS.GET_CINEMA:
                text = Phrases.DONT_UNDERSTAND() + "What's the cinema or area you prefer again? :)";
                break;
            case MAIN_STATUS.GET_CINEMA_TIME_EXP:
            case MAIN_STATUS.GET_TIME_EXP:
                text = Phrases.DONT_UNDERSTAND() + `If you'd still like to get tickets for ${bookingInfo.movie.title} ${makeDateTimePhrase(bookingInfo.dateTime)}, kindly tap the 'Showtime' button and pick one from the list :)`;
                break;
            case MAIN_STATUS.GET_EXP:
                text = Phrases.DONT_UNDERSTAND() + "Do you prefer the regular or platinum showtime? :)";
                break;
            case MAIN_STATUS.CHOOSE_SEAT:
                if (bookingInfo.ticketing.length > 1 && bookingInfo.ticketing.every(selection => !selection.isSelected)) {
                    text = "I think I missed that. If you've decided which showtime to go, kindly tap its 'Choose Seat' button so I know how to proceed :)"
                } else {
                    text = "I think I missed that. What's your preferred seat again? Let me know the seat numbers or range, like 'H1 to H4'"
                }
                break;
            case MAIN_STATUS.CONFIRM_PROCEED:
            case MAIN_STATUS.CONFIRM_DETAILS:
            case MAIN_STATUS.AWAIT_PAYMENT:
                text = Phrases.DONT_UNDERSTAND() + "If you change your mind, just let me know the new movie/time/place you are considering :)";
                break;
            case MAIN_STATUS.COMPLETE:
            case MAIN_STATUS.CANCELLED:
                text = "I think I'm not trained to handle this request yet 😥 Would you contact our human assistants at 1111 1111, please? They will do their best to help";
                break;
            case null:
                text = "Currently I'm not good at handling any other requests besides ticket purchasing. If you would like to watch a movie but not sure what's available or when, simply tell me 'you want to watch a movie' and we can carry on from there :)";
                break;
            default:
                throw `Unrecognized status ${JSON.stringify(status)} in fallback`;
        }
    }

    await post.sendMessage(chat_id, text, { parseMode: 'Markdown' });

}