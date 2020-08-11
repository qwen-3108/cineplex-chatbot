const { INTENT } = require('../../@global/CONSTANTS');
const REPLY_TO_CONFIRM = INTENT.REPLY_TO_CONFIRM;
const LOGS = require('../../@global/LOGS');

const onConfirm = require('./replyToConfirm/onConfirm');
const reject = require('./replyToConfirm/onReject');

module.exports = async function replyToConfirmHandler({ intentArr, text, sessionToMutate }) {

    LOGS.logInfo(sessionToMutate.chatId, '-----replyToConfirmHandler triggered-----');
    LOGS.logInfo(sessionToMutate.chatId, `reply to confirm subintent: ${intentArr[1]}`);

    switch (intentArr[1]) {
        case REPLY_TO_CONFIRM.YES.SELF:
            await onConfirm({ text, sessionToMutate });
            break;
        case REPLY_TO_CONFIRM.NO.SELF:
            await reject({ text, sessionToMutate });
            break;
        default:
            throw `Unrecognized reply to confirm sub intent ${intentArr[1]}`;
    }

}
