const { PARAMETERS } = require('../../../../../@global/CONSTANTS');
const CUSTOMER_TYPE = PARAMETERS.CUSTOMER_TYPE;

module.exports = async function general({ text, intentArr, extractedInfo, sessionToMutate }) {

    console.log('-----general triggered-----');
    const customerType = extractedInfo["customer-type"];
    console.log('customer type: ', customerType);
    switch (customerType) {
        case CUSTOMER_TYPE.CHILDREN:

            break;
        case CUSTOMER_TYPE.STUDENT:
            break;
        case CUSTOMER_TYPE.SENIOR_CITIZEN:
            break;
        case CUSTOMER_TYPE.PIONEER_MERDEKA:
            break;
        default:
            throw `Unrecognized customer type ${customerType}`;
    }
}

};