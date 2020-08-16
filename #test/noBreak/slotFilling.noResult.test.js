const connect = require('../../_database/connect');
//files to mock/stub
const { COLLECTIONS } = require('../../@global/COLLECTIONS');
const LOGS = require('../../@global/LOGS');
const post = require('../../_telegram/post');
const reply = require('../../_telegram/reply');
const Session = require('../../@class/Session');
//mock requests generator
const mockReq = require('./mockReq/mockReq');
const init = require('./mockFn/init');
const testCase = require('./testCase');
//files under test
const botHandler = require('../../route/botHandler');

describe('when no results found based on user input', () => {

    let client;

    beforeAll(async done => {
        client = await connect(process.env.MONGODB_URI, 'testDB');
        jest.spyOn(COLLECTIONS.logs, 'updateOne').mockImplementation();
        jest.spyOn(COLLECTIONS.sessions, 'findOne').mockImplementation(() => null);
        done();

    });

    afterAll(async done => {
        //close connection
        await client.close();
        done();
    });

    jest.spyOn(post, 'sendMessage').mockImplementation();
    jest.spyOn(post, 'sendTypingAction').mockImplementation();
    jest.spyOn(LOGS, 'initializeLogs').mockImplementation();
    jest.spyOn(LOGS, 'logInfo').mockImplementation();
    jest.spyOn(LOGS, 'logConv').mockImplementation();
    jest.spyOn(LOGS, 'getLogs').mockImplementation();
    //mock disable saveToDb
    jest.spyOn(Session.prototype, 'saveToDb').mockImplementation();

    let consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    const fakeRes = { end: function () { } };

    //spies to test
    const logErrorSpy = jest.spyOn(LOGS, 'logError').mockImplementation(function (chatId, error) { console.error(error) });
    const getCinemaSpy = jest.spyOn(reply.fillSlot, 'getCinema');
    const getExactSlotSpy = jest.spyOn(reply.fillSlot, 'getExactSlot');
    const getExperienceOnlySpy = jest.spyOn(reply.fillSlot, 'getExperienceOnly');
    const warnPlatinumSpy = jest.spyOn(reply, 'warnPlatinum');
    const confirmProceedSpy = jest.spyOn(reply.fillSlot, 'confirmProceed')
    const noResultSpy = jest.spyOn(reply, 'noResult');

    describe.each(testCase.getCinema)('at get-cinema, when %s, botHandler', (expectedResponseCode, queryText) => {
        test('should not throw', () => {
            const req = mockReq.plain_text(process.env.MY_CHAT_ID, queryText);
            return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
        });
        test('& should not catch error', () => {
            expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
            logErrorSpy.mockClear();
        });
        test(`& should notify user ${expectedResponseCode}`, async done => {
            expect(noResultSpy).toHaveBeenCalled();
            expect(await noResultSpy.mock.results[0].value).toBe(expectedResponseCode);
            noResultSpy.mockClear();
            done();
        });
        test(`& should not get cinema`, () => {
            expect(getCinemaSpy).not.toHaveBeenCalled();
            getCinemaSpy.mockClear();
        });
    });

    describe.each(testCase.getCinemaTimeExp)('at get-cinema-time-exp, when %s, botHandler', (expectedResponseCode, queryText) => {
        test('should not throw', () => {
            const req = mockReq.plain_text(process.env.MY_CHAT_ID, queryText);
            return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
        });
        test('& should not catch error', () => {
            expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
            logErrorSpy.mockClear();
        });
        test(`& should notify user ${expectedResponseCode}`, async done => {
            expect(noResultSpy).toHaveBeenCalled();
            expect(await noResultSpy.mock.results[0].value).toBe(expectedResponseCode);
            noResultSpy.mockClear();
            done();
        });
        test(`& should not get exact slot`, () => {
            expect(getExactSlotSpy).not.toHaveBeenCalled();
            getExactSlotSpy.mockClear();
        });
    });

    describe.each(testCase.getCinemaTimeExp)('at get-time-exp, when %s, botHandler', (expectedResponseCode, queryText) => {
        test('should not throw', () => {
            const req = mockReq.plain_text(process.env.MY_CHAT_ID, queryText);
            return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
        });
        test('& should not catch error', () => {
            expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
            logErrorSpy.mockClear();
        });
        test(`& should notify user ${expectedResponseCode}`, async done => {
            expect(noResultSpy).toHaveBeenCalled();
            expect(await noResultSpy.mock.results[0].value).toBe(expectedResponseCode);
            noResultSpy.mockClear();
            done();
        });
        test(`& should not get exact slot`, () => {
            expect(getExactSlotSpy).not.toHaveBeenCalled();
            getExactSlotSpy.mockClear();
        });
    });

    describe.each(testCase.withExactTime)('at confirm-proceed, when %s, botHandler', (expectedResponseCode, queryText) => {
        test('should not throw', () => {
            const req = mockReq.plain_text(process.env.MY_CHAT_ID, queryText);
            return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
        });
        test('& should not catch error', () => {
            expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
            logErrorSpy.mockClear();
        });
        test(`& should notify user ${expectedResponseCode}`, async done => {
            expect(noResultSpy).toHaveBeenCalled();
            expect(await noResultSpy.mock.results[0].value).toBe(expectedResponseCode);
            noResultSpy.mockClear();
            done();
        });
        test(`& should not trigger getExperienceOnly, warnPlatinum, or confirmProceed`, () => {
            expect(getExperienceOnlySpy).not.toHaveBeenCalled();
            expect(warnPlatinumSpy).not.toHaveBeenCalled();
            expect(confirmProceedSpy).not.toHaveBeenCalled();
            getExperienceOnlySpy.mockClear();
            warnPlatinumSpy.mockClear();
            confirmProceedSpy.mockClear();
        });
    });

});