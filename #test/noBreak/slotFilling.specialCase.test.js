const connect = require('../../_database/connect');
//files to mock/stub
const { COLLECTIONS } = require('../../@global/COLLECTIONS');
const LOGS = require('../../@global/LOGS');
const post = require('../../_telegram/post');
const reply = require('../../_telegram/reply');
const Session = require('../../@class/Session');
//mock requests generator
const mockReq = require('./mockReq/mockReq');
const testCase = require('./testCase');
//files under test
const botHandler = require('../../route/botHandler');


describe('special case:', () => {

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
    const logErrorSpy = jest.spyOn(LOGS, 'logError').mockImplementation();
    logErrorSpy.mockName('logErrorSpy');
    const getExperienceOnlySpy = jest.spyOn(reply.fillSlot, 'getExperienceOnly').mockName('getExperienceOnlySpy');
    const warnPlatinumSpy = jest.spyOn(reply, 'warnPlatinum').mockName('warnPlatinumSpy');
    const confirmProceedSpy = jest.spyOn(reply.fillSlot, 'confirmProceed').mockName('confirmProceedSpy');
    const noResultSpy = jest.spyOn(reply, 'noResult').mockName('noResultSpy');

    describe.each(testCase.getExperience)('when 2 results found are of same showtime but diff exp, botHandler', queryText => {
        test('should not throw', () => {
            const req = mockReq.plain_text(process.env.MY_CHAT_ID, queryText);
            return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
        });
        test('& should not catch error', () => {
            expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
            logErrorSpy.mockClear();
        });
        test(`& should not trigger noResult`, () => {
            expect(noResultSpy).not.toHaveBeenCalled();
        });
        test('& should mention both experiences, their respective prices and let user pick', () => {
            expect(getExperienceOnlySpy).toHaveBeenCalled();
        });
    });

    describe.each(testCase.warnPlatinum)('when only 1 platinum showtime is found but user did not request for platinum, botHandler', queryText => {
        test('should not throw', () => {
            const req = mockReq.plain_text(process.env.MY_CHAT_ID, queryText);
            return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
        });
        test('& should not catch error', () => {
            expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
            logErrorSpy.mockClear();
        });
        test(`& should not trigger noResult`, () => {
            expect(noResultSpy).not.toHaveBeenCalled();
        });
        test("& should highlight the showtime is in platinum movie suites and ask user if it's ok", () => {
            expect(warnPlatinumSpy).toHaveBeenCalled();
        });
    });

    describe.each(testCase.confirmProceed)('when only 1 showtime is found, botHandler', queryText => {
        test('should not throw', () => {
            const req = mockReq.plain_text(process.env.MY_CHAT_ID, queryText);
            return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
        });
        test('& should not catch error', () => {
            expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
            logErrorSpy.mockClear();
        });
        test(`& should not trigger noResult`, () => {
            expect(noResultSpy).not.toHaveBeenCalled();
        });
        test('& should repeat details and get user acknowledgement to proceed', () => {
            expect(confirmProceedSpy).toHaveBeenCalled();
        });
    });
});
