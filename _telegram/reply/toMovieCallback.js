const axios = require('axios');
const { COLLECTIONS } = require('../../@global/COLLECTIONS');

module.exports = { showMovieDetail, hideMovieDetail, howToFilter };

async function showMovieDetail(inline_message_id, movie) {

    const { query } = await COLLECTIONS.chosenInlineResultCache.findOne({ _id: inline_message_id });
    const { _id, title, director, cast, synopsis, runtime } = movie;

    const text = `*${title}* · ${runtime} mins\n\n🎬 Director\n${director.join()}\n\n🎭 Cast\n${cast.join(', ')}\n\n💬 Synopsis\n${synopsis}`;

    const config = {
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/editMessageText',
        data: {
            inline_message_id,
            text,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [[
                    { text: 'Back to List', switch_inline_query_current_chat: query },
                    { text: 'Less Info', callback_data: `movieId =${_id} hide=` },
                    { text: 'Showtime', callback_data: `movieId =${_id} showtime=` }]]
            }
        }
    };
    axios(config).catch(err => console.log(JSON.stringify(err.response.data)));
    await COLLECTIONS.chosenInlineResultCache.updateOne({ _id: inline_message_id, state: "show" });
}

async function hideMovieDetail(inline_message_id, movie) {

    const { query } = await COLLECTIONS.chosenInlineResultCache.findOne({ _id: inline_message_id });
    const { _id, title, genre, language, rating, trailer } = movie;

    const genreStr = genre.join(', ');
    const formatGenreStr = genreStr[0] + genreStr.slice(1).toLowerCase();
    const trailerStr = trailer !== null && trailer !== undefined ? `[Trailer ↗](${trailer})` : '';

    const config = {
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/editMessageText',
        data: {
            inline_message_id,
            text: `*${title}* ${trailerStr}\nLanguage: ${language}\nGenre: ${formatGenreStr}\nRating: ${rating}`,
            parse_mode: 'Markdown',
            disable_web_page_preview: true,
            reply_markup: {
                inline_keyboard: [[
                    { text: 'Back to List', switch_inline_query_current_chat: query },
                    { text: 'More Info', callback_data: `movieId =${_id} show=` },
                    { text: 'Showtime', callback_data: `movieId =${_id} showtime=` }]]
            }
        }
    };
    axios(config).catch(err => console.log(JSON.stringify(err.response.data)));
    await COLLECTIONS.chosenInlineResultCache.updateOne({ _id: inline_message_id, state: "hide" });
}

async function howToFilter(inline_message_id, movieId, movieTitle) {

    const { query, state } = await COLLECTIONS.chosenInlineResultCache.findOne({ _id: inline_message_id });
    const optionText = state === "show" ? "More Info" : "Less Info";

    const config = {
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/editMessageText',
        data: {
            inline_message_id,
            text: `To check showtimes, tap 'Showtime' button again and enter your preferred time and/or location to find showtimes that meet your preferences, e.g.: @cathay_sg_bot ${movieTitle} tomorrow evening near bkt batok\n(Or simply ask me 👩🏻‍💻)`,
            reply_markup: {
                inline_keyboard: [[
                    { text: 'Back to List', switch_inline_query_current_chat: query },
                    { text: optionText, callback_data: `movieId =${movieId} ${state}=` },
                    { text: 'Showtime', switch_inline_query_current_chat: movieTitle }]]
            }
        }
    };
    axios(config).catch(err => console.log(JSON.stringify(err.response.data)));

}