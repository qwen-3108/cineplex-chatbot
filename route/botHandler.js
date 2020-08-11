const Session = require('../@class/Session');
const InlineQuery = require('../@class/InlineQuery');
const queryDialogflow = require('../_dialogflow/queryDialogflow');
const { cache, bookTickets } = require('../_database/query');

const { INTENT } = require('../@global/CONSTANTS');
const { COLLECTIONS } = require('../@global/COLLECTIONS');
const LOGS = require('../@global/LOGS');
const printTickets = require('../@util/printTickets');
const reply = require('../_telegram/reply');
const { basics, sendTickets, finish, sendError } = require('../_telegram/reply');
const post = require('../_telegram/post');

const slotFilling = require('./handlers/service/book/helpers/slotFilling');
const replyToConfirmHandler = require('./handlers/replyToConfirmHandler');
const callbackHandler = require('./handlers/callbackHandler');
const faqHandler = require('./handlers/faqHandler');
const serviceHandler = require('./handlers/serviceHandler');
const bookHandler = require('./handlers/service/book');
const productQueryHandler = require('./handlers/productQueryHandler');
const chosenInlineResultHandler = require('./handlers/chosenInlineResultHandler');
const toFallback = require('../_telegram/reply/toFallback');
const populateBookingInfo = require('../@util/populateBookingInfo');
const axiosErrorCallback = require('../_telegram/axiosErrorCallback');

