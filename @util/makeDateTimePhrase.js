const { differenceInCalendarDays, format } = require('date-fns');

module.exports = function makeDateTimePhrase(dateTime) {

    const current = new Date();
    const { start, end } = dateTime;
    const startDay = start.getDay();
    const endDay = end.getDay();
    const startTime = start.getHours();
    const endTime = end.getHours();

    let dateStr = '';
    let timeStr = '';
    let diffInCalendarDays = differenceInCalendarDays(start, current);
    let dateTimeStr = '';

    if (startDay !== endDay) {
        if (startDay === 6 && endDay === 0) {
            dateTimeStr = diffInCalendarDays < 7 ? 'this weekend ' : 'next weekend ';
            dateTimeStr += `(${format(start, 'd')} - ${format(end, 'd MMMM')})`;
            return dateTimeStr;
        } else {
            if (startDay > endDay) {
                return `from ${format(start, 'EEEE')} to coming ${format(end, 'EEEE')}`;
            } else {
                return `from ${format(start, 'EEEE')} to ${format(end, 'EEEE')}`;
            }
        }
    }

    //decide timeStr
    if (startTime === 0 && endTime === 23) {
        //only date: do nth
    } else if (startTime === endTime) {
        //exact time given
        timeStr = 'at ' + format(start, 'h aaaa');
    } else {
        //time range
        if (startTime === 5 && endTime === 11) {
            timeStr = 'morning';
        } else if (startTime === 12 && endTime === 17) {
            timeStr = 'afternoon';
        } else if (startTime === 17 && endTime === 23) {
            timeStr = 'evening';
        } else if (startTime === 19 && endTime === 6) {
            timeStr = 'night';
        } else {
            const endStr = endTime === 23 && end.getMinutes() === 59 ? 'midnight' : format(end, 'h aaaa');
            timeStr = 'from ' + format(start, 'h aaaa') + ' to ' + endStr;
            console.log('timeStr', timeStr);
        }
    }

    switch (diffInCalendarDays) {
        case 0:
            dateStr = (timeStr === 'morning' || timeStr === 'afternoon' || timeStr === 'evening') ? 'this' : 'today';
            dateTimeStr = timeStr === 'night' ? 'tonight' : `${dateStr}${timeStr === '' ? '' : ' ' + timeStr}`;
            break;
        case 1:
            dateStr = 'tomorrow';
            dateTimeStr = `${dateStr}${timeStr === '' ? '' : ' ' + timeStr}`;
            break;
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
            dateStr = format(start, 'EEEE (d/M)');
            const daysToSun = [7 - current.getDay()] % 7;
            if (daysToSun !== 0 && diffInCalendarDays > daysToSun) {
                dateTimeStr = `on next ${dateStr}${timeStr === '' ? '' : ' ' + timeStr}`;
            } else {
                dateTimeStr = `on ${dateStr}${timeStr === '' ? '' : ' ' + timeStr}`;
            }
            break;
        default:
            dateStr = format(start, 'd MMMM');
            dateTimeStr = (timeStr === 'morning' || timeStr === 'afternoon' || timeStr === 'evening') ? `on the ${timeStr} of ${dateStr}` : `on ${dateStr}${timeStr === '' ? '' : ' ' + timeStr}`;
    }
    console.log(`Making dateTime phrase... input: ${JSON.stringify(dateTime)}  extracted: ${JSON.stringify({ startDay, endDay, startTime, endTime })}`);
    return dateTimeStr;
};