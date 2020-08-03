const bot = require('express').Router();

const { INTENT, MAIN_STATUS, SEC_STATUS } = require('../@global/CONSTANTS');
const Session = require('../@class/Session');
const InlineQuery = require('../@class/InlineQuery');
const printTickets = require('../@util/printTickets');
const resetBookingInfo = require('../@util/resetBookingInfo');
const queryDialogflow = require('../_dialogflow/queryDialogflow');
const { cache, bookTickets } = require('../_database/query');
const { basics, typing, sendTickets, answerPreCheckoutQuery, finish, toFallback, alertMultipleShowtimes, toEditSeatReq, confirmEdit } = require('../_telegram/reply');
const { validateAndMutateInfo, slotFilling, assignAndValidateSeats, mutateSeatNumbers, onCallback, onConfirm } = require('./logic');

bot.post('/', async function (req, res) {
    try {
        console.log('-----Post req received-----');
        console.log('Req body: ', JSON.stringify(req.body));
        res.end();

        if (req.body.hasOwnProperty('message')) {

            //Pull session information from db or instantiate new Session
            const currentSession = new Session(req.body.message.chat.id.toString());
            await currentSession.init();

            //successful payment message
            if (req.body.message.hasOwnProperty('successful_payment')) {
                typing(currentSession.chatId);
                const { chatId, bookingInfo } = currentSession;
                console.log('Payment received');
                const order_info = req.body.message.successful_payment.order_info;
                const newTickets = await bookTickets(chatId, bookingInfo.ticketing, bookingInfo.seatNumbers, order_info);
                const ticketBuffers = await printTickets(newTickets, bookingInfo);
                sendTickets(chatId, ticketBuffers);
                await finish(chatId, bookingInfo.seatNumbers);
                currentSession.end({ isComplete: true });
            }

            //message via bot
            if (req.body.message.hasOwnProperty('via_bot')) {
                console.log('Message via bot');
                const text = req.body.message.text;
                if (!(/\n/).test(text)) {
                    typing(currentSession.chatId);
                    console.log('Updating cinema');
                    currentSession.bookingInfo.cinema = [text.match(/[A-Za-z]+/g).join(' ')];
                    await slotFilling({ text, extractedInfo: {}, sessionToMutate: currentSession });
                }
            }

            //ordinary message
            if (req.body.message.hasOwnProperty('text')) {
                typing(currentSession.chatId);
                const { text, chat } = req.body.message;
                switch (text) {
                    case '/start':
                        basics.welcome(chat.id);
                        break;
                    case '/help':
                        break;
                    default:
                        const { intent, extractedInfo } = await queryDialogflow(chat.id.toString(), text);
                        if (intent !== INTENT.FALLBACK) currentSession.counter.fallback = 0;
                        switch (intent) {
                            case INTENT.END:
                                basics.end(chat.id);
                                currentSession.end({ isComplete: false });
                                break;
                            case INTENT.CANCEL:
                                basics.cancel(chat.id);
                                break;
                            case INTENT.FALLBACK:
                                currentSession.counter.fallback++;
                                toFallback({ chat_id: chat.id, currentSession });
                                break;
                            case INTENT.CONFIRM:
                                await onConfirm({ text, sessionToMutate: currentSession });
                                break;
                            case INTENT.BOOK:
                            case INTENT.ANSWER:
                            case INTENT.ASK_OTHER:
                                {
                                    currentSession.bookingInfo.ticketing = [];
                                    if (currentSession.secondary === SEC_STATUS.CONFIRM_EDIT) {
                                        const { daysToDbDate, nextWeekAreDaysLessThan } = currentSession.bookingInfo.dateTime;
                                        currentSession.bookingInfo = resetBookingInfo(daysToDbDate, nextWeekAreDaysLessThan);
                                    }
                                    const { ok } = await validateAndMutateInfo({ extractedInfo, sessionToMutate: currentSession });
                                    if (ok) {
                                        await slotFilling({ text, sessionToMutate: currentSession });
                                    }
                                }
                                break;
                            case INTENT.EDIT:
                                {
                                    const { ok } = await validateAndMutateInfo({ extractedInfo, sessionToMutate: currentSession });
                                    if (ok) {
                                        currentSession.status.secondary = SEC_STATUS.CONFIRM_EDIT;
                                        currentSession.counter.editInfoCount++;
                                        const { chatId, bookingInfo, counter } = currentSession;
                                        await confirmEdit(chatId, text, bookingInfo, counter.editInfoCount);
                                    }
                                }
                                break;
                            case INTENT.CHOOSE_SEAT:
                            case INTENT.EDIT_SEAT:
                                {
                                    const { ticketing } = currentSession.bookingInfo;
                                    if (ticketing.length > 1 && ticketing.every(selection => !selection.isSelected)) {
                                        console.log('-----confirming chosen showtime-----');
                                        await alertMultipleShowtimes(chat.id);
                                        return;
                                    }
                                    const expandedSeatNumObj = await assignAndValidateSeats({ text, extractedInfo, sessionToMutate: currentSession });
                                    if (expandedSeatNumObj === undefined) break;
                                    await mutateSeatNumbers({ expandedSeatNumObj, sessionToMutate: currentSession });
                                    break;
                                }
                            case INTENT.ADD_SEAT:
                            case INTENT.CHANGE_SEAT:
                            case INTENT.REMOVE_SEAT:
                                {
                                    currentSession.status = {
                                        main: MAIN_STATUS.CHOOSE_SEAT,
                                        secondary: SEC_STATUS.MODIFY_SEAT
                                    };
                                    await toEditSeatReq(chat.id, text, intent);
                                    break;
                                }
                            default:
                                throw `Custom error: Unrecognized intent ${intent}`;
                        }
                }
            }


            //save session to db
            await currentSession.saveToDb();

        } else if (req.body.hasOwnProperty('inline_query')) {

            const { id, query, offset } = req.body.inline_query;
            if (query !== "") {
                let currentInlineQuery = new InlineQuery(id);
                await currentInlineQuery.handleInlineQuery(query, offset);
            }

        } else if (req.body.hasOwnProperty('pre_checkout_query')) {

            answerPreCheckoutQuery(req.body.pre_checkout_query.id);

        } else if (req.body.hasOwnProperty('callback_query')) {

            const { from, data, inline_message_id } = req.body.callback_query;
            const currentSession = new Session(from.id.toString());
            await currentSession.init();
            await onCallback({ data, inline_message_id, sessionToMutate: currentSession });
            await currentSession.saveToDb();

        } else if (req.body.hasOwnProperty('edited_message')) {

            console.log('Ignore message edited update');

        } else if (req.body.hasOwnProperty('chosen_inline_result')) {

            if (req.body.chosen_inline_result.hasOwnProperty('inline_message_id')) {
                console.log('-----Cache inline_message_id and corresponding query-----');
                const { inline_message_id, query } = req.body.chosen_inline_result;
                await cache.chosenInlineResult(inline_message_id, query);
            } else {
                console.log('Chosen inline result without cb button, no action needed');
            }

        } else {
            console.log('No logic defined to handle such request yet');
        }
    }

    catch (ex) {
        console.log('-----! Error-----');
        console.log(ex);
    }

});

module.exports = bot;