const { addDays, format, subDays } = require('date-fns');

module.exports = { date, phrase };

function date(startedAt) {

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
}

function phrase(maxDate) {

    switch (maxDate.getHours()) {
        case 5:
            const showDate = subDays(maxDate, 1);
            return `${format(showDate, 'EEEE (d/M)')} (inclusive of times past midnight before dawn)`;
        case 11:
            return `next ${format(maxDate, 'EEEE (d/M)')} noon`;
        case 17:
            return `next ${format(maxDate, 'EEEE (d/M)')} afternoon`;
        case 23:
            return `${format(maxDate, 'EEEE (d/M)')} night`;
        default:
            throw `Not valid max date`;
    }

}