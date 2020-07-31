const { addDays } = require('date-fns');

module.exports = function mapDateTime(date, daysToDbDate, nextWeekAreDaysLessThan) {

    return date.getDay() < nextWeekAreDaysLessThan ? addDays(date, daysToDbDate + 7) : addDays(date, daysToDbDate);

}