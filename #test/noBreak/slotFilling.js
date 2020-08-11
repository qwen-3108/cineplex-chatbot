const connect = require('../../_database/connect');
//files to mock/stub
const { COLLECTIONS } = require('../../@global/COLLECTIONS');
const LOGS = require('../../@global/LOGS');
const post = require('../../_telegram/post');
const reply = require('../../_telegram/reply');
//mock requests generator
// const mockReq = require('./mockReq/mockReq');
//files under test
const botHandler = require('../../route/botHandler');


describe('at slot filling stage', () => {

    let client;

    beforeAll(async done => {
        client = await connect(process.env.MONGODB_URI, 'testDB');
        jest.spyOn(COLLECTIONS.logs, 'updateOne').mockImplementation();
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

    test('when no slot is found based on user input, botHandler should not throw', () => {

    });
    test('& should not catch error', () => {

    });
    test('& should not catch error', () => {

    });







});