module.exports = {
    // u: /start
    AFTER_START: { "chatId": "750594803", "sessionInfo": { "startedAt": "2020-08-03T08:35:43.372Z", "endedAt": null }, "status": { "main": null, "secondary": null }, "bookingInfo": { "movie": { "title": null, "id": null, "debutDateTime": null, "isBlockBuster": null }, "dateTime": { "start": null, "end": null, "daysToDbDate": 70, "nextWeekAreDaysLessThan": 1 }, "place": null, "cinema": [], "ticketing": [], "seatNumbers": [] }, "counter": { "invalidSeatCount": 0, "invalidSeatPhraseCount": 0, "seatTakenCount": 0, "justTakenCount": 0, "editInfoCount": 0, "fallbackCount": 0 }, "confirmPayload": { "adjustedDateTime": {}, "uniqueSchedule": {}, "seatPhraseGuess": {} } },
    // b: how may i help u?
    // u: I'd like to watch a movie
    PROMPT_MOVIE: { "chatId": "750594803", "sessionInfo": { "startedAt": "2020-08-03T08:35:43.372Z", "endedAt": null }, "status": { "main": "prompt-movie", "secondary": null }, "bookingInfo": { "movie": { "title": null, "id": null, "debutDateTime": null, "isBlockBuster": null }, "dateTime": { "start": null, "end": null, "daysToDbDate": 70, "nextWeekAreDaysLessThan": 1 }, "place": null, "cinema": [], "ticketing": [], "seatNumbers": [] }, "counter": { "invalidSeatCount": 0, "invalidSeatPhraseCount": 0, "seatTakenCount": 0, "justTakenCount": 0, "editInfoCount": 0, "fallbackCount": 0, "fallback": 0 }, "confirmPayload": { "adjustedDateTime": {}, "uniqueSchedule": {}, "seatPhraseGuess": {} } },
    // b: okay, for which movie?
    // u: tenet
    PROMPT_DATETIME: { "chatId": "750594803", "sessionInfo": { "startedAt": "2020-08-03T08:35:43.372Z", "endedAt": null }, "status": { "main": "prompt-datetime", "secondary": null }, "bookingInfo": { "movie": { "title": "TENET", "id": "5ec6603c29431975db467384", "debutDateTime": "2020-05-16T16:00:00.000Z", "isBlockBuster": true }, "dateTime": { "start": null, "end": null, "daysToDbDate": 70, "nextWeekAreDaysLessThan": 1 }, "place": null, "cinema": [], "ticketing": [], "seatNumbers": [] }, "counter": { "invalidSeatCount": 0, "invalidSeatPhraseCount": 0, "seatTakenCount": 0, "justTakenCount": 0, "editInfoCount": 0, "fallbackCount": 0, "fallback": 0 }, "confirmPayload": { "adjustedDateTime": {}, "uniqueSchedule": {}, "seatPhraseGuess": {} } },
    // b: around when? showtimes are up until
    // u: 
    //// pending invalid date time session
    // b: not available yet
    // u: ok how about this wed?
    GET_CINEMA: { "chatId": "750594803", "sessionInfo": { "startedAt": "2020-08-03T08:35:43.372Z", "endedAt": null }, "status": { "main": "get-cinema", "secondary": null }, "bookingInfo": { "movie": { "title": "TENET", "id": "5ec6603c29431975db467384", "debutDateTime": "2020-05-16T16:00:00.000Z", "isBlockBuster": true }, "dateTime": { "start": "2020-08-05T00:00:00.000Z", "end": "2020-08-05T23:59:59.000Z", "daysToDbDate": 70, "nextWeekAreDaysLessThan": 1 }, "place": null, "cinema": [], "ticketing": [], "seatNumbers": [] }, "counter": { "invalidSeatCount": 0, "invalidSeatPhraseCount": 0, "seatTakenCount": 0, "justTakenCount": 0, "editInfoCount": 0, "fallbackCount": 0, "fallback": 0 }, "confirmPayload": { "adjustedDateTime": {}, "uniqueSchedule": {}, "seatPhraseGuess": {} } },
    // b: ok these cinemas available
    // u: *pick cinema*


}