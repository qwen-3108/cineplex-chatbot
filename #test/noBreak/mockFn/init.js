const { COLLECTIONS } = require('../../../@global/COLLECTIONS');
const LOGS = require('../../../@global/LOGS');

module.exports = async function init() {
    const sessionInDb = await COLLECTIONS.sessions.findOne({ _id: this.chatId });
    if (sessionInDb === null) {

        this.sessionInfo = {
            startedAt: new Date('2020-08-15T09:00:00+08:00'), //the most recent saturday
            lastUpdated: null,
            endedAt: null
        };
        this.status = { main: null, secondary: null };

        this.bookingInfo = {
            movie: { title: null, id: null, debutDateTime: null, isBlockBuster: null },
            dateTime: {
                start: null, end: null,
                sessionStartedAt: this.sessionInfo.startedAt
            },
            place: null,
            cinema: [],
            ticketing: [],
            seatNumbers: []
        };

        this.counter = {
            invalidSeatCount: 0,
            invalidSeatPhraseCount: 0,
            seatTakenCount: 0,
            justTakenCount: 0,
            editInfoCount: 0,
            fallbackCount: 0,
            seenMovieCard: 0,
            seenShowtimeCard: 0
        };

        this.confirmPayload = { adjustedDateTime: {}, uniqueSchedule: {}, seatPhraseGuess: {} };
        this.payload = { seatNumber: [], movie: { title: null, id: null, debutDateTime: null, isBlockBuster: null } };
        LOGS.logInfo(this.chatId, '-----Instantiating new session-----');
        LOGS.logInfo(this.chatId, `New session: ${JSON.stringify(this)}`);

    } else {
        LOGS.logInfo(this.chatId, '-----Reconstructing existing session-----');
        const { sessionInfo, status, bookingInfo, counter, confirmPayload, payload } = sessionInDb;
        this.sessionInfo = sessionInfo;
        this.status = status;
        this.bookingInfo = bookingInfo;
        this.bookingInfo.dateTime.sessionStartedAt = this.sessionInfo.startedAt;
        this.counter = counter;
        this.confirmPayload = confirmPayload;
        this.payload = payload;
        LOGS.logInfo(this.chatId, `Existing: ${JSON.stringify(this)}`);
    }

    const docId = this.chatId;
    const logs = await COLLECTIONS.logs.findOne({ _id: this.chatId });
    if (logs === null) {
        await COLLECTIONS.logs.insertOne(
            {
                _id: this.chatId,
                data: "",
            },
            function (err) { LOGS.logError(docId, `Logs creation error: ${err}`) });
    }

}