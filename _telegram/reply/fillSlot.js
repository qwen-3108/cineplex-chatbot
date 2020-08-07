const { INLINE_KEYBOARD } = require('../../@global/CONSTANTS');
const Phrases = require('../../@global/PHRASES');
const makeDateTimePhrase = require('../../@util/makeDateTimePhrase');
const calculatePrice = require('../../@util/calculatePrice');
const sendMessage = require('../post/sendMessage');
const decideMaxDate = require('../../@util/decideMaxDate');

module.exports = { getMovie, getDateTime, getCinema, getExactSlot, getExperienceOnly, confirmProceed };

async function getMovie(chat_id, text) {

    const reply = Phrases.ACKNOWLEDGEMENT(text) + 'For which movie?';
    const replyMarkup = { inline_keyboard: [[INLINE_KEYBOARD.MOVIE]] };
    await sendMessage(chat_id, reply, { replyMarkup });

}

async function getDateTime(chat_id, text, maxDate) {

    const reply = Phrases.ACKNOWLEDGEMENT(text) + `Around when? Showtimes are up until ${decideMaxDate.phrase(maxDate)}`;
    await sendMessage(chat_id, reply);

}

async function getCinema(chat_id, text, bookingInfo, cacheIdentifier) {

    const reply = `${Phrases.ACKNOWLEDGEMENT(text)}Any specific location in mind? These cinemas have tickets for ${bookingInfo.movie.title} ${makeDateTimePhrase(bookingInfo.dateTime)}. Pick one or simply tell me your preferred area :) like "near Jurong East"`;
    const replyMarkup = {
        inline_keyboard: [[{ text: 'Cinemas', switch_inline_query_current_chat: cacheIdentifier }]]
    };
    await sendMessage(chat_id, reply, { replyMarkup });

}

async function getExactSlot(chat_id, text, bookingInfo, cacheIdentifier) {

    const movieStr = bookingInfo.movie.title + ' ';

    let locationStr = '';
    if (bookingInfo.place !== null) {
        locationStr = `near ${bookingInfo.place}`;
    } else if (bookingInfo.cinema.length === 1) {
        locationStr = `at ${bookingInfo.cinema}`;
    } else {
        throw `getExactSlot.js - More than one cinema with no place value in bookingInfo`;
    }

    let dateTimeStr = '';
    if (bookingInfo.dateTime.start !== null) {
        dateTimeStr = makeDateTimePhrase(bookingInfo.dateTime);
    }

    const reply = Phrases.ACKNOWLEDGEMENT(text) + `Here are the showtimes ${locationStr} for ${movieStr}${dateTimeStr}. Which do you prefer?`;
    const replyMarkup = {
        inline_keyboard: [[{ text: 'Showtimes', switch_inline_query_current_chat: cacheIdentifier }]]
    };
    await sendMessage(chat_id, reply, { replyMarkup });

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

    const reply = Phrases.ACKNOWLEDGEMENT(text) + `We have both platinum (S$${platinumPrice.toFixed(2)}) and regular (S$${regularPrice.toFixed(2)}) tickets for ${movie.title} ${makeDateTimePhrase(dateTime)} at ${cinema}. Which ticket type would you like to get?`;
    const replyMarkup = {
        inline_keyboard: [[{ text: 'Experiences', switch_inline_query_current_chat: cacheIdentifier }]]
    };
    await sendMessage(chat_id, reply, { replyMarkup });
}

async function confirmProceed(chat_id, bookingInfo) {

    const { movie, experience, cinema, dateTime } = bookingInfo;

    let experienceStr = '';
    if (experience === 'Platinum Movie Suites') experienceStr = '(platinum) ';
    if (experience === 'Regular') experienceStr = '(regular) ';

    const text = Phrases.POSITIVE() + `So I'll proceed to get tickets ${experienceStr}for ${movie.title} ${makeDateTimePhrase(dateTime)} at ${cinema}?`;
    await sendMessage(chat_id, text);

}