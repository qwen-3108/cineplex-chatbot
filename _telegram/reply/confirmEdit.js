const Phrases = require('../../@global/PHRASES');
const makeDateTimePhrase = require('../../@util/makeDateTimePhrase');
const sendMessage = require('../post/sendMessage');

module.exports = async function confirmEdit(chat_id, text, bookingInfo) {

    const { movie, dateTime, place, cinema, experience } = bookingInfo;

    let reply;

    //make main part of reply
    const movieStr = movie.title === null ? 'movies' : movie.title;
    const dateTimeStr = dateTime.start === null ? '' : ' ' + makeDateTimePhrase(dateTime);
    let locationStr = '';
    if (place !== null) {
        locationStr = ' near ' + place;
    } else if (cinema.length === 1) {
        locationStr = ' at ' + cinema;
    } else if (cinema.length !== 0) {
        throw `confirmEdit.js - More than one cinema with no place value in bookingInfo`
    }
    const experienceStr = experience === 'Platinum Movie Suites' ? ' in Platinum Movie Suites' : '';
    const confirmPhraseBank = [
        `So I'll check tickets for ${movieStr}${dateTimeStr}${locationStr}${experienceStr}? `,
        `So tickets for ${movieStr}${dateTimeStr}${locationStr}${experienceStr}. ${Phrases.DOUBLE_CHECK()} `
    ];

    reply = Phrases.ACKNOWLEDGEMENT(text) + confirmPhraseBank[Math.floor(Math.random() * 2)];

    //if more than one parameter, add guidance phrase
    let parameterCount = 0;
    if (movie.title !== null) { parameterCount++; }
    if (dateTime.start !== null) { parameterCount++; }
    if (place !== null || cinema.length !== 0) { parameterCount++; }

    if (parameterCount > 1) {
        reply += makeGuidancePhrase();
    }

    await sendMessage(chat_id, reply);
}

/*----helper----*/

function makeGuidancePhrase() {

    const partOnePhrases = [
        "If I'm mistaken, ",
        "If I misunderstood, "
    ];

    const partTwoPhrases = [
        "please ",
        "kindly ",
    ];

    const partThreePhrases = [
        "let me know ",
        "tell me ",
    ];

    const partFourPhrases = [
        "the movie, your desired timing, and/or area again",
        "the movie, when and/or where you'd like to watch a movie again"
    ];

    const partOne = partOnePhrases[Math.floor(Math.random() * 2)];
    const partTwo = partTwoPhrases[Math.floor(Math.random() * 2)];
    const partThree = partThreePhrases[Math.floor(Math.random() * 2)];
    const partFour = partFourPhrases[Math.floor(Math.random() * 2)];

    return partOne.concat(partTwo, partThree, partFour);

}