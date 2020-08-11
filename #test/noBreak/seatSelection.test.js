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
const editSeatPlan = require('../../_telegram/reply/editSeatPlan');
const FormData = require('form-data');

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
    jest.spyOn(post, 'answerInlineQuery').mockImplementation();
    jest.spyOn(post, 'answerPreCheckoutQuery').mockImplementation();
    jest.spyOn(post, 'deleteMessage').mockImplementation();
    jest.spyOn(post, 'editMessageMedia').mockImplementation();
    jest.spyOn(post, 'editMessageReplyMarkup').mockImplementation();
    jest.spyOn(post, 'editMessageText').mockImplementation();
    jest.spyOn(post, 'sendInvoice').mockImplementation();
    jest.spyOn(post, 'sendPhoto').mockImplementation();
    jest.spyOn(LOGS, 'initializeLogs').mockImplementation();
    jest.spyOn(LOGS, 'logInfo').mockImplementation();
    jest.spyOn(LOGS, 'logConv').mockImplementation();
    jest.spyOn(LOGS, 'getLogs').mockImplementation();

    let consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    const fakeRes = { end: function () { } };

    //spies to test
    const logErrorSpy = jest.spyOn(LOGS, 'logError').mockImplementation();
    const firstShowtimeSpy = jest.spyOn(reply, 'firstShowtimeCard'); //M1, M2
    const sendSeatPlanSpy = jest.spyOn(reply, 'sendSeatPlan');      //M3, M4
    const sendSeatLegendSpy = jest.spyOn(reply, 'sendSeatLegend');  //M3, M4
    const editSeatPlanButtonSpy = jest.spyOn(reply, 'editSeatPlanButton');  //M4
    const formDataAppendSpy = jest.spyOn(FormData.prototype, 'append');     //M4
    const deleteRepeatSeatPlanSpy = jest.spyOn(reply, 'deleteRepeatSeatPlan');  //M5

    //M1: first showtime picked 
    test('on first showtime card received, botHandler should not throw', () => {
        const req = mockReq.message_via_bot(process.env.MY_CHAT_ID, "sat");
        return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    });
    test('& should not catch error', () => {
        expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
        logErrorSpy.mockClear();
    });
    test('& should send first guide', () => {
        expect(firstShowtimeSpy).toHaveBeenCalled();
        expect(firstShowtimeSpy).toHaveBeenCalledWith(process.env.MY_CHAT_ID);
        firstShowtimeSpy.mockClear();
    });
    test("& should set 'seenShowtimeCard' to 1", async done => {
        const session = await COLLECTIONS.sessions.findOne({ _id: process.env.MY_CHAT_ID });
        expect(session.counter.seenShowtimeCard).toBe(1);
        done();
    });

    //M2: second showtime picked
    test('on second showtime card received, botHandler should not throw', () => {
        const req = mockReq.message_via_bot(process.env.MY_CHAT_ID, "sun");
        return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    });
    test('& should not catch error', () => {
        expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
        logErrorSpy.mockClear();
    });
    test('& should not send first guide', () => {
        expect(firstShowtimeSpy).not.toHaveBeenCalled();
        firstShowtimeSpy.mockClear();
    });

    // M3: first seating plan picked
    test('on first seating plan picked botHandler should not throw', () => {
        const req = mockReq.callback_sId(process.env.MY_CHAT_ID, "sat");
        return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    });
    test('& should not catch error', () => {
        expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
        logErrorSpy.mockClear();
    });
    test('& should send seat legend', () => {
        expect(sendSeatLegendSpy).toHaveBeenCalled();
        expect(sendSeatLegendSpy).toHaveBeenCalledWith(process.env.MY_CHAT_ID);
        sendSeatLegendSpy.mockClear();
    });
    test('& should send seat plan without button', () => {
        expect(sendSeatPlanSpy).toHaveBeenCalled();
        const formDataAppendedKeys = [];
        formDataAppendSpy.mock.calls.forEach(function (arg) {
            formDataAppendedKeys.push(arg[0]);
        });
        expect(formDataAppendedKeys).not.toContain('reply_markup');
        sendSeatPlanSpy.mockClear();
        formDataAppendSpy.mockClear();
    });

    // M4: second seating plan picked
    // (1) whether called or not, (2) called how mnay times, (3) arguments, (4) whether return, (5) return value, (6) whether throw
    test('on second seating plan picked botHandler should not throw', () => {
        const req = mockReq.callback_sId(process.env.MY_CHAT_ID, "sun");
        return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    });
    test('& should not catch error', () => {
        expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
        logErrorSpy.mockClear();
    });
    test('& should not send seat legend', () => {
        expect(sendSeatLegendSpy).not.toHaveBeenCalled();
        sendSeatLegendSpy.mockClear();
    });
    test('& should send seat plan with button', () => {
        expect(sendSeatPlanSpy).toHaveBeenCalled();
        const formDataAppendedKeys = [];
        formDataAppendSpy.mock.calls.forEach(function (arg) {
            formDataAppendedKeys.push(arg[0]);
        });
        expect(formDataAppendedKeys).toContain('reply_markup');
        sendSeatPlanSpy.mockClear();
        formDataAppendSpy.mockClear();
    });
    test('& should attach seat plan button to first seat plan', () => {
        expect(editSeatPlanButtonSpy).toHaveBeenCalled();
        editSeatPlanButtonSpy.mockClear();
    });
    test('& should set first seat plan isSelected to false', async done => {
        const session = await COLLECTIONS.sessions.findOne({ _id: process.env.MY_CHAT_ID });
        expect(session.bookingInfo.ticketing[0].isSelected).toBe(false);
        done();
    });


    //M5
    test('on first seating plan picked AGAIN botHandler should not throw', () => {
        const req = mockReq.callback_sId(process.env.MY_CHAT_ID, "sat");
        return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    });
    test('& should not catch error', () => {
        expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
        logErrorSpy.mockClear();
    });
    test('& should delete previous first seating plan', () => {
        expect(deleteRepeatSeatPlanSpy).toHaveBeenCalled();
        deleteRepeatSeatPlanSpy.mockClear();
    });
    test('& should send seating plan again', () => {
        expect(sendSeatPlanSpy).toHaveBeenCalled();
        sendSeatPlanSpy.mockClear();
    });




});