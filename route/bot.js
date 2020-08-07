const bot = require('express').Router();
const Session = require('../@class/Session');
const InlineQuery = require('../@class/InlineQuery');
const queryDialogflow = require('../_dialogflow/queryDialogflow');
const { cache, bookTickets } = require('../_database/query');

const { INTENT } = require('../@global/CONSTANTS');
const printTickets = require('../@util/printTickets');
const { basics, typing, sendTickets, answerPreCheckoutQuery, finish, sendError, firstTimes } = require('../_telegram/reply');

const slotFilling = require('./handlers/service/book/helpers/slotFilling');
const replyToConfirmHandler = require('./handlers/replyToConfirmHandler');
const callbackHandler = require('./handlers/callbackHandler');
const faqHandler = require('./handlers/faqHandler');
const serviceHandler = require('./handlers/serviceHandler');
const bookHandler = require('./handlers/service/book');
const productQueryHandler = require('./handlers/productQueryHandler');
const toFallback = require('../_telegram/reply/toFallback');

bot.post('/', async function (req, res) {

    let chatId = '';

    try {
        console.log('-----Post req received-----');
        console.log('Req body: ', JSON.stringify(req.body));
        res.end();

        if (req.body.hasOwnProperty('message')) {

            //Pull session information from db or instantiate new Session
            chatId = req.body.message.chat.id.toString();
            const currentSession = new Session(chatId);
            await currentSession.init();

            //successful payment message
            if (req.body.message.hasOwnProperty('successful_payment')) {
                typing(currentSession.chatId);
                const { chatId, bookingInfo } = currentSession;
                console.log('Payment received');
                const order_info = req.body.message.successful_payment.order_info;
                const newTickets = await bookTickets(chatId, bookingInfo.ticketing, bookingInfo.seatNumbers, order_info);
                const ticketBuffers = await printTickets(newTickets, bookingInfo);
                await sendTickets(chatId, ticketBuffers);
                await finish(chatId, bookingInfo.seatNumbers);
                currentSession.end({ isComplete: true });
            }

            //message via bot
            if (req.body.message.hasOwnProperty('via_bot')) {
                console.log('Message via bot');
                const text = req.body.message.text;
                if ((/💬/).test(text)) {
                    typing(currentSession.chatId);
                    console.log('Updating cinema');
                    currentSession.bookingInfo.cinema = [text.match(/[A-Za-z]+/g).join(' ')];
                    await slotFilling({ text, extractedInfo: {}, sessionToMutate: currentSession });
                } else if ((/rating/i).test(text) && !currentSession.counter.seenMovieCard) {
                    typing(currentSession.chatId);
                    await firstTimes.movieCard(currentSession.chatId);
                    currentSession.counter.seenMovieCard++;
                } else if ((/ticket price/i).test(text) && !currentSession.counter.seenShowtimeCard) {
                    typing(currentSession.chatId);
                    await firstTimes.showtimeCard(currentSession.chatId);
                    currentSession.counter.seenShowtimeCard++;
                }
            }

            //ordinary message
            if (req.body.message.hasOwnProperty('text') && !req.body.message.hasOwnProperty('via_bot')) {
                typing(currentSession.chatId);
                const { text, chat } = req.body.message;
                switch (text) {
                    case '/start':
                        await basics.welcome(chat.id);
                        break;
                    case '/help':
                        break;
                    default:
                        const { intent, extractedInfo } = await queryDialogflow(chat.id.toString(), text);
                        const intentArr = intent.split('.');
                        switch (intentArr[0]) {
                            case INTENT.WELCOME.SELF:
                                currentSession.counter.fallbackCount = 0;
                                await basics.welcome(chat.id);
                                break;
                            case INTENT.END.SELF:
                                currentSession.counter.fallbackCount = 0;
                                await basics.end(chat.id);
                                currentSession.end({ isComplete: false });
                                break;
                            case INTENT.CANCEL.SELF:
                                currentSession.counter.fallbackCount = 0;
                                await basics.cancel(chat.id);
                                break;
                            case INTENT.FALLBACK.SELF:
                                currentSession.counter.fallbackCount++;
                                await toFallback({ chat_id: chat.id, currentSession });
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
                chatId = from.id;
                let currentInlineQuery = new InlineQuery(id);
                await currentInlineQuery.handleInlineQuery(query, offset);
            }

        } else if (req.body.hasOwnProperty('pre_checkout_query')) {

            await answerPreCheckoutQuery(req.body.pre_checkout_query.id);

        } else if (req.body.hasOwnProperty('callback_query')) {

            const { from, data, inline_message_id } = req.body.callback_query;
            chatId = from.id.toString();
            const currentSession = new Session(chatId);
            await currentSession.init();
            await callbackHandler({ data, inline_message_id, sessionToMutate: currentSession });
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

    } catch (ex) {
        console.log('-----! Error-----');
        console.log(ex);
        await sendError(chatId);
    }

});

module.exports = bot;