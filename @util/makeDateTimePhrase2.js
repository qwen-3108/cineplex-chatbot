const { differenceInCalendarDays, format, differenceInHours } = require("date-fns");

//input: Date | { start: Date, end: Date } **can only pass single Date when it comes from db
//sessionStartedAt : Date
module.exports = function makeDateTimePhrase(input, sessionStartedAt, { includeTimePhrase = true }) {

    if (input.start instanceof Date && input.end instanceof Date) {

        if (input.start.getHours() === input.end.getHours()) {

            //for cases where user provide exact time, captured in bookingInfo and assigned
            return makeDateTimePhrase(input.start, sessionStartedAt, { includeTimePhrase });

        } else {

            //is time duration (morning, afternoon, evening, night) or without time
            const startTime = input.start.getHours();
            const endTime = input.end.getHours();

            const timeDiff = differenceInHours(input.end, input.start);
            if (timeDiff >= 48) {
                //include time phrase or not is irrelevant because time will not be included in the first place
                return `from ${makeDateTimeStr(input.start, sessionStartedAt)} to ${makeDateTimeStr(input.end, sessionStartedAt)}`;

            } else if (timeDiff >= 24 && timeDiff < 48) {

                //include time phrase or not is irrelevant because time will not be included in the first place
                if (input.start.getDay() === 6 && input.end.getDay() === 0) {
                    const daysFromSessionStart = differenceInCalendarDays(input.start, sessionStartedAt);
                    return daysFromSessionStart > 7 ? 'next weekend' : 'this weekend';
                } else {
                    return `on ${makeDateTimeStr(input.start, sessionStartedAt)} and ${makeDateTimeStr(input.end, sessionStartedAt)}`
                }


            } else {

                if (!includeTimePhrase) {
                    //can just take input.start since timeDiff <24 means is the same day, even though date might be diff in case like 'tomorrow night'
                    //don't pass any timeStr to get output without time
                    return makeDateTimeStr(input.start, sessionStartedAt);

                } else {

                    let timeStr;
                    let attachTimeStrToFrontForLiteralDate = true;
                    //full day
                    if (startTime === 0 && endTime === 23) {
                        //let timeStr stay undefined and attach..Date is irrelevant
                    } else if (startTime === 5 && endTime === 11) {
                        timeStr = 'morning';
                    } else if (startTime === 12 && endTime === 17) {
                        timeStr = 'afternoon';
                    } else if (startTime === 17 && endTime === 23) {
                        timeStr = 'evening';
                    } else if (startTime === 19 && endTime === 6) {
                        timeStr = 'night';
                    } else {
                        timeStr = `from ${makeIndividualTimeStr(input.start)} to ${makeIndividualTimeStr(input.end)}`;
                        attachTimeStrToFrontForLiteralDate = false;
                    }
                    return makeDateTimeStr(input.start, sessionStartedAt, { attachTimeStrToFrontForLiteralDate, timeStr });

                }
            }

        }

    } else if (input instanceof Date) {

        //exact time, could be from user input or showtimes in db
        const timeStr = includeTimePhrase ? makeIndividualTimeStr(input) : undefined;
        //pass undefined to timeStr option to get output without time
        return makeDateTimeStr(input, sessionStartedAt, { timeStr });

    } else {

        throw `Invalid input ${input} to makeDateTimePhrase`;

    }

};

/*----helper function-----*/

function makeIndividualTimeStr(input) { //input: Date
    if (input.getHours() === 12 && input.getMinutes() === 0) {
        return 'noon';
    } else if ((input.getHours() === 0 && input.getMinutes() === 0) || (input.getHours() === 23 && input.getMinutes() === 59)) {
        return 'midnight';
    } else {
        return format(input, 'h aaaa');
    }
}

//input: Date
//timeStr : "morning"/"evening" | "at 7 p.m." | "from 1 p.m. to 7 p.m."/"from tomorrow noon to midnight"
function makeDateTimeStr(input, sessionStartedAt, { attachTimeStrToFrontForLiteralDate = false, timeStr }) {

    const daysFromSessionStart = differenceInCalendarDays(input, sessionStartedAt);

    let dateTimeStr;

    if (daysFromSessionStart < 0) {

        throw `daysFromSessionStart is negative: ${daysFromSessionStart}, check order of input to differenceInCalendarDays again`;

    } else if (daysFromSessionStart > 13) {

        dateStr = format(input, 'MMMM d (EEE)');
        if (timeStr === undefined) {
            dateTimeStr = `on ${dateStr}`;
        } else if (attachTimeStrToFrontForLiteralDate) {
            dateTimeStr = `on the ${timeStr} of ${dateStr}`;
        } else {
            dateTimeStr = `on ${dateStr} ${timeStr}`;
        }

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

        dateStr = daysFromSessionStart >= 7 ? `on next ${format(input, 'EEEE (d/M)')}` : `on ${format(input, 'EEEE (d/M)')}`;

        if (timeStr === undefined) {
            dateTimeStr = dateStr;
        } else {
            dateTimeStr = `${dateStr} ${timeStr}`;
        }

    }

    return dateTimeStr;

}