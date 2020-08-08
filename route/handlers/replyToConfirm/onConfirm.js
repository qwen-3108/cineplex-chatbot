const { confirmDetails, getEditSeats, sendSeatLegend, sendSeatPlan, getPayment } = require('../../../_telegram/reply');
const slotFilling = require('../service/book/helpers/slotFilling');
const mutateSeatNumbers = require('../service/book/helpers/mutateSeatNumbers');
const { MAIN_STATUS, SEC_STATUS } = require('../../../@global/CONSTANTS');
const { logInfo } = require('../../../@global/LOGS');
const expandSeatPhrases = require('../../../@util/expandSeatPhrases');
const toFallback = require('../../../_telegram/reply/toFallback');

module.exports = async function onConfirm({ text, sessionToMutate }) {

    const { chatId, status, bookingInfo, confirmPayload } = sessionToMutate;

    if (status.secondary === SEC_STATUS.CONFIRM_EDIT) {
        await slotFilling({ text, sessionToMutate });

    } else if (status.secondary === SEC_STATUS.CONFIRM_MOVIE) {
        sessionToMutate.bookingInfo.movie = sessionToMutate.payload.movie;
        sessionToMutate.payload.movie = { id: null, title: null, debutDateTime: null, isBlockBuster: null };
        await slotFilling({ text, sessionToMutate });

    } else {

        switch (status.main) {

            case MAIN_STATUS.PROMPT_DATETIME:
                logInfo(chatId, 'Received user agreement to adjust date time range');
                switch (status.secondary) {
                    case SEC_STATUS.EXCEED_SCHEDULE_PARTIAL:
                        const { start, end } = confirmPayload.adjustedDateTime;
                        sessionToMutate.bookingInfo.dateTime.start = start;
                        sessionToMutate.bookingInfo.dateTime.end = end;
                        sessionToMutate.confirmPayload.adjustedDateTime = {};
                        logInfo(chatId, `Removed confirmPayload.adjustedDateTime: ${JSON.stringify(sessionToMutate)}`);
                        await slotFilling({ text, sessionToMutate });
                        break;
                    case SEC_STATUS.EXCEED_SCHEDULE_TOTAL:
                        await getDayWithinSchedule(chatId);
                    default:
                        throw `${__filename} | Nothing to confirm for this state ${JSON.stringify(status)}`;
                }
                break;
            case MAIN_STATUS.CHOOSE_SEAT:
                {
                    switch (status.secondary) {
                        case SEC_STATUS.CONFIRM_SEAT:
                            sessionToMutate.status = { main: MAIN_STATUS.CONFIRM_DETAILS, secondary: null };
                            await confirmDetails(chatId, bookingInfo);
                            break;
                        case SEC_STATUS.INVALID_SEAT_PHRASE:
                            const { expandedSeatNumbers, correctedSeatPhrases } = confirmPayload.seatPhraseGuess;
                            for (const type in correctedSeatPhrases) {
                                const { expandedSeatNumbers: expandedCSP } = expandSeatPhrases(correctedSeatPhrases[type]);
                                expandedSeatNumbers[type].push(...expandedCSP);
                            }
                            sessionToMutate.counter.invalidSeatPhraseCount = 0;
                            sessionToMutate.confirmPayload.seatPhraseGuess = {};
                            sessionToMutate.status = { main: MAIN_STATUS.CHOOSE_SEAT, secondary: null };
                            await mutateSeatNumbers({ expandedSeatNumObj: expandedSeatNumbers, sessionToMutate });
                            break;
                        case SEC_STATUS.MODIFY_SEAT:
                            await getEditSeats(chatId);
                    }
                    break;
                }
            case MAIN_STATUS.CONFIRM_PROCEED:
                {
                    sessionToMutate.status = { main: MAIN_STATUS.CHOOSE_SEAT, secondary: null };
                    await sendSeatLegend(chatId);
                    const showtime = sessionToMutate.confirmPayload.uniqueSchedule;
                    const { dateTime, cinema, hall, isPlatinum } = showtime;
                    const selection = {
                        isSelected: true,
                        scheduleId: showtime._id.toString(),
                        movie: sessionToMutate.bookingInfo.movie,
                        dateTime,
                        cinema,
                        hall,
                        isPlatinum,
                        seatPlanMsgId: null,
                        seatPlanFileId: null,
                        seatPlanCallback: []
                    };
                    sessionToMutate.bookingInfo.ticketing = [selection];
                    const { seatPlanMsgId, seatPlanFileId, seatPlanCallback } = await sendSeatPlan({
                        chat_id: chatId,
                        bookingInfo: sessionToMutate.bookingInfo,
                        seatingPlan: showtime.seatingPlan
                    });
                    for (let i = 0; i < sessionToMutate.bookingInfo.ticketing.length; i++) {
                        const selection = sessionToMutate.bookingInfo.ticketing[i];
                        if (selection.scheduleId === showtime._id.toString()) {
                            sessionToMutate.bookingInfo.ticketing[i].seatPlanMsgId = seatPlanMsgId.toString();
                            sessionToMutate.bookingInfo.ticketing[i].seatPlanFileId = seatPlanFileId;
                            sessionToMutate.bookingInfo.ticketing[i].seatPlanCallback = seatPlanCallback;
                            break;
                        }
                    }
                    sessionToMutate.confirmPayload.uniqueSchedule = {};
                    break;
                }
            case MAIN_STATUS.CONFIRM_DETAILS:
                {
                    sessionToMutate.status = { main: MAIN_STATUS.AWAIT_PAYMENT, secondary: null };
                    await getPayment(chatId, bookingInfo);
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