const { addDays } = require('date-fns');
const isTimeLessThan = require('./isTimeLessThan');

module.exports = function mapDateTime(date, sessionStartedAt, daysToDbDate, nextWeekAreDaysLessThan) {

    if (date.getDay() === nextWeekAreDaysLessThan) {
        if (isTimeLessThan(date, sessionStartedAt)) {
            return addDays(date, daysToDbDate + 7);
        } else {
            return addDays(date, daysToDbDate);
        }
    }

    return date.getDay() < nextWeekAreDaysLessThan ? addDays(date, daysToDbDate + 7) : addDays(date, daysToDbDate);

}