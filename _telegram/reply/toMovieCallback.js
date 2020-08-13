const { COLLECTIONS } = require('../../@global/COLLECTIONS');
const post = require('../post');

module.exports = { showMovieDetail, hideMovieDetail, howToFilter };

async function showMovieDetail(inline_message_id, movie) {

    const { query } = await COLLECTIONS.chosenInlineResultCache.findOne({ _id: inline_message_id });
    const { _id, title, director, cast, synopsis, runtime } = movie;

    const text = `*${title}* · ${runtime} mins\n\n🎬 Director\n${director.join()}\n\n🎭 Cast\n${cast.join(', ')}\n\n💬 Synopsis\n${synopsis}`;
    const reply_markup = {
        inline_keyboard: [[
            { text: 'Back to List', switch_inline_query_current_chat: query },
            { text: 'Less Info', callback_data: `movieId =${_id} hide=` },
            { text: 'Showtime', callback_data: `movieId =${_id} showtime=` }]]
    };
    const parse_mode = 'Markdown';

    await post.editMessageText(inline_message_id, text, { reply_markup, parse_mode });
    await COLLECTIONS.chosenInlineResultCache.updateOne({ _id: inline_message_id }, { $set: { state: "show" } });
}

async function hideMovieDetail(inline_message_id, movie) {

    const { query } = await COLLECTIONS.chosenInlineResultCache.findOne({ _id: inline_message_id });
    const { _id, title, genre, language, rating, trailer } = movie;

    const genreStr = genre.join(', ');
    const formatGenreStr = genreStr[0] + genreStr.slice(1).toLowerCase();
    const trailerStr = trailer !== null && trailer !== undefined ? `[Trailer ↗](${trailer})` : '';

    const text = `*${title}* ${trailerStr}\nLanguage: ${language}\nGenre: ${formatGenreStr}\nRating: ${rating}`;
    const reply_markup = {
        inline_keyboard: [[
            { text: 'Back to List', switch_inline_query_current_chat: query },
            { text: 'More Info', callback_data: `movieId =${_id} show=` },
            { text: 'Showtime', callback_data: `movieId =${_id} showtime=` }]]
    };
    await post.editMessageText(inline_message_id, text, { parse_mode: 'Markdown', reply_markup });

    // await COLLECTIONS.chosenInlineResultCache.updateOne({ _id: inline_message_id, state: "hide" });
    await COLLECTIONS.chosenInlineResultCache.updateOne({ _id: inline_message_id }, { $set: { state: "hide" } });
}

async function howToFilter(inline_message_id, movieId, movieTitle) {

    const { query, state } = await COLLECTIONS.chosenInlineResultCache.findOne({ _id: inline_message_id });
    const optionText = state === "show" ? "More Info" : "Less Info";

    const text = `Tap the 'Showtime' button again and type your preferred time and/or location to filter showtimes, e.g.:\n@cathay_sg_bot ${movieTitle} tomorrow evening near bkt batok\n(Or simply ask me 👩🏻‍💻)`;
    const reply_markup = {
        inline_keyboard: [[
            { text: 'Back to List', switch_inline_query_current_chat: query },
            { text: optionText, callback_data: `movieId =${movieId} ${state}=` },
            { text: 'Showtime', switch_inline_query_current_chat: movieTitle }]]
    };
    await post.editMessageText(inline_message_id, text, { reply_markup });

}