const { addDays, differenceInCalendarDays, format, differenceInHours } = require("date-fns");

//input: Date | { start: Date, end: Date, sessionStartedAt: Date } **can only pass single Date when it comes from db
//additionalInfo: { sessionStartedAt:Date, includeTimePhrase: Bool }
module.exports = function makeDateTimePhrase(input, additionalInfo) {

    let sessionStartedAt;
    let includeTimePhrase = true;
    let lite = false;
    console.log('making date time phrase, input: ', JSON.stringify(input));

    if (additionalInfo !== undefined) {
        if (additionalInfo.sessionStartedAt instanceof Date) {
            sessionStartedAt = additionalInfo.sessionStartedAt;
        } else if (!input.sessionStartedAt instanceof Date) {
            throw `invalid sessionStartedAt passed to makeDateTimePhrase, please ensure it is either passed along in dateTimeObj or as key in additional info`;
        } else {
            sessionStartedAt = input.sessionStartedAt;
        }

        if (additionalInfo.includeTimePhrase !== undefined) {
            includeTimePhrase = additionalInfo.includeTimePhrase;
        }

        if (additionalInfo.lite !== undefined) {
            lite = additionalInfo.lite;
        }

    } else {
        if (!input.sessionStartedAt instanceof Date) {
            throw `invalid sessionStartedAt ${input.sessionStartedAt} passed to makeDateTimePhrase`;
        } else {
            sessionStartedAt = input.sessionStartedAt;
        }
    }

    //real operation begins

    if (input.start instanceof Date && input.end instanceof Date) {

        if (input.start.getHours() === input.end.getHours()) {

            //for cases where user provide exact time, captured in bookingInfo and assigned
            console.log('date.start = date.end, recalling make date time phrase with single date');
            return makeDateTimePhrase(input.start, { sessionStartedAt, includeTimePhrase, lite });

        } else {

            const timeDiff = differenceInHours(input.end, input.start);
            console.log('timeDiff between date.start & date.end ', timeDiff);
            if (timeDiff >= 48) {
                //include time phrase or not is irrelevant because time will not be included in the first place
                const startDateStatus = isThisNextWeekOrMore(input.start, sessionStartedAt);
                const endDateStatus = isThisNextWeekOrMore(input.end, sessionStartedAt);
                if (startDateStatus === 1 && endDateStatus === 1) { //both are next week date
                    return lite
                        ? `next ${format(input.start, 'E')} to ${format(input.end, 'E')}`
                        : `from next ${format(input.start, 'EEEE (d/M)')} to ${format(input.end, 'EEEE (d/M)')}`; //to eliminate weird output like from next wed to next fri
                } else if (startDateStatus === 2 && endDateStatus === 2) {
                    return lite
                        ? `${format(input.start, 'd')}=${format(input.end, 'd MMM')}`
                        : `from ${format(input.start, 'MMMM d')} to ${format(input.end, 'd')} (${format(input.start, 'E')}-${format(input.end, 'E')})`
                } else {
                    let startDateStr = makeDateTimeStr(input.start, sessionStartedAt, { lite });
                    if (!(/(?:today|tomorrow)/).test(startDateStr)) {
                        startDateStr = startDateStr.slice(3);
                    }
                    let endDateStr = makeDateTimeStr(input.end, sessionStartedAt, { lite });
                    if (!(/(?:today|tomorrow)/).test(endDateStr)) {
                        endDateStr = endDateStr.slice(3);
                    }
                    return lite
                        ? `${startDateStr} to ${endDateStr}`
                        : `from ${startDateStr} to ${endDateStr}`;
                }

            } else if (timeDiff >= 24 && timeDiff < 48) {

                //include time phrase or not is irrelevant because time will not be included in the first place
                const startDateStatus = isThisNextWeekOrMore(input.start, sessionStartedAt);
                const isWeekend = input.start.getDay() === 6 && input.end.getDay() === 0;
                switch (startDateStatus) {
                    case 0:
                        if (isWeekend) {
                            return lite
                                ? 'this weekend'
                                : `this weekend (${format(input.start, 'd')}-${format(input.end, 'd MMM')})`;
                        } else {
                            return lite
                                ? `${format(input.start, 'E')}-${format(input.end, 'E')}`
                                : `on ${format(input.start, 'EEEE (d/M)')} and ${format(input.end, 'EEEE (d/M)')}`;
                        }
                    case 1:
                        if (isWeekend) {
                            return lite
                                ? 'next weekend'
                                : `next weekend (${format(input.start, 'd')}-${format(input.end, 'd MMM')})`;
                        } else {
                            return lite
                                ? `next ${format(input.start, 'E')}-${format(input.end, 'E')}`
                                : `on next ${format(input.start, 'EEEE (d/M)')} and ${format(input.end, 'EEEE (d/M)')}`;
                        }
                    case 2:
                        return lite
                            ? `${format(input.start, 'd')}-${format(input.start, 'd MMM')}`
                            : `on ${format(input.start, 'MMMM d')} and ${format(input.end, 'd')} (${format(input.start, 'E')}-${format(input.end, 'E')})`
                    default:
                        throw `Unexpected output ${dateStatus} from isThisNextWeekOrMore`;
                }

            } else {

                if (!includeTimePhrase) {
                    //can just take input.start since timeDiff <24 means is the same day, even though date might be diff in case like 'tomorrow night'
                    //don't pass any timeStr to get output without time
                    return makeDateTimeStr(input.start, sessionStartedAt, { lite });

                } else {

                    let timeStr;
                    let wDuration = true;
                    //is time duration (morning, afternoon, evening, night) or without time
                    const startHour = input.start.getHours();
                    const endHour = input.end.getHours();
                    const endMinute = input.end.getMinutes();
                    //full day
                    if (startHour === 0 && endHour === 23 && endMinute === 59) {
                        //let timeStr stay undefined and attach..Date is irrelevant
                    } else if (startHour === 5 && endHour === 11 && endMinute === 59) {
                        timeStr = 'morning';
                    } else if (startHour === 12 && endHour === 17 && endMinute === 59) {
                        timeStr = 'afternoon';
                    } else if (startHour === 17 && endHour === 23 && endMinute === 59) {
                        timeStr = 'evening';
                    } else if (startHour === 19 && endHour === 5 && endMinute === 59) {
                        timeStr = 'night';
                    } else {
                        const startTimeStr = makeIndividualTimeStr(input.start).slice(3);
                        const endTimeStr = makeIndividualTimeStr(input.end).slice(3);
                        timeStr = `from ${startTimeStr} to ${endTimeStr}`;
                        wDuration = false; //special case to move timeStr to back
                    }
                    return makeDateTimeStr(input.start, sessionStartedAt, { wDuration, timeStr, lite });

                }
            }

        }

    } else if (input instanceof Date) {

        //exact time, could be from user input or showtimes in db
        const timeStr = includeTimePhrase ? makeIndividualTimeStr(input) : undefined;
        //pass undefined to timeStr option to get output without time
        return makeDateTimeStr(input, sessionStartedAt, { wDuration: false, timeStr, lite });

    } else {

        throw `Invalid input ${input} to makeDateTimePhrase`;

    }

};