module.exports = async function botHandler(req, res) {

    let chatId = getChatId(req.body);

    if (chatId === '') {  // not among request to handle
        console.log('-----Post req received-----');
        console.log(`Req body: ${JSON.stringify(req.body)}`);
        console.log('No logic defined to handle such request yet');
        return;
    }

    try {
        LOGS.initializeLogs(chatId);
        LOGS.logInfo(chatId, '-----Post req received-----');
        LOGS.logInfo(chatId, `Req body: ${JSON.stringify(req.body)}`);
        res.end();

        if (req.body.hasOwnProperty('message')) {

            //Pull session information from db or instantiate new Session
            const currentSession = new Session(chatId);
            await currentSession.init();

            //successful payment message
            if (req.body.message.hasOwnProperty('successful_payment')) {
                post.sendTypingAction(currentSession.chatId);
                const { chatId, bookingInfo } = currentSession;
                LOGS.logInfo(chatId, 'Payment received');
                const order_info = req.body.message.successful_payment.order_info;
                const newTickets = await bookTickets(currentSession.chatId, bookingInfo.ticketing, bookingInfo.seatNumbers, order_info);
                const ticketBuffers = await printTickets(newTickets, bookingInfo);
                await sendTickets(currentSession.chatId, ticketBuffers);
                await finish(currentSession.chatId, bookingInfo.seatNumbers);
                currentSession.end({ isComplete: true });
            }

            //message via bot
            if (req.body.message.hasOwnProperty('via_bot')) {
                LOGS.logInfo(currentSession.chatId, 'Message via bot');
                const text = req.body.message.text;
                LOGS.logConv(currentSession.chatId, text);
                if ((/💬/).test(text)) {
                    post.sendTypingAction(currentSession.chatId);
                    LOGS.logInfo(currentSession.chatId, 'Updating cinema');
                    currentSession.bookingInfo.cinema = [text.match(/[A-Za-z]+/g).join(' ')];
                    await slotFilling({ text, extractedInfo: {}, sessionToMutate: currentSession });
                } else if ((/rating/i).test(text) && !currentSession.counter.seenMovieCard) {
                    post.sendTypingAction(currentSession.chatId);
                    await reply.firstMovieCard(currentSession.chatId);
                    currentSession.counter.seenMovieCard++;
                } else if ((/ticket price/i).test(text) && !currentSession.counter.seenShowtimeCard) {
                    post.sendTypingAction(currentSession.chatId);
                    await reply.firstShowtimeCard(currentSession.chatId);
                    currentSession.counter.seenShowtimeCard++;
                }
            }

            //ordinary message
            if (req.body.message.hasOwnProperty('text') && !req.body.message.hasOwnProperty('via_bot')) {
                post.sendTypingAction(currentSession.chatId);
                const { text } = req.body.message;
                LOGS.logConv(currentSession.chatId, text);
                switch (text) {
                    case '/start':
                        await basics.welcome(currentSession.chatId);
                        break;
                    case '/help':
                        break;
                    default:
                        const { intent, extractedInfo } = await queryDialogflow(currentSession.chatId, text);
                        const intentArr = intent.split('.');
                        switch (intentArr[0]) {
                            case INTENT.WELCOME.SELF:
                                currentSession.counter.fallbackCount = 0;
                                await basics.welcome(currentSession.chatId);
                                break;
                            case INTENT.END.SELF:
                                currentSession.counter.fallbackCount = 0;
                                await basics.end(currentSession.chatId);
                                currentSession.end({ isComplete: false });
                                break;
                            case INTENT.CANCEL.SELF:
                                currentSession.counter.fallbackCount = 0;
                                await basics.cancel(currentSession.chatId);
                                break;
                            case INTENT.FALLBACK.SELF:
                                currentSession.counter.fallbackCount++;
                                await toFallback({ chat_id: currentSession.chatId, currentSession });
                                break;
                            case INTENT.REPLY_TO_CONFIRM.SELF:
                                await replyToConfirmHandler({ intentArr, text, sessionToMutate: currentSession });
                                break;
                            case INTENT.SERVICE.SELF:
                                currentSession.counter.fallbackCount = 0;
                                await serviceHandler({ text, intentArr, extractedInfo, sessionToMutate: currentSession });
                                break;
                            case INTENT.PRODUCT_QUERY.SELF:
                                currentSession.counter.fallbackCount = 0;
                                await productQueryHandler({ text, intentArr, extractedInfo, sessionToMutate: currentSession });
                                break;
                            case INTENT.FAQ.SELF:
                                currentSession.counter.fallbackCount = 0;
                                await faqHandler({ text, intentArr, extractedInfo, sessionToMutate: currentSession });
                                break;
                            case INTENT.SERVICE.BOOK.SELF:
                                await bookHandler({ text, intentArr, extractedInfo, sessionToMutate: currentSession });
                            default:
                                throw `Custom error: Unrecognized intent ${intent}`;
                        }
                }
            }

            //save session to db
            await currentSession.saveToDb();

        } else if (req.body.hasOwnProperty('inline_query')) {

            const { id, from, query, offset } = req.body.inline_query;
            if (query !== "") {
                chatId = from.id.toString();
                let currentInlineQuery = new InlineQuery(id);
                await currentInlineQuery.handleInlineQuery(query, offset, chatId);
            }

        } else if (req.body.hasOwnProperty('pre_checkout_query')) {

            await post.answerPreCheckoutQuery(req.body.pre_checkout_query.id);

        } else if (req.body.hasOwnProperty('callback_query')) {

            const { from, data, inline_message_id } = req.body.callback_query;
            chatId = from.id.toString();
            const currentSession = new Session(chatId);
            await currentSession.init();
            await callbackHandler({ data, inline_message_id, sessionToMutate: currentSession });
            await currentSession.saveToDb();

        } else if (req.body.hasOwnProperty('edited_message')) {

            LOGS.logInfo(chatId, 'Ignore message edited update');

        } else if (req.body.hasOwnProperty('chosen_inline_result')) {

            const toExcludeRegex = /(?:^No movies found)/;
            if (req.body.chosen_inline_result.hasOwnProperty('inline_message_id') && !toExcludeRegex.test(req.body.chosen_inline_result.query)) {

                const { inline_message_id, query, result_id } = req.body.chosen_inline_result;
                const currentSession = new Session(chatId);
                await currentSession.init();
                await chosenInlineResultHandler({ result_id, sessionToMutate: currentSession });
                await currentSession.saveToDb();
                console.log('-----Cache inline_message_id and corresponding query-----');
                await cache.chosenInlineResult(inline_message_id, query);

            } else {
                LOGS.logInfo(chatId, 'Chosen inline result without cb button, no action needed');
            }

        }

    } catch (ex) {
        LOGS.logError(chatId, '-----! Error-----');
        if (ex.isAxiosError) {
            axiosErrorCallback(chatId, ex);
        } else {
            LOGS.logError(chatId, ex);
        }
        await sendError(chatId);

    } finally {

        const logs = LOGS.getLogs(chatId);
        await COLLECTIONS.logs.updateOne(
            { _id: chatId },
            [{
                $set: {
                    data: { $concat: ["$data", logs] },
                }
            }],
            function (err) { console.log(`Logs updation error: ${err}`) });
    }

};

function getChatId(body) {
    if (body.hasOwnProperty('message')) {
        return body.message.chat.id.toString();
    } else if (body.hasOwnProperty('edited_message')) {
        return body.edited_message.chat.id.toString();
    } else if (body.hasOwnProperty('inline_query')) {
        return body.inline_query.from.id.toString();
    } else if (body.hasOwnProperty('chosen_inline_result')) {
        return body.chosen_inline_result.from.id.toString();
    } else if (body.hasOwnProperty('pre_checkout_query')) {
        return body.pre_checkout_query.from.id.toString();
    } else if (body.hasOwnProperty('callback_query')) {
        return body.callback_query.from.id.toString();
    }
    return '';
}