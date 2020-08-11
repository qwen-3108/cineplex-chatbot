const { format } = require('date-fns');
const { PARAMETERS } = require('../../../../@global/CONSTANTS');
const LOGS = require('../../../../@global/LOGS');
const CUSTOMER_TYPE = PARAMETERS.CUSTOMER_TYPE;
const assignDateTime = require('../../../../@util/assignDateTime');
const post = require('../../../../_telegram/post');

module.exports = {

    price: async function price({ extractedInfo, sessionToMutate }) {

        LOGS.logInfo(sessionToMutate.chatId, '-----price triggered-----');
        const customerType = extractedInfo["customer-type"];
        let dateTime = { start: null, end: null };
        if (extractedInfo["date-time"] !== "") {
            dateTime = assignDateTime(extractedInfo["date-time"]);
        }
        LOGS.logInfo(sessionToMutate.chatId, `customer type: ${customerType}, date time: ${dateTime}`);

        let reply;
        let responseInvoke;

        switch (customerType) {
            case CUSTOMER_TYPE.CHILDREN:
                {
                    reply = "Unfortunately we do not have special rates for chilren. Children who are below 0.9m in height can enter for free but he/she will not be entitled to have a seat to himself/herself. For children taller than 0.9m, tickets need to be purchased and normal rates apply 👩🏻‍💻";
                    responseInvoke = "CHall";
                }
                break;
            case CUSTOMER_TYPE.STUDENT:
            case CUSTOMER_TYPE.PIONEER_MERDEKA:
                {
                    const ct = customerType === CUSTOMER_TYPE.STUDENT ? 'Student rates' : 'Special rates for pioneer/merdeka generations';
                    const ctCode = customerType === CUSTOMER_TYPE.STUDENT ? 'ST' : 'PM';
                    const tueRate = customerType === CUSTOMER_TYPE.STUDENT ? 'S$6' : 'S$4';
                    const rate = customerType === CUSTOMER_TYPE.STUDENT ? 'S$7' : 'S$5';
                    //#1: user does not provide time
                    if (dateTime.start === null) {
                        reply = `${ct} are *${tueRate}* on Tue (all day!) and *${rate}* on Mon, Wed to Fri (before 6pm)`;
                        responseInvoke = ctCode + '-';
                        break;
                    }

                    const startDay = dateTime.start.getDay();
                    const endDay = dateTime.end.getDay();

                    //#2: user ask for price on weekend
                    if (startDay === 6 && endDay === 0) {
                        reply = `${ct} are only available on weekdays, ${tueRate} on Tue (all day) and ${rate} on Mon, Wed to Fri (before 6pm)`;
                        responseInvoke = ctCode + '60';
                        break;
                    }

                    //#3: user ask for student price on tue
                    if (startDay === endDay && startDay === 2) {
                        reply = `That'd be *${tueRate}* 😁 applicable to all showtimes of the day`;
                        responseInvoke = ctCode + '2'
                        break;
                    }

                    //#4: user ask for student price on any non-Tue weekday but after 6pm
                    const startTime = dateTime.start.getHours();
                    const endTime = dateTime.end.getHours();
                    const noTime = startTime === 0 && endTime === 23;
                    if (!noTime && endTime >= 18) { //endTime could be 2359 if user only ask for day
                        reply = `${ct} are only available for showtimes before 6pm on ${format(dateTime.start, 'E')}, in which case it would be ${rate}`;
                        responseInvoke = ctCode + '1345A6';
                        break;
                    }

                    //#5: user ask for student price on any non-Tue weekday
                    reply = `That'd be *${rate}*, applicable to all showtimes before 6pm :)`;
                    responseInvoke = ctCode + '1345';
                }
                break;
            case CUSTOMER_TYPE.SENIOR_CITIZEN:
                {
                    //#1: user does not provide time
                    if (dateTime.start === null) {
                        reply = "Senior citizen rate is *S$5*, applicable on weekdays to all showtimes before 6pm :)";
                        responseInvoke = "SN-";
                        break;
                    }

                    const startDay = dateTime.start.getDay();
                    const endDay = dateTime.end.getDay();

                    //#2: user ask for senior price on weekend
                    if (startDay === 6 && endDay === 0) {
                        reply = "Senior citizen rates are only available on weekdays before 6pm, in which case it would be S$5";
                        responseInvoke = "SN60";
                        break;
                    }

                    //#3: user ask for senior price on tue
                    if (startDay === endDay && startDay === 2) {
                        if (startDay)
                            reply = "That'd be *S$5* :) valid for showtimes before 6pm. For senior citizens who are also Pioneer/Merdeka generations, tickets are available at *S$4* for all showtimes on Tuesdays";
                        responseInvoke = "SN2";
                        break;
                    }

                    //#4: user ask senior price after 6pm
                    const startTime = dateTime.start.getHours();
                    const endTime = dateTime.end.getHours();
                    const noTime = startTime === 0 && endTime === 23;
                    if (!noTime && endTime >= 18) {
                        reply = `Senior citizen rates are only available for showtimes before 6pm, in which case it would be S$5 :)`;
                        responseInvoke = "SN12345A6";
                        break;
                    }

                    //#5: user ask for senior price on any non-Tue weekday
                    reply = "That'd be *S$5*, applicable to all showtimes before 6pm :)";
                    responseInvoke = "SN12345";
                }
                break;
            default:
                throw `Unrecognized customer type ${customerType}`;
        }
        LOGS.logInfo(sessionToMutate.chatId, `reply: ${reply}`);
        await post.sendMessage(sessionToMutate.chatId, reply, { parseMode: 'Markdown' });
        return responseInvoke;

    },

    general: async function general({ text, extractedInfo, sessionToMutate }) {

        LOGS.logInfo(sessionToMutate.chatId, '-----general triggered-----');
        const customerType = extractedInfo["customer-type"];
        LOGS.logInfo(sessionToMutate.chatId, `customer type: ${customerType}`);

        let reply;

        switch (customerType) {
            case CUSTOMER_TYPE.CHILDREN:
                reply = "Unfortunately no. Children who are below 0.9m in height can enter for free but he/she will not be entitled to have a seat to himself/herself. For children taller than 0.9m, tickets need to be purchased and normal rates apply";
                break;
            case CUSTOMER_TYPE.STUDENT:
                reply = "Yep. All primary, secondary and tertiary students enjoy special rates at S$6 on Tuesdays (all day) and $7 on Mondays and Wednesdays to Fridays (before 6pm)";
                break;
            case CUSTOMER_TYPE.SENIOR_CITIZEN:
                reply = "Yep. Senior citizens aged 55 and above can purchase movie tickets at S$5 before 6pm on Mondays to Fridays at all Cathay Cineplexes";
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
                    throw `No pioneer and merdeka in reply but matched customer type is pioneer/merdeka generations, text: ${text}`;
                }
                reply = `Yep. ${customer} generations can purchase movie tickets at only S$4 on Tuesdays (all day) and S$5 for all showtimes before 6pm on Mondays and Wednesdays to Fridays`;
                break;
            default:
                throw `Unrecognized customer type ${customerType}`;
        }

        await post.sendMessage(sessionToMutate.chatId, reply);

    }
}