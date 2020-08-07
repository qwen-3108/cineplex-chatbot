const { addDays, format } = require('date-fns');

module.exports = function decideMaxTime(startedAt) {

    const output = { maxDate: 0, maxTimePhrase: '' };

    const startTime = startedAt.getHours();

    if (startTime >= 0 && startTime < 6) {

        output.maxDate = addDays(startedAt, 6);
        output.maxDate.setHours(23, 59, 59);
        output.maxTimePhrase = `coming ${format(maxDate, 'EEEE (d/M)')} night`;

    } else if (startTime >= 6 && startTime < 12) {

        output.maxDate = addDays(startedAt, 7);
        output.maxDate.setHours(5, 59, 59);
        const showDate = addDays(startedAt, 6);
        output.maxTimePhrase = `coming ${format(showDate, 'EEEE (d/M)')} (inclusive of times past midnight before dawn)`;

    } else if (startTime >= 12 && startTime < 18) {

        output.maxDate = addDays(startedAt, 7);
        output.maxDate.setHours(11, 59, 59);
        output.maxTimePhrase = `coming ${format(output.maxDate, 'EEEE (d/M)')} noon`;

    } else if (startTime >= 18 && startTime <= 23) {

        output.maxDate = addDays(startedAt, 7);
        output.maxDate = setHours(17, 59, 59);
        output.maxTimePhrase = `coming ${format(output.maxDate, 'EEEE (d/M)')} afternoon`;

    }

    return output;
}