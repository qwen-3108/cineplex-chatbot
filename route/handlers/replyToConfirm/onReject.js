const { MAIN_STATUS, SEC_STATUS } = require('../../../@global/CONSTANTS');
const acknowledgeReject = require('../../../_telegram/reply/acknowledgeReject');
const askForMoreInfo = require('../../../_telegram/reply/askForMoreInfo');
const askToRepeat = require('../../../_telegram/reply/askToRepeat');
const toFallback = require('../../../_telegram/reply/toFallback');
const { cancel } = require('../../../_telegram/reply/basics');

// ask to repeat: no need change status
// ask more info: no need change status
// acknowledge reject: secondary status to null

module.exports = async function onReject({ text, sessionToMutate }) {

    const { chatId, status, bookingInfo, confirmPayload } = sessionToMutate;

    // 'i would like to change xx to xx', 'you confirm? ', 'no'
    if (status.secondary === SEC_STATUS.CONFIRM_EDIT) {
        await askToRepeat(chatId);
    }

    // 'is tenet available? ', 'yes, would you like to book now? ', 'no'
    else if (status.secondary === SEC_STATUS.CONFIRM_MOVIE) {
        sessionToMutate.payload.movie = { id: null, title: null, debutDateTime: null, isBlockBuster: null };
        status.secondary = null;
        await acknowledgeReject(chatId);
    }

    else {

        switch (status.main) {

            // 'what date time?', 'xxx', 'showtime not released yet, look at these instead?', 'no'
            case MAIN_STATUS.PROMPT_DATETIME:
                {
                    if (status.secondary === SEC_STATUS.EXCEED_SCHEDULE_TOTAL || status.secondary === SEC_STATUS.EXCEED_SCHEDULE_PARTIAL) {
                        await cancel(chatId);
                    }
                }
                break;
            case MAIN_STATUS.CHOOSE_SEAT:
                {
                    switch (status.secondary) {
                        // 'is these the seat you want? ', 'no'
                        case SEC_STATUS.CONFIRM_SEAT:
                            await askToRepeat(chatId);
                            break;
                        // 'do you mean these? (guess)', 'no'
                        case SEC_STATUS.INVALID_SEAT_PHRASE:
                            // discard the guess
                            await askForMoreInfo(chatId);
                            break;
                        // ??? 'you want to change seat?', 'no'
                        case SEC_STATUS.MODIFY_SEAT:
                            status.secondary = null;
                            await acknowledgeReject(chatId);
                            break;
                    }
                }
                break;
            // ??? 'is this the showtime you want? ', 'no'
            case MAIN_STATUS.CONFIRM_PROCEED:
                {
                    if (status.secondary === SEC_STATUS.WARN_PLATINUM) {
                        status.secondary = null;
                        await acknowledgeReject(chatId);
                        break;
                    } else {
                        sessionToMutate.confirmPayload.uniqueSchedule = {};
                        await askForMoreInfo(chatId);
                    }
                }
                break;
            // 'is these the tickets you want?', 'no'
            case MAIN_STATUS.CONFIRM_DETAILS:
                {
                    await askForMoreInfo(chatId);
                }
                break;
            default:
                sessionToMutate.counter.fallbackCount++;
                await toFallback({ chat_id: chatId, currentSession: sessionToMutate });
                return;
        }

    }

    sessionToMutate.counter.fallbackCount = 0;

};