const { MAIN_STATUS, SEC_STATUS } = require('../../../@global/CONSTANTS');
const reply = require('../../../_telegram/reply');
const toFallback = require('../../../_telegram/reply/toFallback');

// ask to repeat: no need change status
// ask more info: no need change status
// acknowledge reject: secondary status to null

module.exports = async function onReject({ text, sessionToMutate }) {

    const { chatId, status, bookingInfo, confirmPayload } = sessionToMutate;

    // 'i would like to change xx to xx', 'you confirm? ', 'no'
    if (status.secondary === SEC_STATUS.CONFIRM_EDIT) {
        await reply.askToRepeat(chatId);
    }

    // 'is tenet available? ', 'yes, would you like to book now? ', 'no'
    else if (status.secondary === SEC_STATUS.CONFIRM_MOVIE) {
        sessionToMutate.payload.movie = { id: null, title: null, debutDateTime: null, isBlockBuster: null };
        status.secondary = null;
        await reply.acknowledgeReject(chatId);
    }

    else {

        switch (status.main) {

            // 'what date time?', 'xxx', 'showtime not released yet, look at these instead?', 'no'
            case MAIN_STATUS.PROMPT_DATETIME:
                {
                    if (status.secondary === SEC_STATUS.EXCEED_SCHEDULE_TOTAL || status.secondary === SEC_STATUS.EXCEED_SCHEDULE_PARTIAL) {
                        await reply.basics.cancel(chatId);
                    }
                }
                break;
            case MAIN_STATUS.CHOOSE_SEAT:
                {
                    switch (status.secondary) {
                        // 'is these the seat you want? ', 'no'
                        case SEC_STATUS.CONFIRM_SEAT:
                            await reply.askToRepeat(chatId, "Okay sure. Could you please say your preferred seat again? ");
                            break;
                        // 'do you mean these? (guess)', 'no'
                        case SEC_STATUS.INVALID_SEAT_PHRASE:
                            // discard the guess
                            await reply.askForMoreInfo(chatId, "Ooooh. Seems like I get it wrongly. Could you kindly tell me your preferred seat again? ");
                            break;
                        // ??? 'you want to change seat?', 'no'
                        case SEC_STATUS.MODIFY_SEAT:
                            status.secondary = null;
                            await reply.acknowledgeReject(chatId);
                            break;
                    }
                }
                break;
            // ??? 'is this the showtime you want? ', 'no'
            case MAIN_STATUS.CONFIRM_PROCEED:
                {
                    if (status.secondary === SEC_STATUS.WARN_PLATINUM) {
                        status.secondary = null;
                        await reply.acknowledgeReject(chatId);
                        break;
                    } else {
                        sessionToMutate.confirmPayload.uniqueSchedule = {};
                        await reply.askForMoreInfo(chatId);
                    }
                }
                break;
            // 'is these the tickets you want?', 'no'
            case MAIN_STATUS.CONFIRM_DETAILS:
                {
                    await reply.askForMoreInfo(chatId);
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