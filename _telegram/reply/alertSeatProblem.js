const post = require('../post');
const makeSeatNumPhrase = require('../../@util/makeSeatNumPhrase');
const listInEnglish = require('../../@util/listInEnglish');

module.exports = { invalidSeats, invalidSeatPhrases, takenSeats, justTakenSeats, mixedTakenSeats, fullyBooked };

/*--------------------*/
function makeSeatStr(seatArr) { return seatArr.length > 1 ? 'seats' : 'seat'; }
function makeHaveStr(seatArr) { return seatArr.length > 1 ? 'have' : 'has'; }
function makeBeStr(seatArr) { return seatArr.length > 1 ? 'are' : 'is'; }
/*-------------------*/

async function invalidSeats(chat_id, invalidSeats, seatNumbers, invalidSeatCount) {

    if (invalidSeatCount > 3) return;

    let text;

    switch (invalidSeatCount) {
        case 1:
            text = `I don't think we have ${makeSeatStr(invalidSeats)} ${makeSeatNumPhrase(invalidSeats)}. `
            text += seatNumbers.length !== 0 ? `How about you tell me your preferred seats again?` : `Could you let me know your preferred seats again?`;
            break;
        case 2:
            text = `I can't understand your choice of seats 😥 Would you contact our human assistants at 1111 1111, please? They will do their best to help`
            break;
        default:
            return;
    }

    await post.sendMessage(chat_id, text, { parseMode: 'Markdown' });

}

async function invalidSeatPhrases(chat_id, expandProgressObj, invalidSeatPhraseCount) {

    if (invalidSeatPhraseCount > 3) return;

    const { expandedSeatNumbers, invalidSeatPhrases, correctedSeatPhrases } = expandProgressObj;

    const collatedExpandedSeatNumbers = [];
    const collatedInvalidSeatPhrases = [];
    const collatedCorrectedSeatPhrases = [];
    for (const type in invalidSeatPhrases) {
        collatedInvalidSeatPhrases.push(...invalidSeatPhrases[type]);
    }
    for (const type in correctedSeatPhrases) {
        collatedCorrectedSeatPhrases.push(...correctedSeatPhrases[type]);
    }
    for (const type in expandedSeatNumbers) {
        collatedExpandedSeatNumbers.push(...expandedSeatNumbers[type]);
    }


    let text;
    switch (invalidSeatPhraseCount) {
        case 1:
            text = collatedExpandedSeatNumbers.length !== 0 ? `Okay. As for ${listInEnglish(collatedInvalidSeatPhrases)}, do you mean ${listInEnglish(collatedCorrectedSeatPhrases)}?` : `Hm do you mean ${listInEnglish(collatedCorrectedSeatPhrases)}? If not, kindly tell me your preferred seats again, row by row and from the left to the right, thanks :)`;
            break;
        case 2:
            text = "I'm afraid I still don't get you. Mind telling me the seat numbers one by one? Sorry :/"
            break;
        case 3:
            text = `I can't understand your selection 😥 Please contact our human assstants at 1111 1111. They will try their best to help you`;
            break;
        default:
            return;

    }

    await post.sendMessage(chat_id, text);

}

async function takenSeats(chat_id, takenSeats, seatTakenCount) {

    if (seatTakenCount > 2) return;

    const textArr = [
        `I'm afraid ${makeSeatStr(takenSeats)} ${makeSeatNumPhrase(takenSeats)} ${makeBeStr(takenSeats)} taken. Would you mind to let me know your preferred seats again?`,
        `It seems like your seat selections are still unavailable. If you are facing any issue, please contact our human assistants at 1111 1111. They will do their best to help`
    ]

    await post.sendMessage(chat_id, textArr[seatTakenCount - 1]);

}

async function justTakenSeats(chat_id, justTakenSeats, justTakenCount) {

    if (justTakenCount > 4) return;

    const textArr = [
        `I'm afraid ${makeSeatStr(justTakenSeats)} ${makeSeatNumPhrase(justTakenSeats)} ${makeHaveStr(justTakenSeats)} just been taken. Could you tell me your preferred seats again?`,
        `Gee the movie is such a blockbuster. But if we keep trying we might still be able to get the seats. Would you like to continue?`,
        `Taken again 😥 That was close. What seats next?`,
        `Unfortunately we didn't get it. Let me know your preferred seats again?`,
    ];

    await post.sendMessage(chat_id, textArr[justTakenCount - 1]);

}

async function mixedTakenSeats(chat_id, takenSeats, justTakenSeats) {

    text = `I'm afraid ${makeSeatStr(takenSeats)} ${makeSeatNumPhrase(takenSeats)} ${makeBeStr(takenSeats)} taken. Unfortunately, ${makeSeatStr(justTakenSeats)} ${makeSeatNumPhrase(justTakenSeats)} ${makeHaveStr(justTakenSeats)} also just been reserved. Could you tell me your preferred seats again, please?`

    await post.sendMessage(chat_id, text);

}

async function fullyBooked(chat_id, movieTitle, hasAlternative) {

    if (hasAlternative) {
        const text = `Tickets for that showtime have just been sold out 😥 I'm sorry about that. Here are ${movieTitle}'s other available showtimes (filter by typing date/location). Let me know how else I can help`;
        const replyMarkup = {
            inline_keyboard: [[{
                text: `Showtimes · ${movieTitle}`,
                switch_inline_query_current_chat: `${movieTitle}`
            }]]
        };
        await post.sendMessage(chat_id, text, { replyMarkup });

    } else {
        const text = `Tickets for that showtime have just been sold out, and it seems like other showtimes are fully booked as well. I'm really sorry about that :/ Is there anything else I can help?`;
        await post.sendMessage(chat_id, text);
    }

}