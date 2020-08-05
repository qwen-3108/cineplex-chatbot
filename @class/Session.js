const { differenceInCalendarDays } = require('date-fns');
const { MAIN_STATUS, DATES_IN_DB } = require('../@global/CONSTANTS');
const { COLLECTIONS } = require('../@global/COLLECTIONS');

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
                lastUpdated: null,
                endedAt: null
            };
            this.status = { main: null, secondary: null };

            const todayDay = this.sessionInfo.startedAt.getDay();
            const todayDbDate = new Date(DATES_IN_DB[todayDay]);
            this.bookingInfo = {
                movie: { title: null, id: null, debutDateTime: null, isBlockBuster: null },
                dateTime: {
                    start: null, end: null,
                    daysToDbDate: differenceInCalendarDays(this.sessionInfo.startedAt, todayDbDate),
                    nextWeekAreDaysLessThan: todayDay
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
            this.payload = { seatNumber: null, movie: null };
            console.log('-----Instantiating new session-----');
            console.log('New session: ', JSON.stringify(this));

        } else {
            console.log('-----Reconstructing existing session-----');
            const { sessionInfo, status, bookingInfo, counter, confirmPayload, payload } = sessionInDb;
            this.sessionInfo = sessionInfo; this.status = status; this.bookingInfo = bookingInfo; this.counter = counter; this.confirmPayload = confirmPayload; this.payload = payload;
            console.log('Existing: ', JSON.stringify(this));
        }

    }

    async saveToDb() {
        console.log('-----saving session-----');
        this.sessionInfo.lastUpdated = new Date();
        console.log('Session to save: ', JSON.stringify(this));
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
            { upsert: true }, function (err) { console.log('Session saving error:', err) });
        console.log('-----done-----');
    }

    end({ isComplete }) {
        this.sessionInfo.endedAt = new Date();
        this.status = isComplete ? { main: MAIN_STATUS.COMPLETE, secondary: null } : { main: MAIN_STATUS.CANCELLED, secondary: null };
        this.bookingInfo = {};
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
        console.log('marked session as end');
    }
}