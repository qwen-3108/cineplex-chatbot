/*
1. booking info with movie id
2. booking info with datetime
    - datetime with only date 
    - datetime with date and time and does not cross over to next week
    - datetime with date and time and does cross over to next week
    - datetime with max duration
3. booking info with cinema
4. booking info with experience
*/

const makeDbQuery = require("../../@util/makeDbQuery");
const { addHours } = require("date-fns");
const { DATES_IN_DB } = require("../../@global/CONSTANTS");

const movieNull = { id: null };
const dateTimeNull = { start: null, end: null, sessionStartedAt: new Date() };
const cinema = ["cinema_1", "cinema_2"];
const experience = "experience_name";

describe('at makeDbQuery', () => {

    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    test('should form correct query with movie info', () => {
        const movie = { id: "movie_id" };
        const bookingInfoWithMovie = { movie: movie, dateTime: dateTimeNull, cinema: [] };
        const { combinedQuery, availabilityQuery } = makeDbQuery(bookingInfoWithMovie);
        expect(combinedQuery).toEqual({ movieId: movie.id });
    });
    test('should form correct query with cinema info', () => {
        const bookingInfoWithCinema = { movie: movieNull, dateTime: dateTimeNull, cinema: cinema };
        const { combinedQuery, availabilityQuery } = makeDbQuery(bookingInfoWithCinema);
        expect(combinedQuery).toEqual({ cinema: { $in: cinema } });
    });
    test('should form correct query with experience info (platinum)', () => {
        const bookingInfoWithExperience = { movie: movieNull, dateTime: dateTimeNull, cinema: [], experience: "Platinum Movie Suites" };
        const { combinedQuery, availabilityQuery } = makeDbQuery(bookingInfoWithExperience);
        expect(combinedQuery).toEqual({ isPlatinum: true });
    });
    test('should form correct query with experience info (regular)', () => {
        const bookingInfoWithExperience = { movie: movieNull, dateTime: dateTimeNull, cinema: [], experience: "Regular" };
        const { combinedQuery, availabilityQuery } = makeDbQuery(bookingInfoWithExperience);
        expect(combinedQuery).toEqual({ isPlatinum: false });
    });
    test('should form correct query with datetime info (wholeDay + today + no cross week)', () => {
        const dayStart = new Date("08-14-20"); dayStart.setHours(0, 0, 0);
        const dayEnd = new Date("08-14-20"); dayEnd.setHours(23, 59, 59);
        const sessionStartTime = new Date("08-14-20"); sessionStartTime.setHours(3, 0, 0);
        const dateTime = { start: dayStart, end: dayEnd, sessionStartedAt: sessionStartTime };
        const bookingInfoWithDateTime = { movie: movieNull, dateTime: dateTime, cinema: [] };

        const { combinedQuery, availabilityQuery } = makeDbQuery(bookingInfoWithDateTime);

        const expectedStart = new Date(DATES_IN_DB[dayStart.getDay()]); expectedStart.setHours(3, 0, 0);
        const expectedEnd = new Date(DATES_IN_DB[dayEnd.getDay() + 1]); expectedEnd.setHours(5, 59, 59);
        expect(combinedQuery).toEqual({ dateTime: { $gte: expectedStart, $lte: expectedEnd } });
    });
    test('should form correct query with datetime info (wholeDay + today + cross week + 7pm)', () => {
        const dayStart = new Date("08-15-20"); dayStart.setHours(0, 0, 0);
        const dayEnd = new Date("08-15-20"); dayEnd.setHours(23, 59, 59);
        const sessionStartTime = new Date("08-15-20"); sessionStartTime.setHours(19, 0, 0);
        const dateTime = { start: dayStart, end: dayEnd, sessionStartedAt: sessionStartTime };
        const bookingInfoWithDateTime = { movie: movieNull, dateTime: dateTime, cinema: [] };

        const { combinedQuery, availabilityQuery } = makeDbQuery(bookingInfoWithDateTime);

        const expectedStart = new Date(DATES_IN_DB[6]); expectedStart.setHours(19, 0, 0);
        const expectedStartEnd = new Date(DATES_IN_DB[6]); expectedStartEnd.setHours(23, 59, 59);
        const expectedEndStart = new Date(DATES_IN_DB[0]); expectedEndStart.setHours(0, 0, 0);
        const expectedEnd = new Date(DATES_IN_DB[0]); expectedEnd.setHours(5, 59, 59);
        expect(combinedQuery).toEqual({
            $or: [
                { dateTime: { $gte: expectedStart, $lte: expectedStartEnd } },
                { dateTime: { $gte: expectedEndStart, $lte: expectedEnd } }
            ]
        });
    });
    test('should form correct query with datetime info (wholeDay + not max day + no cross week)', () => {
        const dayStart = new Date("08-09-20"); dayStart.setHours(0, 0, 0);
        const dayEnd = new Date("08-09-20"); dayEnd.setHours(23, 59, 59);
        const sessionStartTime = new Date("08-06-20"); sessionStartTime.setHours(3, 0, 0);
        const dateTime = { start: dayStart, end: dayEnd, sessionStartedAt: sessionStartTime };
        const bookingInfoWithDateTime = { movie: movieNull, dateTime: dateTime, cinema: [] };

        const { combinedQuery, availabilityQuery } = makeDbQuery(bookingInfoWithDateTime);

        const expectedStart = new Date(DATES_IN_DB[dayStart.getDay()]); expectedStart.setHours(0, 0, 0);
        const expectedEnd = new Date(DATES_IN_DB[dayEnd.getDay() + 1]); expectedEnd.setHours(5, 59, 59);
        expect(combinedQuery).toEqual({ dateTime: { $gte: expectedStart, $lte: expectedEnd } });
    });
    test('should form correct query with datetime info (wholeDay + not max day + cross week)', () => {
        const dayStart = new Date("08-08-20"); dayStart.setHours(0, 0, 0);
        const dayEnd = new Date("08-08-20"); dayEnd.setHours(23, 59, 59);
        const sessionStartTime = new Date("08-06-20"); sessionStartTime.setHours(3, 0, 0);
        const dateTime = { start: dayStart, end: dayEnd, sessionStartedAt: sessionStartTime };
        const bookingInfoWithDateTime = { movie: movieNull, dateTime: dateTime, cinema: [] };

        const { combinedQuery, availabilityQuery } = makeDbQuery(bookingInfoWithDateTime);

        const expectedStart = new Date(DATES_IN_DB[6]); expectedStart.setHours(0, 0, 0);
        const expectedStartEnd = new Date(DATES_IN_DB[6]); expectedStartEnd.setHours(23, 59, 59);
        const expectedEndStart = new Date(DATES_IN_DB[0]); expectedEndStart.setHours(0, 0, 0);
        const expectedEnd = new Date(DATES_IN_DB[0]); expectedEnd.setHours(5, 59, 59);
        expect(combinedQuery).toEqual({
            $or: [
                { dateTime: { $gte: expectedStart, $lte: expectedStartEnd } },
                { dateTime: { $gte: expectedEndStart, $lte: expectedEnd } }
            ]
        });
    });
    test('should form correct query with datetime info (wholeDay + max day + not cross week + 3am)', () => {
        const dayStart = new Date("08-20-20"); dayStart.setHours(0, 0, 0);
        const dayEnd = new Date("08-20-20"); dayEnd.setHours(23, 59, 59);
        const sessionStartTime = new Date("08-14-20"); sessionStartTime.setHours(3, 0, 0);
        const dateTime = { start: dayStart, end: dayEnd, sessionStartedAt: sessionStartTime };
        const bookingInfoWithDateTime = { movie: movieNull, dateTime: dateTime, cinema: [] };

        const { combinedQuery, availabilityQuery } = makeDbQuery(bookingInfoWithDateTime);

        const expectedStart = new Date(DATES_IN_DB[dayStart.getDay()]); expectedStart.setHours(0, 0, 0);
        const expectedEnd = new Date(DATES_IN_DB[dayEnd.getDay()]); expectedEnd.setHours(23, 59, 59);
        expect(combinedQuery).toEqual({ dateTime: { $gte: expectedStart, $lte: expectedEnd } });
    });
    test('should form correct query with datetime info (wholeDay + max day + not cross week + 9am)', () => {
        const dayStart = new Date("08-21-20"); dayStart.setHours(0, 0, 0);
        const dayEnd = new Date("08-21-20"); dayEnd.setHours(23, 59, 59);
        const sessionStartTime = new Date("08-14-20"); sessionStartTime.setHours(9, 0, 0);
        const dateTime = { start: dayStart, end: dayEnd, sessionStartedAt: sessionStartTime };
        const bookingInfoWithDateTime = { movie: movieNull, dateTime: dateTime, cinema: [] };

        const { combinedQuery, availabilityQuery } = makeDbQuery(bookingInfoWithDateTime);

        const expectedStart = new Date(DATES_IN_DB[dayStart.getDay()]); expectedStart.setHours(0, 0, 0);
        const expectedEnd = new Date(DATES_IN_DB[dayEnd.getDay()]); expectedEnd.setHours(5, 59, 59);
        expect(combinedQuery).toEqual({ dateTime: { $gte: expectedStart, $lte: expectedEnd } });
    });
    test('should form correct query with datetime info (wholeDay + max day + not cross week + 3pm)', () => {
        const dayStart = new Date("08-21-20"); dayStart.setHours(0, 0, 0);
        const dayEnd = new Date("08-21-20"); dayEnd.setHours(23, 59, 59);
        const sessionStartTime = new Date("08-14-20"); sessionStartTime.setHours(15, 0, 0);
        const dateTime = { start: dayStart, end: dayEnd, sessionStartedAt: sessionStartTime };
        const bookingInfoWithDateTime = { movie: movieNull, dateTime: dateTime, cinema: [] };

        const { combinedQuery, availabilityQuery } = makeDbQuery(bookingInfoWithDateTime);

        const expectedStart = new Date(DATES_IN_DB[dayStart.getDay()]); expectedStart.setHours(0, 0, 0);
        const expectedEnd = new Date(DATES_IN_DB[dayEnd.getDay()]); expectedEnd.setHours(11, 59, 59);
        expect(combinedQuery).toEqual({ dateTime: { $gte: expectedStart, $lte: expectedEnd } });
    });
    test('should form correct query with datetime info (wholeDay + max day + not cross week + 9pm)', () => {
        const dayStart = new Date("08-21-20"); dayStart.setHours(0, 0, 0);
        const dayEnd = new Date("08-21-20"); dayEnd.setHours(23, 59, 59);
        const sessionStartTime = new Date("08-14-20"); sessionStartTime.setHours(21, 0, 0);
        const dateTime = { start: dayStart, end: dayEnd, sessionStartedAt: sessionStartTime };
        const bookingInfoWithDateTime = { movie: movieNull, dateTime: dateTime, cinema: [] };

        const { combinedQuery, availabilityQuery } = makeDbQuery(bookingInfoWithDateTime);

        const expectedStart = new Date(DATES_IN_DB[dayStart.getDay()]); expectedStart.setHours(0, 0, 0);
        const expectedEnd = new Date(DATES_IN_DB[dayEnd.getDay()]); expectedEnd.setHours(17, 59, 59);
        expect(combinedQuery).toEqual({ dateTime: { $gte: expectedStart, $lte: expectedEnd } });
    });
    test('should form correct query with datetime info (duration + cross week + not max day)', () => {
        const dayStart = new Date("08-14-20"); dayStart.setHours(0, 0, 0);
        const dayEnd = new Date("08-18-20"); dayEnd.setHours(23, 59, 59);
        const sessionStartTime = new Date("08-14-20"); sessionStartTime.setHours(3, 0, 0);
        const dateTime = { start: dayStart, end: dayEnd, sessionStartedAt: sessionStartTime };
        const bookingInfoWithDateTime = { movie: movieNull, dateTime: dateTime, cinema: [] };

        const { combinedQuery, availabilityQuery } = makeDbQuery(bookingInfoWithDateTime);

        const expectedStart = new Date(DATES_IN_DB[dayStart.getDay()]); expectedStart.setHours(3, 0, 0);
        const expectedStartEnd = new Date(DATES_IN_DB[6]); expectedStartEnd.setHours(23, 59, 59);
        const expectedEndStart = new Date(DATES_IN_DB[0]); expectedEndStart.setHours(0, 0, 0);
        const expectedEnd = new Date(DATES_IN_DB[dayEnd.getDay()]); expectedEnd.setHours(23, 59, 59);
        expect(combinedQuery).toEqual({
            $or: [
                { dateTime: { $gte: expectedStart, $lte: expectedStartEnd } },
                { dateTime: { $gte: expectedEndStart, $lte: expectedEnd } }
            ]
        });
    });
    test('should form correct query with datetime info (duration + cross week + max day + 3am)', () => {
        const dayStart = new Date("08-14-20"); dayStart.setHours(0, 0, 0);
        const dayEnd = new Date("08-21-20"); dayEnd.setHours(23, 59, 59);
        const sessionStartTime = new Date("08-14-20"); sessionStartTime.setHours(3, 0, 0);
        const dateTime = { start: dayStart, end: dayEnd, sessionStartedAt: sessionStartTime };
        const bookingInfoWithDateTime = { movie: movieNull, dateTime: dateTime, cinema: [] };

        const { combinedQuery, availabilityQuery } = makeDbQuery(bookingInfoWithDateTime);

        const expectedStart = new Date(DATES_IN_DB[dayStart.getDay()]); expectedStart.setHours(3, 0, 0);
        const expectedStartEnd = new Date(DATES_IN_DB[6]); expectedStartEnd.setHours(23, 59, 59);
        const expectedEndStart = new Date(DATES_IN_DB[0]); expectedEndStart.setHours(0, 0, 0);
        const expectedEnd = new Date(DATES_IN_DB[dayEnd.getDay() - 1]); expectedEnd.setHours(23, 59, 59);
        expect(combinedQuery).toEqual({
            $or: [
                { dateTime: { $gte: expectedStart, $lte: expectedStartEnd } },
                { dateTime: { $gte: expectedEndStart, $lte: expectedEnd } }
            ]
        });
    });
    test('should form correct query with datetime info (duration + cross week + max day + 9am)', () => {
        const dayStart = new Date("08-14-20"); dayStart.setHours(0, 0, 0);
        const dayEnd = new Date("08-21-20"); dayEnd.setHours(23, 59, 59);
        const sessionStartTime = new Date("08-14-20"); sessionStartTime.setHours(9, 0, 0);
        const dateTime = { start: dayStart, end: dayEnd, sessionStartedAt: sessionStartTime };
        const bookingInfoWithDateTime = { movie: movieNull, dateTime: dateTime, cinema: [] };

        const { combinedQuery, availabilityQuery } = makeDbQuery(bookingInfoWithDateTime);

        const expectedStart = new Date(DATES_IN_DB[dayStart.getDay()]); expectedStart.setHours(9, 0, 0);
        const expectedStartEnd = new Date(DATES_IN_DB[6]); expectedStartEnd.setHours(23, 59, 59);
        const expectedEndStart = new Date(DATES_IN_DB[0]); expectedEndStart.setHours(0, 0, 0);
        const expectedEnd = new Date(DATES_IN_DB[dayEnd.getDay()]); expectedEnd.setHours(5, 59, 59);
        expect(combinedQuery).toEqual({
            $or: [
                { dateTime: { $gte: expectedStart, $lte: expectedStartEnd } },
                { dateTime: { $gte: expectedEndStart, $lte: expectedEnd } }
            ]
        });
    });
    test('should form correct query with datetime info (duration + cross week + max day + 3pm)', () => {
        const dayStart = new Date("08-14-20"); dayStart.setHours(0, 0, 0);
        const dayEnd = new Date("08-21-20"); dayEnd.setHours(23, 59, 59);
        const sessionStartTime = new Date("08-14-20"); sessionStartTime.setHours(15, 0, 0);
        const dateTime = { start: dayStart, end: dayEnd, sessionStartedAt: sessionStartTime };
        const bookingInfoWithDateTime = { movie: movieNull, dateTime: dateTime, cinema: [] };

        const { combinedQuery, availabilityQuery } = makeDbQuery(bookingInfoWithDateTime);

        const expectedStart = new Date(DATES_IN_DB[dayStart.getDay()]); expectedStart.setHours(15, 0, 0);
        const expectedStartEnd = new Date(DATES_IN_DB[6]); expectedStartEnd.setHours(23, 59, 59);
        const expectedEndStart = new Date(DATES_IN_DB[0]); expectedEndStart.setHours(0, 0, 0);
        const expectedEnd = new Date(DATES_IN_DB[dayEnd.getDay()]); expectedEnd.setHours(11, 59, 59);
        expect(combinedQuery).toEqual({
            $or: [
                { dateTime: { $gte: expectedStart, $lte: expectedStartEnd } },
                { dateTime: { $gte: expectedEndStart, $lte: expectedEnd } }
            ]
        });
    });
    test('should form correct query with datetime info (duration + cross week + max day + 9pm)', () => {
        const dayStart = new Date("08-14-20"); dayStart.setHours(0, 0, 0);
        const dayEnd = new Date("08-21-20"); dayEnd.setHours(23, 59, 59);
        const sessionStartTime = new Date("08-14-20"); sessionStartTime.setHours(21, 0, 0);
        const dateTime = { start: dayStart, end: dayEnd, sessionStartedAt: sessionStartTime };
        const bookingInfoWithDateTime = { movie: movieNull, dateTime: dateTime, cinema: [] };

        const { combinedQuery, availabilityQuery } = makeDbQuery(bookingInfoWithDateTime);

        const expectedStart = new Date(DATES_IN_DB[dayStart.getDay()]); expectedStart.setHours(21, 0, 0);
        const expectedStartEnd = new Date(DATES_IN_DB[6]); expectedStartEnd.setHours(23, 59, 59);
        const expectedEndStart = new Date(DATES_IN_DB[0]); expectedEndStart.setHours(0, 0, 0);
        const expectedEnd = new Date(DATES_IN_DB[dayEnd.getDay()]); expectedEnd.setHours(17, 59, 59);
        expect(combinedQuery).toEqual({
            $or: [
                { dateTime: { $gte: expectedStart, $lte: expectedStartEnd } },
                { dateTime: { $gte: expectedEndStart, $lte: expectedEnd } }
            ]
        });
    });
    test('should form correct query with datetime info (duration + not cross week)', () => {
        const dayStart = new Date("08-11-20"); dayStart.setHours(0, 0, 0);
        const dayEnd = new Date("08-14-20"); dayEnd.setHours(23, 59, 59);
        const sessionStartTime = new Date("08-11-20"); sessionStartTime.setHours(21, 0, 0);
        const dateTime = { start: dayStart, end: dayEnd, sessionStartedAt: sessionStartTime };
        const bookingInfoWithDateTime = { movie: movieNull, dateTime: dateTime, cinema: [] };

        const { combinedQuery, availabilityQuery } = makeDbQuery(bookingInfoWithDateTime);

        const expectedStart = new Date(DATES_IN_DB[dayStart.getDay()]); expectedStart.setHours(21, 0, 0);
        const expectedEnd = new Date(DATES_IN_DB[dayEnd.getDay()]); expectedEnd.setHours(23, 59, 59);
        expect(combinedQuery).toEqual({ dateTime: { $gte: expectedStart, $lte: expectedEnd } });
    });

});
