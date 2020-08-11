const fs = require('fs');
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
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '1\n');
        const req = mockReq.message_via_bot(process.env.MY_CHAT_ID, "sat");
        return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    });
    test('& should not catch error', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '2\n');
        expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
        logErrorSpy.mockClear();
    });
    test('& should send first guide', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '3\n');
        expect(firstShowtimeSpy).toHaveBeenCalled();
        expect(firstShowtimeSpy).toHaveBeenCalledWith(process.env.MY_CHAT_ID);
        firstShowtimeSpy.mockClear();
    });
    test("& should set 'seenShowtimeCard' to 1", async done => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '4\n');
        const session = await COLLECTIONS.sessions.findOne({ _id: process.env.MY_CHAT_ID });
        expect(session.counter.seenShowtimeCard).toBe(1);
        done();
    });

    //M2: second showtime picked
    test('on second showtime card received, botHandler should not throw', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '5\n');
        const req = mockReq.message_via_bot(process.env.MY_CHAT_ID, "sun");
        return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    });
    test('& should not catch error', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '6\n');
        expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
        logErrorSpy.mockClear();
    });
    test('& should not send first guide', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '7\n');
        expect(firstShowtimeSpy).not.toHaveBeenCalled();
        firstShowtimeSpy.mockClear();
    });

    // M3: first seating plan picked
    test('on first seating plan picked botHandler should not throw', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '8\n');
        const req = mockReq.callback_sId(process.env.MY_CHAT_ID, "sat");
        return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    });
    test('& should not catch error', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '9\n');
        expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
        logErrorSpy.mockClear();
    });
    test('& should send seat legend', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '10\n');
        expect(sendSeatLegendSpy).toHaveBeenCalled();
        expect(sendSeatLegendSpy).toHaveBeenCalledWith(process.env.MY_CHAT_ID);
        sendSeatLegendSpy.mockClear();
    });
    test('& should send seat plan without button', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '11\n');
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
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '12\n');
        const req = mockReq.callback_sId(process.env.MY_CHAT_ID, "sun");
        return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    });
    test('& should not catch error', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '13\n');
        expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
        logErrorSpy.mockClear();
    });
    test('& should not send seat legend', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '14\n');
        expect(sendSeatLegendSpy).not.toHaveBeenCalled();
        sendSeatLegendSpy.mockClear();
    });
    test('& should send seat plan with button', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '15\n');
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
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '16\n');
        expect(editSeatPlanButtonSpy).toHaveBeenCalled();
        editSeatPlanButtonSpy.mockClear();
    });
    test('& should set first seat plan isSelected to false', async done => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '17\n');
        const session = await COLLECTIONS.sessions.findOne({ _id: process.env.MY_CHAT_ID });
        expect(session.bookingInfo.ticketing[0].isSelected).toBe(false);
        done();
    });


    //M5
    test('on first seating plan picked AGAIN botHandler should not throw', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '18\n');
        const req = mockReq.callback_sId(process.env.MY_CHAT_ID, "sat");
        return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    });
    test('& should not catch error', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '19\n');
        expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
        logErrorSpy.mockClear();
    });
    test('& should delete previous first seating plan', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '20\n');
        expect(deleteRepeatSeatPlanSpy).toHaveBeenCalled();
        deleteRepeatSeatPlanSpy.mockClear();
    });
    test('& should send seating plan again', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '21\n');
        expect(sendSeatPlanSpy).toHaveBeenCalled();
        sendSeatPlanSpy.mockClear();
    });




});