const axios = require('axios');
const { logConv } = require('../@global/LOGS');

module.exports = { sendMessage, sendTypingAction, answerInlineQuery, answerPreCheckoutQuery, deleteMessage, editMessageMedia, editMessageMedia, editMessageReplyMarkup, editMessageText, sendInvoice, sendPhoto };

async function sendMessage(chat_id, text, extraData) {

    logConv(chat_id, `response: ${text}`);

    const data = { chat_id: chat_id, text: text };
    if (extraData !== undefined) {
        if (extraData.parseMode !== undefined) {
            data['parse_mode'] = extraData.parseMode;
        }
        if (extraData.replyMarkup !== undefined) {
            data['reply_markup'] = extraData.replyMarkup;
        }
    }
    const config = {
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/sendMessage',
        data: data
    }
    return await axios(config);

}

async function sendTypingAction(chatId) {

    const config = {
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/sendChatAction',
        data: {
            chat_id: chatId,
            action: 'typing'
        }
    };
    return await axios(config);

}

async function answerInlineQuery(inlineQueryId, inlineQueryResult, nextOffset) {

    const config = {
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/answerInlineQuery',
        data: {
            inline_query_id: inlineQueryId,
            results: inlineQueryResult,
            next_offset: nextOffset
        }
    };
    return await axios(config);

}

async function answerPreCheckoutQuery(preCheckoutQueryId) {

    const config = {
        url: process.env.TELEGRAM_ENDPOINT + '/answerPreCheckoutQuery',
        method: 'post',
        data: {
            pre_checkout_query_id: preCheckoutQueryId,
            ok: true
        }
    };

    return await axios(config);

}

async function deleteMessage(chatId, messageId) {

    const config = {
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/deleteMessage',
        data: {
            chat_id: chatId,
            message_id: messageId
        }
    }
    return await axios(config);

}

async function editMessageMedia(formData) {

    if (formData instanceof FormData) {

        const config = {
            method: 'post',
            url: process.env.TELEGRAM_ENDPOINT + '/editMessageMedia',
            data: formData,
            headers: formData.getHeaders()
        }
        return await axios(config);

    } else {
        throw new Error("edit message media: formData parameter must be of type FormData");
    }

}

async function editMessageReplyMarkup(chatId, messageId, replyMarkup) {

    const config = {
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/editMessageReplyMarkup',
        data: {
            chat_id: chatId,
            message_id: messageId,
            reply_markup: replyMarkup
        }
    }
    return await axios(config);

}

async function editMessageText(inlineMessageId, text, extraData) {

    const data = { inline_message_id: inlineMessageId, text: text };

    if (extraData !== undefined) {
        if (extraData.parseMode !== undefined) {
            data['parse_mode'] = extraData.parseMode;
        }
        if (extraData.replyMarkup !== undefined) {
            data['reply_markup'] = extraData.replyMarkup;
        }
        if (extraData.disableWebPagePreview !== undefined) {
            data['disable_web_page_preview'] = extraData.disableWebPagePreview;
        }
    }

    const config = {
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/editMessageText',
        data: data
    };

    return await axios(config);

}

async function sendInvoice(chatId, invoice, { photoUrl }) {

    const config = {
        method: 'post',
        url: process.env.TELEGRAM_ENDPOINT + '/sendInvoice',
        data: {
            chat_id: chatId,
            provider_token: process.env.STRIPE_TOKEN,
            start_parameter: '123',
            payload: '.',
            currency: 'SGD',
            photo_url: photoUrl,
            need_name: true,
            need_phone_number: true,
            ...invoice
        }
    };
    return await axios(config);

}

async function sendPhoto(formData) {

    if (formData instanceof FormData) {

        const config = {
            method: 'post',
            url: process.env.TELEGRAM_ENDPOINT + '/sendPhoto',
            data: formData,
            headers: formData.getHeaders()
        }
        return await axios(config);

    } else {
        throw new Error("sendPhoto: formData parameter must be of type FormData");
    }

}

