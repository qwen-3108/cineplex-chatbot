const connect = require('../../../../_database/connect');
const botHandler = require('../../../botHandler');
const testCase = require('./testCase');
const post = require('../../../../_telegram/post');

//files under test
const specialRatesHelper = require('./specialRatesHelper');

describe('faq.specialRates', () => {

    //setup
    let client;
    let consoleLogSpy;
    beforeAll(async done => {

        //#1: connect db
        client = await connect(process.env.MONGODB_URI, 'testDB');
        //#2: disable console log
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
        //!!! need to disable LOGS too
        //#3: mock sendMessage, sendTypingAction
        sendMessageSpy = jest.spyOn(post, 'sendMessage').mockImplementation(() => { });
        sendTypingActionSpy = jest.spyOn(post, 'sendTypingAction').mockImplementation(() => { });

        done();
    });
    afterAll(async done => {
        //close db connection
        await client.close();
        done();
    });

    //HELPER #1
    describe('.price', () => {

        const priceSpy = jest.spyOn(specialRatesHelper, 'price');

        afterEach(() => {
            priceSpy.mockClear();
            consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
        });

        test.each(testCase)('should return response code %s if user enquires ticket price for %s %s', async (expectedResponseCode, customerType, optDateTime, question, done) => {

            //execute
            const req = {
                body: {
                    "update_id": 502253052,
                    "message": {
                        "message_id": 244,
                        "from": { "id": 750594803, "is_bot": false, "first_name": "Qwen", "language_code": "en" },
                        "chat": { "id": 750594803, "first_name": "Qwen", "type": "private" },
                        "date": 1592105453,
                        "text": question
                    }
                }
            };
            await botHandler(req);

            //assert
            consoleLogSpy.mockRestore();
            expect(priceSpy).toHaveBeenCalled();
            const resolvedPriceSpyReturn = await priceSpy.mock.results[0].value;
            expect(resolvedPriceSpyReturn).toBe(expectedResponseCode);
            done();

        });

    });

    //HELPER #2
    describe('general', () => {

    });

});