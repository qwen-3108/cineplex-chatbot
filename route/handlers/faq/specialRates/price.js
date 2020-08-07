const { format } = require('date-fns');
const { PARAMETERS } = require('../../../../@global/CONSTANTS');
const CUSTOMER_TYPE = PARAMETERS.CUSTOMER_TYPE;
const assignDateTime = require('../../../../@util/assignDateTime');
const sendMessage = require('../../../../_telegram/post/sendMessage');

module.exports = async function price({ reply, extractedInfo, sessionToMutate }) {

    console.log('-----price triggered-----');
    const customerType = extractedInfo["customer-type"];
    let dateTime = { start: null, end: null };
    if (extractedInfo["date-time"] !== "") {
        dateTime = assignDateTime(extractedInfo["date-time"]);
    }
    console.log('customer type: ', customerType, 'date time: ', dateTime);

    let reply;

    switch (customerType) {
        case CUSTOMER_TYPE.CHILDREN:
            {
                reply = "Unfortunately we do not have special rate for chilren. Children who are below 0.9m in height can enter for free but he/she will not be entitled to have a seat to himself/herself. For children taller than 0.9m, tickets need to be purchased and normal rates apply";
            }
            break;
        case CUSTOMER_TYPE.STUDENT:
            {
                //#1: user does not provide time
                if (dateTime.start === null) {
                    reply = "S$6 on Tuesdays (all day!) and S$7 on Mondays, Wednesdays to Fridays (before 6pm)";
                    break;
                }

                const startDay = dateTime.start.getDay();
                const endDay = dateTime.end.getDay();

                //#2: user ask for student price on weekend
                if (startDay === 6 && endDay === 0) {
                    reply = "Student rates are only available on weekdays, S$6 on Tuesdays (all day) and S$7 on Mondays, Wednesdays, Thursdays, and Fridays (before 6pm)";
                    break;
                }

                //#3: user ask for student price on tue
                if (startDay === endDay && startDay === 2) {
                    reply = "That'd be S$6, applicable to all showtimes of the day";
                    break;
                }

                //#4: user ask for student price on any non-Tue weekday but after 6pm
                const startTime = dateTime.start.getHours();
                const endTime = dateTime.end.getHours();
                const noTime = startTime === 0 && endTime === 23;
                if (!noTime && endTime >= 18) { //endTime could be 2359 if user only ask for day
                    reply = `Student rates are only available for showtimes before 6pm on ${format(dateTime.start, 'EEEE')}, in which case it would be S$7`;
                    break;
                }

                //#5: user ask for student price on any non-Tue weekday
                reply = "That'd be S$7, applicable to all showtimes before 6pm :)";
            }
            break;
        case CUSTOMER_TYPE.SENIOR_CITIZEN:
            {
                //#1: user does not provide time
                if (dateTime.start === null) {
                    reply = "S$5, applicable on weekdays to all showtimes before 6pm :)";
                    break;
                }

                const startDay = dateTime.start.getDay();
                const endDay = dateTime.end.getDay();

                //#2: user ask for senior price on weekend
                if (startDay === 6 && endDay === 0) {
                    reply = "Senior citizen rates are only available on weekdays before 6pm, in which case it would be S$5";
                    break;
                }

                //#3: user ask for senior price on tue
                if (startDay === endDay && startDay === 2) {
                    if (startDay)
                        reply = "That'd be S$5 :) valid for showtimes before 6pm. For senior citizens who are also Pioneer/Merdeka generations, tickets are available at S$4 for all showtimes on Tuesdays";
                    break;
                }

                //#4: user ask senior price after 6pm
                const startTime = dateTime.start.getHours();
                const endTime = dateTime.end.getHours();
                const noTime = startTime === 0 && endTime === 23;
                if (!noTime && endTime >= 18) {
                    reply = `Senior citizen rates are only available for showtimes before 6pm, in which case it would be S$5 :)`;
                    break;
                }

                //#5: user ask for senior price on any non-Tue weekday
                reply = "That'd be S$5, applicable to all showtimes before 6pm :)";
            }
            break;
        case CUSTOMER_TYPE.PIONEER_MERDEKA:
            {
                //#1: user does not provide time
                if (dateTime.start === null) {
                    reply = "S$4 on Tuesdays (all day!) and S$5 on Mondays, Wednesdays to Fridays (before 6pm)";
                    break;
                }

                const startDay = dateTime.start.getDay();
                const endDay = dateTime.end.getDay();

                //#2: user ask for pioneer/merdeka rates on weekend
                if (startDay === 6 && endDay === 0) {
                    reply = "Special rates for pioneer/merdeka generations are only available on weekdays, S$4 on Tuesdays (all day) and S$5 on Mondays & Wednesdays to Fridays (before 6pm) ";
                    break;
                }

                //#3: user ask for pioneer/merdeka rates on tue
                if (startDay === endDay && startDay === 2) {
                    reply = "That'd be S$4, valid all day 😁";
                    break;
                }

                //#4: user ask for pioneer/merdeka rates on any non-Tue weekday but after 6pm
                const startTime = dateTime.start.getHours();
                const endTime = dateTime.end.getHours();
                const noTime = startTime === 0 && endTime === 23;
                if (!noTime && endTime >= 18) { //endTime could be 2359 if user only ask for day
                    reply = `Special rates for pioneer/merdeka generations are only available for showtimes before 6pm on ${format(dateTime.start, 'EEEE')}, in which case it'd be S$5`;
                    break;
                }

                //#5: user ask for student price on any non-Tue weekday
                reply = "That'd be S$5, valid for showtimes before 6pm 😁";
            }
            break;
        default:
            throw `Unrecognized customer type ${customerType}`;
    }

    await sendMessage(sessionToMutate.chatId, reply);

};