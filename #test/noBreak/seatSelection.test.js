const connect = require('../../_database/connect');
//files to mock/stub
const { COLLECTIONS } = require('../../@global/COLLECTIONS');
const LOGS = require('../../@global/LOGS');
const post = require('../../_telegram/post');
const reply = require('../../_telegram/reply');
//mock requests generator
const mockReq = require('./mockReq/mockReq');
//files under test
const botHandler = require('../../route/botHandler');

describe('at seat selection stage', () => {

    //setup
    let client;

    beforeAll(async done => {
        client = await connect(process.env.MONGODB_URI, 'testDB');
        jest.spyOn(COLLECTIONS.logs, 'updateOne').mockImplementation();
        //seed db with two shotimes
        //
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

    let consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    const fakeRes = { end: function () { } };

    //spies to test
    const logErrorSpy = jest.spyOn(LOGS, 'logError').mockImplementation();
    const firstShowtimeSpy = jest.spyOn(reply, 'firstShowtimeCard'); //M1, M2
    const sendSeatLegendSpy = jest.spyOn(reply, 'sendSeatLegend'); //M3

    //M1: first showtime picked 
    test('on first showtime card received, botHandler should not throw', () => {
        const req = mockReq.message_via_bot(process.env.MY_CHAT_ID, "sat");
        return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    });
    test('& should not catch error', () => {
        expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
    });
    test('& should send first guide', () => {
        expect(firstShowtimeSpy).toHaveBeenCalled();
        expect(firstShowtimeSpy).toHaveBeenCalledWith(process.env.MY_CHAT_ID);
    });
    test("& should set 'seenShowtimeCard' to 1", async done => {
        const session = await COLLECTIONS.sessions.findOne({ _id: process.env.MY_CHAT_ID });
        expect(session.counter.seenShowtimeCard).toBe(1);
        done();
    });

    //M2: second showtime picked
    test('on second showtime card received, botHandler should not throw', () => {
        firstShowtimeSpy.mockClear();
        const req = mockReq.message_via_bot(process.env.MY_CHAT_ID, "sun");
        return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    });
    test('& should not catch error', () => {
        expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
    });
    test('& should not send first guide', () => {
        expect(firstShowtimeSpy).not.toHaveBeenCalled();
    });

    //M3: first seating plan picked
    // test('on first seating plan picked botHandler should not throw', () => {
    //     const req = mockReq.callback_sId(process.env.MY_CHAT_ID, "sat");
    //     return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    // });
    // test('& should not catch error', () => {
    //     expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
    // });
    // test('& should send seat legend', () => {
    //     expect(sendSeatLegendSpy).toHaveBeenCalled();
    //     expect(sendSeatLegendSpy).toHaveBeenCalledWith(process.env.MY_CHAT_ID);
    // });
    // test('& should send seat plan', () => {
    //     expect(sendSeatPlanSpy).toHaveBeenCalled();
    //     expect(sendSeatPlanSpy).toHaveBeenCalledWith();
    // });
    // test('& seat plan should not have button', () => {

    // });

    //M4: second seating plan picked


});