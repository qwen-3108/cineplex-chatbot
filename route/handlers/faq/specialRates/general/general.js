const { PARAMETERS } = require('../../../../../@global/CONSTANTS');
const CUSTOMER_TYPE = PARAMETERS.CUSTOMER_TYPE;
const sendMessage = require('../../../../../_telegram/post');

module.exports = async function general({ text, extractedInfo, sessionToMutate }) {

    console.log('-----general triggered-----');
    const customerType = extractedInfo["customer-type"];
    console.log('customer type: ', customerType);

    let text;

    switch (customerType) {
        case CUSTOMER_TYPE.CHILDREN:
            text = "Unfortunately no. Children who are below 0.9m in height can enter for free but he/she will not be entitled to have a seat to himself/herself. For children taller than 0.9m, tickets need to be purchased and normal rates apply";
            break;
        case CUSTOMER_TYPE.STUDENT:
            text = "Yep. All primary, secondary and tertiary students enjoy special rates at S$6 on Tuesdays (all day) and $7 on Mondays and Wednesdays to Fridays (before 6pm)";
            break;
        case CUSTOMER_TYPE.SENIOR_CITIZEN:
            text = "Yep. Senior citizens aged 55 and above can purchase movie tickets at S$5 before 6pm on Mondays to Fridays at all Cathay Cineplexes";
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
            text = `Yep. ${customer} generations can purchase movie tickets at only S$4 on Tuesdays (all day) and S$5 for all showtimes before 6pm on Mondays and Wednesdays to Fridays`;
            break;
        default:
            throw `Unrecognized customer type ${customerType}`;
    }
<<<<<<< Updated upstream
}
=======

    await sendMessage(sessionToMutate.chatId, text);

};
>>>>>>> Stashed changes
