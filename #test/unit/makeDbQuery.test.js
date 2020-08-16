const makeDbQuery = require("../../@util/makeDbQuery");
const testCase = require('./testCase');

describe('at makeDbQuery', () => {

    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    test.each(testCase.makeDbQuery)("%s", (description, { movieId, dateTimeObj, cinemaArr, experience }, expectedQuery) => {

        const sessionStartedAt = new Date(dateTimeObj.sessionStartedAt);
        const dateStart = dateTimeObj.start == null ? null : new Date(dateTimeObj.start);
        const dateEnd = dateTimeObj.end == null ? null : new Date(dateTimeObj.end);
        const bookingInfo = {
            movie: { id: movieId },
            cinema: cinemaArr,
            dateTime: {
                start: dateStart,
                end: dateEnd,
                sessionStartedAt: sessionStartedAt
            }
        }
        if (experience !== undefined) {
            bookingInfo.experience = experience;
        }

        const { combinedQuery, availabilityQuery } = makeDbQuery(bookingInfo);

        expect(combinedQuery).toEqual(expectedQuery);

    });


});
