const { PARAMETERS } = require('../../../../../@global/CONSTANTS');
const CUSTOMER_TYPE = PARAMETERS.CUSTOMER_TYPE;
const sendMessage = require('../../../../../_telegram/post');

module.exports = async function channel({ text, extractedInfo, sessionToMutate }) {

    console.log('-----channel triggered-----');
    const customerType = extractedInfo["customer-type"];
    console.log('customer type: ', customerType);

    let text;

    switch (customerType) {
        case CUSTOMER_TYPE.CHILDREN:
            break;
        case CUSTOMER_TYPE.STUDENT:
            break;
        case CUSTOMER_TYPE.SENIOR_CITIZEN:
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
            break;
        default:
            throw `Unrecognized customer type ${customerType}`;
    }

    await sendMessage(sessionToMutate.chatId, text);

};