const { format } = require('date-fns');
const { PARAMETERS } = require('../../../../../@global/CONSTANTS');
const CUSTOMER_TYPE = PARAMETERS.CUSTOMER_TYPE;
const assignDateTime = require('../../../../../@util/assignDateTime');
const sendMessage = require('../../../../../_telegram/post');

module.exports = async function price({ text, extractedInfo, sessionToMutate }) {

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
                text = "Unfortunately we do not have special rate for chilren. Children who are below 0.9m in height can enter for free but he/she will not be entitled to have a seat to himself/herself. For children taller than 0.9m, tickets need to be purchased and normal rates apply";
            }
            break;
        case CUSTOMER_TYPE.STUDENT:
            {
                //#1: user does not provide time
                if (dateTime.start === null) {
                    text = "S$6 on Tuesdays (all day!) and S$7 on Mondays, Wednesdays to Fridays (before 6pm)";
                    break;
                }

                const startDay = dateTime.start.getDay();
                const endDay = dateTime.end.getDay();

                //#2: user ask for student price on weekend
                if (startDay === 6 && endDay === 0) {
                    text = "Student rates are only available on weekdays, S$6 on Tuesdays (all day) and S$7 on Mondays, Wednesdays, Thursdays, and Fridays (before 6pm)";
                    break;
                }

                //#3: user ask for student price on tue
                if (startDay === endDay && startDay === 2) {
                    text = "That'd be S$6, applicable to all showtimes of the day";
                    break;
                }

                //#4: user ask for student price on any non-Tue weekday but after 6pm
                const startTime = dateTime.start.getHours();
                const endTime = dateTime.end.getHours();
                const noTime = startTime === 0 && endTime === 23;
                if (!noTime && (startTime >= 18 || endTime >= 18)) { //endTime could be 2359 if user only ask for day
                    text = `Student rates are only available for showtimes before 6pm on ${format(dateTime.start, 'E')}, in which case it would be S$7`;
                    break;
                }

                //#5: user ask for student price on any non-Tue weekday
                text = "That'd be S$7, applicable to showtimes before 6pm";
            }
            break;
        case CUSTOMER_TYPE.SENIOR_CITIZEN:
            {
                //#1: user does not provide time
                if (dateTime.start === null) {
                    text = "S$5, applicable on weekdays to all showtimes before 6pm";
                    break;
                }

                const startDay = dateTime.start.getDay();
                const endDay = dateTime.end.getDay();

                //#2: user ask for senior price on weekend
                if (startDay === 6 && endDay === 0) {
                    text = "Senior citizen rates are only available on weekdays before 6pm, in which case it would be S$5";
                    break;
                }

                //#3: user ask for senior price on tue
                if (startDay === endDay && startDay === 2) {
                    if (startDay)
                        text = "That'd be S$5, valid for showtimes before 6pm. For senior citizens who are also Pioneer/Merdeka generations, tickets are available at S$4 for all showtimes on Tuesdays";
                    break;
                }

                //#4: user ask senior price after 6pm
                const startTime = dateTime.start.getHours();
                const endTime = dateTime.end.getHours();
                if (startTime >= 18 || endTime >= 18) {
                    text = `Senior citizen rates are only available for showtimes before 6pm, in which case it would be S$5`;
                    break;
                }

                //#5: user ask for senior price on any non-Tue weekday
                text = "That'd be S$5, applicable to showtimes before 6pm";
            }
            break;
        case CUSTOMER_TYPE.PIONEER_MERDEKA:
            const hasMerdeka = (/merdeka/i).test(text);
            const hasPioneer = (/pioneer/i).test(text);
            let customer;
            if (hasMerdeka && hasPioneer) {
                customer = 'Pioneer and Merdeka';
            } else if (hasMerdeka) {
                customer = 'Merdeka';
            } else if (hasPioneer) {
                customer = 'Pioneer';
            } else {
                throw `No pioneer and merdeka in text but matched customer type is pioneer/merdeka generations, text: ${text}`;
            }
            reply = `Yep. ${customer} generations can purchase movie tickets at only S$4 on Tuesdays (all day) and S$5 for all showtimes before 6pm on Mondays and Wednesdays to Fridays`;
            break;
        default:
            throw `Unrecognized customer type ${customerType}`;
    }

    await sendMessage(sessionToMutate.chatId, reply);

};