const { differenceInCalendarDays } = require('date-fns');
const { MAIN_STATUS, DATES_IN_DB } = require('../@global/CONSTANTS');
const { COLLECTIONS } = require('../@global/COLLECTIONS');
const LOGS = require('../@global/LOGS');
const logType = require('../@util/logType');

module.exports = class Session {

    constructor(_id) {
        this.chatId = _id;
        this.sessionInfo = {};
        this.status = {};
        this.bookingInfo = {};
        this.counter = {};
        this.confirmPayload = {};
        this.payload = {};
    }

    async init() {
        const sessionInDb = await COLLECTIONS.sessions.findOne({ _id: this.chatId });
        if (sessionInDb === null) {

            this.sessionInfo = {
                startedAt: new Date(),
                // startedAt: new Date('2020-08-08T09:00:00+08:00'),
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
<<<<<<< Updated upstream
=======
            LOGS.initializeLogs(this.chatId);
>>>>>>> Stashed changes
            LOGS.logInfo(this.chatId, '-----Instantiating new session-----');
            LOGS.logInfo(this.chatId, `New session: ${JSON.stringify(this)}`);

        } else {
<<<<<<< Updated upstream
=======
            LOGS.initializeLogs(this.chatId);
>>>>>>> Stashed changes
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

    async saveToDb() {
        LOGS.logInfo(this.chatId, '-----saving session-----');
        this.sessionInfo.lastUpdated = new Date();
        LOGS.logInfo(this.chatId, `Session to save: ${JSON.stringify(this)}`);
        const docId = this.chatId;
<<<<<<< Updated upstream
=======
        // LOGS.logInfo(this.chatId, `Session object with type: ${logType(this, 0)}`);
>>>>>>> Stashed changes
        delete this.bookingInfo.dateTime.sessionStartedAt;
        // LOGS.logInfo(this.chatId, `Session object with type: ${logType(this, 0)}`);
        await COLLECTIONS.sessions.replaceOne(
            { _id: this.chatId },
            {
                _id: this.chatId,
                sessionInfo: this.sessionInfo,
                status: this.status,
                bookingInfo: this.bookingInfo,
                counter: this.counter,
                confirmPayload: this.confirmPayload,
                payload: this.payload,
            },
            { upsert: true }, function (err) { LOGS.logError(docId, `Session saving error: ${err}`) });
        LOGS.logInfo(this.chatId, '-----done-----');

    }

    end({ isComplete }) {
        this.sessionInfo.endedAt = new Date();
        this.status = isComplete ? { main: MAIN_STATUS.COMPLETE, secondary: null } : { main: MAIN_STATUS.CANCELLED, secondary: null };
        const todayDay = this.sessionInfo.startedAt.getDay();
        const todayDbDate = new Date(DATES_IN_DB[todayDay]);
        this.bookingInfo = {
            movie: { title: null, id: null, debutDateTime: null, isBlockBuster: null },
            dateTime: {
                start: null, end: null,
                daysToDbDate: differenceInCalendarDays(this.sessionInfo.startedAt, todayDbDate),
                nextWeekAreDaysLessThan: todayDay,
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
            fallbackCount: 0,
            seenMovieCard: 0,
            seenShowtimeCard: 0
        };
        this.confirmPayload = {};
        this.payload = {};
        LOGS.logInfo(this.chatId, 'marked session as end');
    }
}