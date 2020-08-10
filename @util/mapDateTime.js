const { addDays, differenceInCalendarDays } = require('date-fns');
const { DATES_IN_DB } = require('../@global/CONSTANTS');
const isTimeLessThan = require('./isTimeLessThan');

module.exports = function mapDateTime(date, sessionStartedAt) {

    const todayDbDate = new Date(DATES_IN_DB[sessionStartedAt.getDay()]);
    const daysToDbDate = differenceInCalendarDays(sessionStartedAt, todayDbDate);
    const nextWeekAreDaysLessThan = sessionStartedAt.getDay();

    if (date.getDay() === nextWeekAreDaysLessThan) {
        if (isTimeLessThan(date, sessionStartedAt)) {
            return addDays(date, daysToDbDate + 7);
        } else {
            return addDays(date, daysToDbDate);
        }
    }

    return date.getDay() < nextWeekAreDaysLessThan ? addDays(date, daysToDbDate + 7) : addDays(date, daysToDbDate);

}