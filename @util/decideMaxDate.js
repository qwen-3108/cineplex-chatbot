const { addDays } = require('date-fns');

module.exports = function decideMaxDate(startedAt) {

    let maxDate;

    const startTime = startedAt.getHours();

    if (startTime >= 0 && startTime < 6) {

        maxDate = addDays(startedAt, 6);
        maxDate.setHours(23, 59, 59);

    } else if (startTime >= 6 && startTime < 12) {

        maxDate = addDays(startedAt, 7);
        maxDate.setHours(5, 59, 59);

    } else if (startTime >= 12 && startTime < 18) {

        maxDate = addDays(startedAt, 7);
        maxDate.setHours(11, 59, 59);

    } else if (startTime >= 18 && startTime <= 23) {

        maxDate = addDays(startedAt, 7);
        maxDate.setHours(17, 59, 59);

    }

    return maxDate;
};
