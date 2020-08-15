const makeDateTimePhrase = require("../../@util/makeDateTimePhrase");
const { includeTimeTestCase, expressTimeTestCase, expressDateTestCase, combineDateTimeTestCase } = require('./testCase/makeDateTimePhrase');

describe('makeDateTimePhrase', () => {

    test('should detect whether to include time correctly', () => {

        for (let i = 0; i < includeTimeTestCase.length; i++) {
            const currentTestCase = includeTimeTestCase[i];
            const dateTimePhrase = makeDateTimePhrase(...currentTestCase[0]);
            expect(dateTimePhrase).toBe(currentTestCase[1]);
        }

    });

    test('should express time correctly', () => {

        for (let i = 0; i < expressTimeTestCase.length; i++) {
            const currentTestCase = expressTimeTestCase[i];
            const dateTimePhrase = makeDateTimePhrase(...currentTestCase[0]);
            expect(dateTimePhrase).toBe(currentTestCase[1]);
        }

    });

    test('should express date & date range correctly', () => {

        for (let i = 0; i < expressDateTestCase.length; i++) {
            const currentTestCase = expressDateTestCase[i];
            const dateTimePhrase = makeDateTimePhrase(...currentTestCase[0]);
            expect(dateTimePhrase).toBe(currentTestCase[1]);
        }

        sessionStartedAt = new Date('2020-08-10T09:00:00+08:00'); //reset sessionStartedAt

    });

    test('should combine date and time correctly', () => {

        for (let i = 0; i < combineDateTimeTestCase.length; i++) {
            const currentTestCase = combineDateTimeTestCase[i];
            const dateTimePhrase = makeDateTimePhrase(...currentTestCase[0]);
            expect(dateTimePhrase).toBe(currentTestCase[1]);
        }

    });

});