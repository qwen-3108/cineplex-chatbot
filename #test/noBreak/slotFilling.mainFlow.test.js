const fs = require('fs');
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
const messages = [
    "I'd like to watch a movie",
    "Avatar",
    "Hm I'll watch tenet then",
    "next Monday",
    "this weekend",
    "saturday",
    "alright this Friday",
    "Cathay Cineplex JEM"
]
//files under test
const botHandler = require('../../route/botHandler');


describe('main flow', () => {

    let client;

    beforeAll(async done => {
        client = await connect(process.env.MONGODB_URI, 'testDB');
        jest.spyOn(COLLECTIONS.logs, 'updateOne').mockImplementation();
        jest.spyOn(COLLECTIONS.logs, 'findOne').mockImplementation();
        //make init use fixed date
        jest.spyOn(Session.prototype, 'init').mockImplementation(init);
        done();
    });

    afterAll(async done => {
        //clear session in db
        await COLLECTIONS.sessions.deleteOne({ _id: process.env.MY_CHAT_ID });
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
    // jest.spyOn(console, 'error').mockImplementation();

    let consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    const fakeRes = { end: function () { } };

    //spies to test
    const logErrorSpy = jest.spyOn(LOGS, 'logError');
    const getMovieSpy = jest.spyOn(reply.fillSlot, 'getMovie');
    const upcomingMovieSpy = jest.spyOn(reply, 'upcomingMovie');
    const getDateTimeSpy = jest.spyOn(reply.fillSlot, 'getDateTime');
    const invalidDateTimeSpy = jest.spyOn(reply, 'invalidDateTime');
    const getCinemaSpy = jest.spyOn(reply.fillSlot, 'getCinema');
    const getExactSlotSpy = jest.spyOn(reply.fillSlot, 'getExactSlot');

    //M1
    //U: I'd like to watch a movie
    //B: Cool. For which movie + now showing
    test('when user request to book ticket without stating movie, botHandler should not throw', () => {
        fs.appendFileSync(`./#test/noBreak/debug_slotFilling.txt`, '1\n');
        const req = mockReq.plain_text(process.env.MY_CHAT_ID, messages[0]);
        return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    });
    test('& should not catch error', () => {
        fs.appendFileSync(`./#test/noBreak/debug_slotFilling.txt`, '2\n');
        expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
        logErrorSpy.mockClear();
    });
    test('& should ask for movie', () => {
        fs.appendFileSync(`./#test/noBreak/debug_slotFilling.txt`, '3\n');
        expect(getMovieSpy).toHaveBeenCalled();
        getMovieSpy.mockClear();
    });

    //M2
    //U: Avatar
    //B: Will be released on.. tickets available from.. anything else I can help?
    test('when user try to book upcoming movie, botHandler should not throw', () => {
        fs.appendFileSync(`./#test/noBreak/debug_slotFilling.txt`, '4\n');
        const req = mockReq.plain_text(process.env.MY_CHAT_ID, messages[1]);
        return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    });
    test('& should not catch error', () => {
        fs.appendFileSync(`./#test/noBreak/debug_slotFilling.txt`, '5\n');
        expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
        logErrorSpy.mockClear();
    });
    test('& should tell user movie has not been released, when ticket will become available, and try to be helpful', () => {
        fs.appendFileSync(`./#test/noBreak/debug_slotFilling.txt`, '6\n');
        expect(upcomingMovieSpy).toHaveBeenCalled();
        upcomingMovieSpy.mockClear();
    });
    //all other slotFilling functions not.toHaveBeenCalled 

    //M3
    //U: Hm I will watch tenet then
    //B: Cool. Around when? showtimes are updated til
    test('when user try to book a movie that is now showing without providing date time, botHandler should not throw', () => {
        fs.appendFileSync(`./#test/noBreak/debug_slotFilling.txt`, '7\n');
        const req = mockReq.plain_text(process.env.MY_CHAT_ID, messages[2]);
        return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    });
    test('& should not catch error', () => {
        fs.appendFileSync(`./#test/noBreak/debug_slotFilling.txt`, '8\n');
        expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
        logErrorSpy.mockClear();
    });
    test('& should ask for date/time', () => {
        fs.appendFileSync(`./#test/noBreak/debug_slotFilling.txt`, '9\n');
        expect(getDateTimeSpy).toHaveBeenCalled();
        getDateTimeSpy.mockClear();
    });

    //M4
    //U: next monday (totally exceed schedules)
    //B: movie schedules are only updated until tue night. any day before this works?
    test('when user provide date/time that totally exceed schedules, botHandler should not throw', () => {
        fs.appendFileSync(`./#test/noBreak/debug_slotFilling.txt`, '10\n');
        const req = mockReq.plain_text(process.env.MY_CHAT_ID, messages[3]);
        return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    });
    test('& should not catch error', () => {
        fs.appendFileSync(`./#test/noBreak/debug_slotFilling.txt`, '11\n');
        expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
        logErrorSpy.mockClear();
    });
    test('& ask user any day before max date works', async done => {
        fs.appendFileSync(`./#test/noBreak/debug_slotFilling.txt`, '12\n');
        expect(invalidDateTimeSpy).toHaveBeenCalled();
        expect(await invalidDateTimeSpy.mock.results[0].value).toBe('totalExceed');
        invalidDateTimeSpy.mockClear();
        done();
    });

    //M5
    //U: next weekend (partially exceed)
    //B: 
    test('when user provide date/time that partially exceed schedules, botHandler should not throw', () => {
        fs.appendFileSync(`./#test/noBreak/debug_slotFilling.txt`, '13\n');
        const req = mockReq.plain_text(process.env.MY_CHAT_ID, messages[4]);
        return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    });
    test('& should not catch error', () => {
        fs.appendFileSync(`./#test/noBreak/debug_slotFilling.txt`, '14\n');
        expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
        logErrorSpy.mockClear();
    });
    test('& suggest to provide showtimes within range', async done => {
        fs.appendFileSync(`./#test/noBreak/debug_slotFilling.txt`, '15\n');
        expect(invalidDateTimeSpy).toHaveBeenCalled();
        expect(await invalidDateTimeSpy.mock.results[0].value).toBe('partialExceed');
        invalidDateTimeSpy.mockClear();
        done();
    });

    //M6
    //U: next saturday (partially exceed, same day)
    //B:
    test('when user provide date/time that partially exceed schedules, botHandler should not throw', () => {
        fs.appendFileSync(`./#test/noBreak/debug_slotFilling.txt`, '16\n');
        const req = mockReq.plain_text(process.env.MY_CHAT_ID, messages[5]);
        return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    });
    test('& should not catch error', () => {
        fs.appendFileSync(`./#test/noBreak/debug_slotFilling.txt`, '17\n');
        expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
        logErrorSpy.mockClear();
    });
    test('& suggest to provide showtimes within range', async done => {
        fs.appendFileSync(`./#test/noBreak/debug_slotFilling.txt`, '18\n');
        expect(invalidDateTimeSpy).toHaveBeenCalled();
        expect(await invalidDateTimeSpy.mock.results[0].value).toBe('partialExceed');
        invalidDateTimeSpy.mockClear();
        done();
    });

    //M7
    //U: Ok this friday then
    //B: Great, any place in mind?
    test('when user provide date/time that is within range without stating preferred location/cinema, botHandler should not throw', () => {
        fs.appendFileSync(`./#test/noBreak/debug_slotFilling.txt`, '19\n');
        const req = mockReq.plain_text(process.env.MY_CHAT_ID, messages[6]);
        return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    });
    test('& should not catch error', () => {
        fs.appendFileSync(`./#test/noBreak/debug_slotFilling.txt`, '20\n');
        expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
        logErrorSpy.mockClear();
    });
    test('& should get cinema/place', async done => {
        fs.appendFileSync(`./#test/noBreak/debug_slotFilling.txt`, '21\n');
        expect(getCinemaSpy).toHaveBeenCalled();
        getCinemaSpy.mockClear();
        done();
    });

    //M8:
    //U: Cathay cineplex JEM
    //B: show showtimes
    test('when user choose cinema from provided list, botHandler should not throw', () => {
        fs.appendFileSync(`./#test/noBreak/debug_slotFilling.txt`, '22\n');
        const req = mockReq.message_via_bot_cinema(process.env.MY_CHAT_ID, messages[7]);
        return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    });
    test('& should not catch error', () => {
        fs.appendFileSync(`./#test/noBreak/debug_slotFilling.txt`, '23\n');
        expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
        logErrorSpy.mockClear();
    });
    test('& should show available showtimes', async done => {
        fs.appendFileSync(`./#test/noBreak/debug_slotFilling.txt`, '24\n');
        expect(getExactSlotSpy).toHaveBeenCalled();
        getExactSlotSpy.mockClear();
        done();
    });

});