/*----helper function-----*/

function makeIndividualTimeStr(input) { //input: Date
    if (input.getHours() === 12 && input.getMinutes() === 0) {
        return 'at noon';
    } else if ((input.getHours() === 0 && input.getMinutes() === 0) || (input.getHours() === 23 && input.getMinutes() === 59)) {
        return 'at midnight';
    } else {
        return `at ${format(input, 'h aaaa')}`;
    }
}

//input: Date
//timeStr : "morning"/"evening" | "at 7 p.m." | "from 1 p.m. to 7 p.m."/"from tomorrow noon to midnight"
function makeDateTimeStr(input, sessionStartedAt, config) {

    let wDuration = false;
    let timeStr;
    let lite = false;
    if (config !== undefined) {
        wDuration = config.wDuration === undefined ? wDuration : config.wDuration;
        timeStr = config.timeStr === undefined ? timeStr : config.timeStr;
        lite = config.lite === undefined ? lite : config.lite;
    }

    const daysFromSessionStart = differenceInCalendarDays(input, sessionStartedAt);

    let dateTimeStr;

    if (daysFromSessionStart < 0) {

        throw `daysFromSessionStart is negative: ${daysFromSessionStart}, check order of input to differenceInCalendarDays again`;

    } else if (daysFromSessionStart === 0) {

        if (timeStr === undefined) {
            dateTimeStr = 'today';
        } else if (wDuration) {
            dateTimeStr = timeStr === 'night' ? 'tonight' : `this ${timeStr}`;
        } else {
            dateTimeStr = `today ${timeStr}`;
        }

    } else if (daysFromSessionStart === 1) {

        if (timeStr === undefined) {
            dateTimeStr = 'tomorrow';
        } else {
            dateTimeStr = `tomorrow ${timeStr}`;
        }

    } else {
        //given daysToSessionStart > 1
        const dateStatus = isThisNextWeekOrMore(input, sessionStartedAt);
        let dateStr = lite ? format(input, 'E') : format(input, 'EEEE (d/M)');
        switch (dateStatus) {
            case 0: //before coming sun, or coming sun itself when ask date not sun, don't need to add next
                dateTimeStr = timeStr === undefined ? `on ${dateStr}` : `on ${dateStr} ${timeStr}`;
                break;
            case 1: //before coming coming sun, or coming sun itself when ask date is sun, add 'next'
                dateTimeStr = timeStr === undefined ? `on next ${dateStr}` : `on next ${dateStr} ${timeStr}`;
                break;
            case 2: //coming coming sun & after, denote with date
                dateStr = lite ? format(input, 'd MMM') : format(input, 'MMMM d (EEE)');
                if (timeStr === undefined) {
                    dateTimeStr = `on ${dateStr}`;
                } else if (wDuration) {
                    dateTimeStr = `on the ${timeStr} of ${dateStr}`;
                } else {
                    dateTimeStr = `on ${dateStr} ${timeStr}`;
                }
                break;
            default:
                throw `Unexpected output ${dateStatus} from isThisNextWeekOrMore`;
        }

    }

    return dateTimeStr;

}

function isThisNextWeekOrMore(input, sessionStartedAt) {

    const daysToSun = (7 - sessionStartedAt.getDay());
    const comingSun = addDays(sessionStartedAt, daysToSun);
    const nextSun = addDays(sessionStartedAt, daysToSun + 7);

    let dateStatus;

    if (sessionStartedAt.getDay() !== 0 && differenceInCalendarDays(input, comingSun) <= 0) {
        dateStatus = 0;
    } else if (sessionStartedAt.getDay() === 0 && differenceInCalendarDays(input, comingSun) < 0) {
        dateStatus = 0;
    } else if (sessionStartedAt.getDay() === 0 && differenceInCalendarDays(input, comingSun) === 0) {
        dateStatus = 1;
    } else if (differenceInCalendarDays(input, comingSun) > 0 && differenceInCalendarDays(input, nextSun) < 0) {
        dateStatus = 1;
    } else if (differenceInCalendarDays(input, nextSun) >= 0) {
        dateStatus = 2;
    } else {
        console.log(input, sessionStartedAt, comingSun, nextSun);
        console.log(differenceInCalendarDays(input, comingSun));
        console.log(differenceInCalendarDays(input, nextSun));
        throw `Unable to decide dateStatus`;
    }

    return dateStatus;

}