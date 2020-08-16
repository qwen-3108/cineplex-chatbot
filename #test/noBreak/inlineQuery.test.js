// const connect = require('../../_database/connect');
//files to mock/stub
const connect = require('../../_database/connect');
const { COLLECTIONS } = require('../../@global/COLLECTIONS');
const LOGS = require('../../@global/LOGS');
const Session = require('../../@class/Session');

const mockInlineReq = require('./mockReq/mockInlineReq');
const botHandler = require('../../route/botHandler');
const makeInlineQueryResult = require('../../@util/makeInlineQueryResult');
const post = require('../../_telegram/post');
const { inlineQueryResult } = require('../../_database/query/cache');


describe('inline query: ', () => {

    let client;

    beforeAll(async done => {
        client = await connect(process.env.MONGODB_URI, 'testDB');
        jest.spyOn(COLLECTIONS.logs, 'updateOne').mockImplementation();
        jest.spyOn(COLLECTIONS.sessions, 'findOne').mockImplementation(() => null);
        await inlineQueryResult("1234567890", []);
        done();
    });

    afterAll(async done => {
        await client.close();
        done();
    });

    jest.spyOn(post, 'answerInlineQuery').mockImplementation();
    jest.spyOn(LOGS, 'initializeLogs').mockImplementation();
    jest.spyOn(LOGS, 'logInfo').mockImplementation();
    jest.spyOn(LOGS, 'logConv').mockImplementation();
    jest.spyOn(LOGS, 'getLogs').mockImplementation();
    //mock disable saveToDb
    jest.spyOn(Session.prototype, 'saveToDb').mockImplementation();

    let consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    const fakeRes = { end: function () { } };

    //spies to test
    const logErrorSpy = jest.spyOn(LOGS, 'logError');
    const answerInlineQuerySpy = jest.spyOn(post, 'answerInlineQuery');
    const showtimeNotUpSpy = jest.spyOn(makeInlineQueryResult, 'showtimeNotUp');
    const noResultSpy = jest.spyOn(makeInlineQueryResult, 'noResult');
    const movieSpy = jest.spyOn(makeInlineQueryResult, 'movie');
    const showtimeSpy = jest.spyOn(makeInlineQueryResult, 'showtime');
    const resultExpiredSpy = jest.spyOn(makeInlineQueryResult, 'resultExpired');

    test('on receive exceeding date query, should not break', () => {
        const req = mockInlineReq.inline_query_date_exceeded(process.env.MY_CHAT_ID);
        return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    });
    test('on receive exceeding date query, should not catch error', () => {
        expect(logErrorSpy).not.toBeCalled();
        logErrorSpy.mockClear();
    });
    test('on receive exceeding date query, should not catch error', () => {
        expect(answerInlineQuerySpy).toBeCalled();
        answerInlineQuerySpy.mockClear();
    });
    test('on receive exceeding date query, should call showtimeNotUp', () => {
        expect(showtimeNotUpSpy).toBeCalled();
        showtimeNotUpSpy.mockClear();
    });

    test('on receive movie query and has movies, should not break', () => {
        const req = mockInlineReq.inline_query_movie(process.env.MY_CHAT_ID);
        return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    });
    test('on receive movie query and has movies, should not catch error', () => {
        expect(logErrorSpy).not.toBeCalled();
        logErrorSpy.mockClear();
    });
    test('on receive movie query and has movies, should call answerInlineQuery', () => {
        expect(answerInlineQuerySpy).toBeCalled();
        answerInlineQuerySpy.mockClear();
    });
    test('on receive movie query and has movies, should call movie', () => {
        expect(movieSpy).toBeCalled();
        movieSpy.mockClear();
    });

    test('on receive movie query and has no movie, should not break', () => {
        const req = mockInlineReq.inline_query_movie_no_result(process.env.MY_CHAT_ID);
        return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    });
    test('on receive movie query and has no movie, should not catch error', () => {
        expect(logErrorSpy).not.toBeCalled();
        logErrorSpy.mockClear();
    });
    test('on receive movie query and has no movie, should call answerInlineQuery', () => {
        expect(answerInlineQuerySpy).toBeCalled();
        answerInlineQuerySpy.mockClear();
    });
    test('on receive movie query and has no movie, should call noResult', () => {
        expect(noResultSpy).toBeCalled();
        noResultSpy.mockClear();
    });

    test('on receive showtime query and has showtimes, should not break', () => {
        const req = mockInlineReq.inline_query_showtime(process.env.MY_CHAT_ID);
        return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    });
    test('on receive showtime query and has showtimes, should not catch error', () => {
        expect(logErrorSpy).not.toBeCalled();
        logErrorSpy.mockClear();
    });
    test('on receive showtime query and has showtimes, should call answerInlineQuery', () => {
        expect(answerInlineQuerySpy).toBeCalled();
        answerInlineQuerySpy.mockClear();
    });
    test('on receive showtime query and has showtimes, should call showtime', () => {
        expect(showtimeSpy).toBeCalled();
        showtimeSpy.mockClear();
    });

    test('on receive showtime query and has no showtime, should not break', () => {
        const req = mockInlineReq.inline_query_showtime_no_result(process.env.MY_CHAT_ID);
        return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    });
    test('on receive showtime query and has no showtime, should not catch error', () => {
        expect(logErrorSpy).not.toBeCalled();
        logErrorSpy.mockClear();
    });
    test('on receive showtime query and has no showtime, should call answerInlineQuery', () => {
        expect(answerInlineQuerySpy).toBeCalled();
        answerInlineQuerySpy.mockClear();
    });
    test('on receive showtime query and has no showtime, should call noResult', () => {
        expect(noResultSpy).toBeCalled();
        noResultSpy.mockClear();
    });

    test('on receive cache query and has cache, should not break', () => {
        const req = mockInlineReq.inline_query_cache(process.env.MY_CHAT_ID, "1234567890");
        return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    });
    test('on receive cache query and has cache, should not catch error', () => {
        expect(logErrorSpy).not.toBeCalled();
        logErrorSpy.mockClear();
    });
    test('on receive cache query and has cache, should call answerInlineQuery', () => {
        expect(answerInlineQuerySpy).toBeCalled();
        answerInlineQuerySpy.mockClear();
    });
    test('on receive cache query and has cache, should not call resultExpired', async done => {
        expect(resultExpiredSpy).not.toBeCalled();
        resultExpiredSpy.mockClear();
        await COLLECTIONS.inlineQueryResultCache.deleteOne({ _id: "1234567890" });
        done();
    });

    test('on receive cache query and has no cache, should not break', () => {
        const req = mockInlineReq.inline_query_cache(process.env.MY_CHAT_ID, "1234567890");
        return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    });
    test('on receive cache query and has no cache, should not catch error', () => {
        expect(logErrorSpy).not.toBeCalled();
        logErrorSpy.mockClear();
    });
    test('on receive cache query and has no cache, should call answerInlineQuery', () => {
        expect(answerInlineQuerySpy).toBeCalled();
        answerInlineQuerySpy.mockClear();
    });
    test('on receive cache query and has no cache, should call resultExpired', () => {
        expect(resultExpiredSpy).toBeCalled();
        resultExpiredSpy.mockClear();
    });

});
