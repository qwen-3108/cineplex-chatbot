const { format, subDays } = require('date-fns');

module.exports = function phrase(maxDate) {

    switch (maxDate.getHours()) {
        case 5:
            const showDate = subDays(maxDate, 1);
            return `next ${format(showDate, 'EEEE (d/M')}, inclusive of time to ${format(maxDate, 'E')} 6am)`;
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