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
const alertSeatProblem = require('../../_telegram/reply/alertSeatProblem');
const { ObjectId } = require('mongodb');

describe('at seat selection stage', () => {

    //setup
    let client;

    beforeAll(async done => {
        client = await connect(process.env.MONGODB_URI, 'testDB');
        jest.spyOn(COLLECTIONS.logs, 'updateOne').mockImplementation();
        // for justTakenSeat
        const showtimeUpdateStr = {};
        showtimeUpdateStr['seatingPlan.A14'] = {
            status: 1,
            reserve: { by: null, at: null },
            sold: { at: currentTime, to: null, ticketId: null }
        };
        await COLLECTIONS.showtimes.updateOne({ _id: ObjectId("5f1fbb80b21f8bd3567c532b") }, { $set: showtimeUpdateStr, $inc: { sold: 1 } })
        //seed db with two shotimes
        //
        done();
    });

    afterAll(async done => {
        //clear session in db
        await COLLECTIONS.sessions.deleteOne({ _id: process.env.MY_CHAT_ID });
        // clear justTakenSeat
        const showtimeUpdateStr = {};
        showtimeUpdateStr['seatingPlan.A14'] = {
            status: 0,
            reserve: { by: null, at: null },
            sold: { at: null, to: null, ticketId: null }
        };
        await COLLECTIONS.showtimes.updateOne({ _id: ObjectId("5f1fbb80b21f8bd3567c532b") }, { $set: showtimeUpdateStr, $dec: { sold: 1 } })

        //close connection
        await client.close();
        done();
    });

    const sendMessageSpy = jest.spyOn(post, 'sendMessage').mockImplementation();
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
    const getSeatsSpy = jest.spyOn(reply, 'getSeats');              //M6
    const invalidSeatsSpy = jest.spyOn(alertSeatProblem, 'invalidSeats')    //M7,M8,M9
    const invalidSeatPhrasesSpy = jest.spyOn(alertSeatProblem, 'invalidSeatPhrases')    //M10,11,12,13
    const takenSeatsSpy = jest.spyOn(alertSeatProblem, 'takenSeats')    //M14,15
    const justTakenSeatsSpy = jest.spyOn(alertSeatProblem, 'justTakenSeats');    //M16,17

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

    //M6
    test('on select seating plan botHandler should not throw', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '22\n');
        const req = mockReq.callback_uSId(process.env.MY_CHAT_ID, "sat");
        return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    });
    test('& should not catch error', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '23\n');
        expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
        logErrorSpy.mockClear();
    });
    test('& should that seating plan to selected and edit the clicked button', async done => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '24\n');
        const session = await COLLECTIONS.sessions.findOne({ _id: process.env.MY_CHAT_ID });
        expect(session.bookingInfo.ticketing[0].isSelected).toBe(true);
        expect(editSeatPlanButtonSpy).toHaveBeenCalled();
        editSeatPlanButtonSpy.mockClear();
        done();
    });
    test('& should sendMessage to ask preferred seat number', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '25\n');
        expect(getSeatsSpy).toHaveBeenCalled();
        getSeatsSpy.mockClear();
    });

    //M7
    test('on FIRST input non existing seat botHandler should not throw', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '26\n');
        const req = mockReq.non_existing_seat(process.env.MY_CHAT_ID);
        return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    });
    test('& should not catch error', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '27\n');
        expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
        logErrorSpy.mockClear();
    });
    test('& should call invalidSeats function', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '28\n');
        expect(invalidSeatsSpy).toHaveBeenCalled();
        invalidSeatsSpy.mockClear();
    });
    test('& should increase invalid fallback count', async done => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '29\n');
        const session = await COLLECTIONS.sessions.findOne({ _id: process.env.MY_CHAT_ID });
        expect(session.counter.invalidSeatCount).toBe(1);
        done();
    });

    //M8
    test('on SECOND input non existing seat botHandler should not throw', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '30\n');
        const req = mockReq.non_existing_seat(process.env.MY_CHAT_ID);
        return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    });
    test('& should not catch error', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '31\n');
        expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
        logErrorSpy.mockClear();
    });
    test('& should call invalidSeats function', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '32\n');
        expect(invalidSeatsSpy).toHaveBeenCalled();
        invalidSeatsSpy.mockClear();
    });
    test('& should increase invalid fallback count', async done => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '33\n');
        const session = await COLLECTIONS.sessions.findOne({ _id: process.env.MY_CHAT_ID });
        expect(session.counter.invalidSeatCount).toBe(2);
        done();
    });

    //M9
    test('on THIRD input non existing seat botHandler should not throw', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '34\n');
        const req = mockReq.non_existing_seat(process.env.MY_CHAT_ID);
        return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    });
    test('& should not catch error', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '35\n');
        expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
        logErrorSpy.mockClear();
    });
    test('& should call invalidSeats function', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '36\n');
        expect(invalidSeatsSpy).toHaveBeenCalled();
        invalidSeatsSpy.mockClear();
    });
    test('& should increase invalid fallback count', async done => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '37\n');
        const session = await COLLECTIONS.sessions.findOne({ _id: process.env.MY_CHAT_ID });
        expect(session.counter.invalidSeatCount).toBe(3);
        done();
    });
    test('& should not send message', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '38\n');
        expect(sendMessageSpy).toHaveBeenCalled();
        sendMessageSpy.mockClear();
    });

    //M10
    test('on FIRST input weird seat phases botHandler should not throw', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '39\n');
        const req = mockReq.weird_seat_phase(process.env.MY_CHAT_ID);
        return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    });
    test('& should not catch error', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '40\n');
        expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
        logErrorSpy.mockClear();
    });
    test('& should call invalidSeatPhrases function', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '41\n');
        expect(invalidSeatPhrasesSpy).toHaveBeenCalled();
        invalidSeatPhrasesSpy.mockClear();
    });
    test('& should increase invalid seat phrase count', async done => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '42\n');
        const session = await COLLECTIONS.sessions.findOne({ _id: process.env.MY_CHAT_ID });
        expect(session.counter.invalidSeatPhraseCount).toBe(1);
        done();
    });

    //M11
    test('on SECOND input weird seat phases botHandler should not throw', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '43\n');
        const req = mockReq.weird_seat_phase(process.env.MY_CHAT_ID);
        return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    });
    test('& should not catch error', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '44\n');
        expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
        logErrorSpy.mockClear();
    });
    test('& should call invalidSeatPhrases function', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '45\n');
        expect(invalidSeatPhrasesSpy).toHaveBeenCalled();
        invalidSeatPhrasesSpy.mockClear();
    });
    test('& should increase invalid seat phrase count', async done => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '46\n');
        const session = await COLLECTIONS.sessions.findOne({ _id: process.env.MY_CHAT_ID });
        expect(session.counter.invalidSeatPhraseCount).toBe(2);
        done();
    });

    //M12
    test('on THIRD input weird seat phases botHandler should not throw', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '47\n');
        const req = mockReq.weird_seat_phase(process.env.MY_CHAT_ID);
        return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    });
    test('& should not catch error', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '48\n');
        expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
        logErrorSpy.mockClear();
    });
    test('& should call invalidSeatPhrases function', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '49\n');
        expect(invalidSeatPhrasesSpy).toHaveBeenCalled();
        invalidSeatPhrasesSpy.mockClear();
    });
    test('& should increase invalid seat phrase count', async done => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '50\n');
        const session = await COLLECTIONS.sessions.findOne({ _id: process.env.MY_CHAT_ID });
        expect(session.counter.invalidSeatPhraseCount).toBe(3);
        done();
    });

    //M13
    test('on FOURTH input weird seat phases botHandler should not throw', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '51\n');
        const req = mockReq.weird_seat_phase(process.env.MY_CHAT_ID);
        return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    });
    test('& should not catch error', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '52\n');
        expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
        logErrorSpy.mockClear();
    });
    test('& should call invalidSeatPhrases function', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '53\n');
        expect(invalidSeatPhrasesSpy).toHaveBeenCalled();
        invalidSeatPhrasesSpy.mockClear();
    });
    test('& should increase invalid seat phrase count', async done => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '54\n');
        const session = await COLLECTIONS.sessions.findOne({ _id: process.env.MY_CHAT_ID });
        expect(session.counter.invalidSeatPhraseCount).toBe(4);
        done();
    });
    test('& should not send message', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '55\n');
        expect(sendMessageSpy).toHaveBeenCalled();
        sendMessageSpy.mockClear();
    });

    //M14
    test('on FIRST input taken seats botHandler should not throw', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '56\n');
        const req = mockReq.taken_seats(process.env.MY_CHAT_ID);
        return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    });
    test('& should not catch error', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '57\n');
        expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
        logErrorSpy.mockClear();
    });
    test('& should call takenSeats function', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '58\n');
        expect(takenSeatsSpy).toHaveBeenCalled();
        takenSeatsSpy.mockClear();
    });
    test('& should increase seat taken count', async done => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '59\n');
        const session = await COLLECTIONS.sessions.findOne({ _id: process.env.MY_CHAT_ID });
        expect(session.counter.seatTakenCount).toBe(1);
        done();
    });

    //M15
    test('on SECOND input taken seats botHandler should not throw', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '60\n');
        const req = mockReq.taken_seats(process.env.MY_CHAT_ID);
        return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    });
    test('& should not catch error', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '61\n');
        expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
        logErrorSpy.mockClear();
    });
    test('& should call takenSeats function', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '62\n');
        expect(takenSeatsSpy).toHaveBeenCalled();
        takenSeatsSpy.mockClear();
    });
    test('& should increase seat taken count', async done => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '63\n');
        const session = await COLLECTIONS.sessions.findOne({ _id: process.env.MY_CHAT_ID });
        expect(session.counter.seatTakenCount).toBe(2);
        done();
    });

    //M16
    test('on THIRD input taken seats botHandler should not throw', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '64\n');
        const req = mockReq.taken_seats(process.env.MY_CHAT_ID);
        return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    });
    test('& should not catch error', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '65\n');
        expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
        logErrorSpy.mockClear();
    });
    test('& should call takenSeats function', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '66\n');
        expect(takenSeatsSpy).toHaveBeenCalled();
        takenSeatsSpy.mockClear();
    });
    test('& should increase seat taken count', async done => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '67\n');
        const session = await COLLECTIONS.sessions.findOne({ _id: process.env.MY_CHAT_ID });
        expect(session.counter.seatTakenCount).toBe(3);
        done();
    });
    test('& should not send message', () => {
        fs.appendFileSync(`./#test/noBreak/debug.txt`, '68\n');
        expect(sendMessageSpy).toHaveBeenCalled();
        sendMessageSpy.mockClear();
    });

    // //M17
    // test('on FIRST input just taken seats botHandler should not throw', () => {
    //     fs.appendFileSync(`./#test/noBreak/debug.txt`, '69\n');
    //     return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    // });
    // test('& should not catch error', () => {
    //     fs.appendFileSync(`./#test/noBreak/debug.txt`, '70\n');
    //     expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
    //     logErrorSpy.mockClear();
    // });
    // test('& should call justTakenSeats function', () => {
    //     fs.appendFileSync(`./#test/noBreak/debug.txt`, '71\n');
    //     expect(justTakenSeatsSpy).toHaveBeenCalled();
    //     justTakenSeatsSpy.mockClear();
    // });
    // test('& should increase just taken count', async done => {
    //     fs.appendFileSync(`./#test/noBreak/debug.txt`, '72\n');
    //     const session = await COLLECTIONS.sessions.findOne({ _id: process.env.MY_CHAT_ID });
    //     expect(session.counter.justTakenCount).toBe(1);
    //     done();
    // });

    // //M18
    // test('on SECOND input just taken seats botHandler should not throw', () => {
    //     fs.appendFileSync(`./#test/noBreak/debug.txt`, '73\n');
    //     const req = mockReq.just_taken_seats(process.env.MY_CHAT_ID);
    //     return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    // });
    // test('& should not catch error', () => {
    //     fs.appendFileSync(`./#test/noBreak/debug.txt`, '74\n');
    //     expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
    //     logErrorSpy.mockClear();
    // });
    // test('& should call justTakenSeats function', () => {
    //     fs.appendFileSync(`./#test/noBreak/debug.txt`, '75\n');
    //     expect(justTakenSeatsSpy).toHaveBeenCalled();
    //     justTakenSeatsSpy.mockClear();
    // });
    // test('& should increase just taken count', async done => {
    //     fs.appendFileSync(`./#test/noBreak/debug.txt`, '76\n');
    //     const session = await COLLECTIONS.sessions.findOne({ _id: process.env.MY_CHAT_ID });
    //     expect(session.counter.justTakenCount).toBe(2);
    //     done();
    // });

    // //M19
    // test('on THIRD input just taken seats botHandler should not throw', () => {
    //     fs.appendFileSync(`./#test/noBreak/debug.txt`, '76\n');
    //     const req = mockReq.just_taken_seats(process.env.MY_CHAT_ID);
    //     return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    // });
    // test('& should not catch error', () => {
    //     fs.appendFileSync(`./#test/noBreak/debug.txt`, '77\n');
    //     expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
    //     logErrorSpy.mockClear();
    // });
    // test('& should call justTakenSeats function', () => {
    //     fs.appendFileSync(`./#test/noBreak/debug.txt`, '78\n');
    //     expect(justTakenSeatsSpy).toHaveBeenCalled();
    //     justTakenSeatsSpy.mockClear();
    // });
    // test('& should increase just taken count', async done => {
    //     fs.appendFileSync(`./#test/noBreak/debug.txt`, '79\n');
    //     const session = await COLLECTIONS.sessions.findOne({ _id: process.env.MY_CHAT_ID });
    //     expect(session.counter.justTakenCount).toBe(3);
    //     done();
    // });

    // //M20
    // test('on FOURTH input just taken seats botHandler should not throw', () => {
    //     fs.appendFileSync(`./#test/noBreak/debug.txt`, '80\n');
    //     const req = mockReq.just_taken_seats(process.env.MY_CHAT_ID);
    //     return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    // });
    // test('& should not catch error', () => {
    //     fs.appendFileSync(`./#test/noBreak/debug.txt`, '81\n');
    //     expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
    //     logErrorSpy.mockClear();
    // });
    // test('& should call justTakenSeats function', () => {
    //     fs.appendFileSync(`./#test/noBreak/debug.txt`, '82\n');
    //     expect(justTakenSeatsSpy).toHaveBeenCalled();
    //     justTakenSeatsSpy.mockClear();
    // });
    // test('& should increase just taken count', async done => {
    //     fs.appendFileSync(`./#test/noBreak/debug.txt`, '83\n');
    //     const session = await COLLECTIONS.sessions.findOne({ _id: process.env.MY_CHAT_ID });
    //     expect(session.counter.justTakenCount).toBe(4);
    //     done();
    // });

    // //M21
    // test('on FIFTH input just taken seats botHandler should not throw', () => {
    //     fs.appendFileSync(`./#test/noBreak/debug.txt`, '80\n');
    //     const req = mockReq.just_taken_seats(process.env.MY_CHAT_ID);
    //     return expect(botHandler(req, fakeRes)).resolves.toBe(undefined);
    // });
    // test('& should not catch error', () => {
    //     fs.appendFileSync(`./#test/noBreak/debug.txt`, '81\n');
    //     expect(logErrorSpy).not.toHaveBeenCalledWith(process.env.MY_CHAT_ID, '-----! Error-----');
    //     logErrorSpy.mockClear();
    // });
    // test('& should call justTakenSeats function', () => {
    //     fs.appendFileSync(`./#test/noBreak/debug.txt`, '82\n');
    //     expect(justTakenSeatsSpy).toHaveBeenCalled();
    //     justTakenSeatsSpy.mockClear();
    // });
    // test('& should increase just taken count', async done => {
    //     fs.appendFileSync(`./#test/noBreak/debug.txt`, '83\n');
    //     const session = await COLLECTIONS.sessions.findOne({ _id: process.env.MY_CHAT_ID });
    //     expect(session.counter.justTakenCount).toBe(5);
    //     done();
    // });
    // test('& should not send message', () => {
    //     fs.appendFileSync(`./#test/noBreak/debug.txt`, '84\n');
    //     expect(sendMessageSpy).toHaveBeenCalled();
    //     sendMessageSpy.mockClear();
    // });

});