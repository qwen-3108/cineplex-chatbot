const axios = require('axios');
const { TELEGRAM, MAIN_STATUS } = require('../../@global/CONSTANTS');
const makeDateTimePhrase = require('../../@util/makeDateTimePhrase');

module.exports = async function toFallback({ chat_id, currentSession }) {

    const { status, bookingInfo, counter } = currentSession;

    if (counter.fallbackCount > 2) return;

    const config = {
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/sendMessage',
        data: {
            chat_id,
            text: '',
            parse_mode: 'Markdown'
        }
    };

    if (counter.fallbackCount === 2) {
        if (status.main === MAIN_STATUS.COMPLETE || status.main === MAIN_STATUS.CANCELLED) return;
        config.data.text = "I think I'm not trained to handle this request yet. 😥 Would you contact our human assistants at 1111 1111, please? They will do their best to help";
    }

    if (counter.fallbackCount === 1) {
        switch (status.main) {
            case MAIN_STATUS.PROMPT_MOVIE:
                config.data.text = "Hmm I don't get you? To see the full list of now showing movie, type \n\`@cathay_sg_bot now showing\`";
                break;
            case MAIN_STATUS.PROMPT_DATETIME:
                config.data.text = "Um that does not sound like a date? You can say phrases like 'this evening', 'Tuesday', or 'tonight' to let me know when you'd like to watch the movie";
                break;
            case MAIN_STATUS.GET_CINEMA:
                config.data.text = "I'm sorry? What's the cinema or area you prefer again?";
                break;
            case MAIN_STATUS.GET_CINEMA_TIME_EXP:
            case MAIN_STATUS.GET_TIME_EXP:
            case MAIN_STATUS.GET_EXP:
                config.data.text = `Sur- Sorry, what? If you'd still like to get tickets for ${bookingInfo.movie.title} ${makeDateTimePhrase(bookingInfo.dateTime)}, please pick one from the list in 'Showtime' button so we can move on to choosing the seats`;
                break;
            case MAIN_STATUS.CHOOSE_SEAT:
                if (bookingInfo.ticketing.length > 1 && bookingInfo.ticketing.every(selection => !selection.isSelected)) {
                    config.data.text = "I think I missed that. If you've decided which showtime to go, use its 'Pick Seat' button to let me know and we'll start choosing seats'"
                } else {
                    config.data.text = "I think I missed that. What's your preferred seat again? Let me know the seat numbers or range, like 'H1 to H4'"
                }
                break;
            case MAIN_STATUS.AWAIT_PAYMENT:
                config.data.text = "Sorry...? If you wish to edit your order, simply let me know what movie/time/place you'd like to switch to :)";
                break;
            case MAIN_STATUS.COMPLETE:
            case MAIN_STATUS.CANCELLED:
                config.data.text = "I think I'm not trained to handle this request yet 😥 Would you contact our human assistants at 1111 1111, please? They will do their best to help";
                break;
            case null:
                config.data.text = "Currently I'm not good at handling any other requests besides ticket purchasing. If you would like to watch a movie but not sure what's available or when, simply tell me 'you want to watch a movie' and we can carry on from there :)";
                break;
            default:
                throw `Unrecognized status ${JSON.stringify(status)} in fallback`;
        }
    }

    await axios(config);

}