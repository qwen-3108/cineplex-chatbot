const { INLINE_KEYBOARD } = require('../../@global/CONSTANTS');
const LOGS = require('../../@global/LOGS');
const Phrases = require('../../@global/PHRASES');
const calculatePrice = require('../../@util/calculatePrice');
const post = require('../post');
const decideMaxDatePhrase = require('../../@util/decideMaxDatePhrase');
const makeDetailsStr = require('../../@util/makeDetailsStr');

module.exports = { getMovie, getDateTime, getCinema, getExactSlot, getExperienceOnly, confirmProceed };

async function getMovie(chat_id, text) {

    const reply = Phrases.ACKNOWLEDGEMENT(text) + 'For which movie?';
    const replyMarkup = { inline_keyboard: [[INLINE_KEYBOARD.MOVIE]] };
    await post.sendMessage(chat_id, reply, { replyMarkup });

}

async function getDateTime(chat_id, text, maxDate) {

    const reply = Phrases.ACKNOWLEDGEMENT(text) + `Around when? Schedules are updated until ${decideMaxDatePhrase(maxDate)}`;
    await post.sendMessage(chat_id, reply);

}

async function getCinema(chat_id, text, bookingInfo, cacheIdentifier) {

    const reply = `${Phrases.ACKNOWLEDGEMENT(text)}Any specific location in mind? These cinemas have tickets ${makeDetailsStr(bookingInfo)}. Pick one or simply tell me your preferred area :) like "near Jurong East"`;
    const replyMarkup = {
        inline_keyboard: [[{ text: 'Cinemas', switch_inline_query_current_chat: cacheIdentifier }]]
    };
    await post.sendMessage(chat_id, reply, { replyMarkup });

}

async function getExactSlot(chat_id, text, bookingInfo, cacheIdentifier) {

    const reply = Phrases.ACKNOWLEDGEMENT(text) + `Here are the showtimes ${makeDetailsStr(bookingInfo)}. ` + Phrases.PREFERENCE();
    const replyMarkup = {
        inline_keyboard: [[{ text: 'Showtimes', switch_inline_query_current_chat: cacheIdentifier }]]
    };
    await post.sendMessage(chat_id, reply, { replyMarkup });

}

async function getExperienceOnly(chat_id, text, bookingInfo, showtimes, cacheIdentifier) {

    const { movie, cinema, dateTime } = bookingInfo;

    let regularPrice;
    let platinumPrice;
    for (let i = 0; i < showtimes.length; i++) {
        const showtime = showtimes[i];
        const entry = { movie, ...showtime };
        if (showtime.isPlatinum) {
            platinumPrice = calculatePrice(entry);
        } else {
            regularPrice = calculatePrice(entry);
        }
    }

    const reply = Phrases.ACKNOWLEDGEMENT(text) + `We have both platinum (S$${platinumPrice.toFixed(2)}) and regular (S$${regularPrice.toFixed(2)}) tickets ${makeDetailsStr(bookingInfo, { ignoreExperience: true })}. Which ticket type would you like to get?`;
    const replyMarkup = {
        inline_keyboard: [[{ text: 'Experiences', switch_inline_query_current_chat: cacheIdentifier }]]
    };
    await post.sendMessage(chat_id, reply, { replyMarkup });
}

async function confirmProceed(chat_id, bookingInfo) {

    const { movie, experience, cinema, dateTime } = bookingInfo;

    let experienceStr = '';
    if (experience === 'Platinum Movie Suites') experienceStr = '(platinum) ';
    if (experience === 'Regular') experienceStr = '(regular) ';

    const text = Phrases.POSITIVE() + `So I'll proceed to get tickets ${experienceStr}${makeDetailsStr(bookingInfo, { ignoreExperience: true })}?`;
    await post.sendMessage(chat_id, text);

}