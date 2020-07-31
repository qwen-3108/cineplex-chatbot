const { differenceInCalendarDays } = require('date-fns');

module.exports = function calculatePrice(selected) {

    const { dateTime, isPlatinum, movie } = selected;
    const { isBlockBuster, debutDateTime } = movie;

    const day = dateTime.getDay();
    const notFirstWeekTitle = !isBlockBuster && differenceInCalendarDays(dateTime, debutDateTime) > 7;
    const notSecondWeekBlockbuster = isBlockBuster && differenceInCalendarDays(dateTime, debutDateTime) > 14;
    if (isPlatinum && [1, 2, 3, 4].includes(day)) {
        return notFirstWeekTitle && notSecondWeekBlockbuster ? 28 : 38;
    } else if (isPlatinum) {
        return 38;
    } else if ([1, 2, 3, 4].includes(day)) {
        return notFirstWeekTitle && notSecondWeekBlockbuster ? 9 : 9.5;
    } else {
        return notFirstWeekTitle && notSecondWeekBlockbuster ? 13 : 13.5;
    }
};