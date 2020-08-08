const { PARAMETERS } = require('../../../../@global/CONSTANTS');
const { logInfo, } = require('../../../../@global/LOGS');
const sendMessage = require('../../../../_telegram/post/sendMessage');
const CUSTOMER_TYPE = PARAMETERS.CUSTOMER_TYPE;

module.exports = async function general({ text, extractedInfo, sessionToMutate }) {

    logInfo(sessionToMutate.chatId, '-----general triggered-----');
    const customerType = extractedInfo["customer-type"];
    logInfo(sessionToMutate.chatId, `customer type: ${customerType}`);

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

    await sendMessage(sessionToMutate.chatId, reply);

};
