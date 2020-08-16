const testCase = require('./testCase/makeDetailsStr');
const makeDetailsStr = require('../../@util/makeDetailsStr');

describe('makeDetailsStr', () => {

    test('should throw when no movie.title is null in bookingInfo', () => {

        //execute & assert
        expect(() => makeDetailsStr(...testCase.noMovie[0][0])).toThrow();

    });

    test('should not output experience when ignoreExperience is set to true', () => {
        //execute
        const output = makeDetailsStr(...testCase.ignoreExperience[0][0]);
        //assert
        expect(output).toBe(testCase.ignoreExperience[0][1]);
    });

    describe('should make details str correctly when provided with', () => {
        test.each(testCase.makeDetailsStr)('%s', (description, args, expectedDetailsStr) => {
            //execute
            const output = makeDetailsStr(...args);
            //assert
            expect(output).toBe(expectedDetailsStr);

        });
    });


});