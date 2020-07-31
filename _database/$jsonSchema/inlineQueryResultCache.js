const setSchema = require('../setSchema');
const inlineKeyboard = require('./inlineKeyboard');

const singleInlineResult = {
    bsonType: "object",
    required: ["type", "id", "title", "description", "thumb_url"],
    properties: {
        type: { bsonType: "string" },
        id: { bsonType: "string" },
        title: { bsonType: "string" },
        description: { bsonType: "string" },
        thumb_url: { bsonType: "string" },
        input_message_content: {
            bsonType: "object",
            required: ["message_text", "disable_web_page_preview"],
            properties: {
                message_text: { bsonType: "string" },
                parse_mode: { bsonType: "string" },
                disable_web_page_preview: { bsonType: "bool" }
            }
        },
        reply_markup: {
            bsonType: "object",
            properties: {
                inline_keyboard: {
                    bsonType: "array",
                    items: inlineKeyboard
                }
            }
        }
    }
};

const inlineQueryResultCache = {
    bsonType: "object",
    minProperties: 3,
    additionalProperties: false,
    properties: {
        _id: { bsonType: "string" },
        cachedAt: { bsonType: "date" },
        inlineQueryResult: {
            bsonType: "array",
            items: singleInlineResult
        }
    }
};

setSchema("inlineQueryResultCache", inlineQueryResultCache);

//validation
//mongo "mongodb+srv://cluster0-yti2p.mongodb.net/cinemaDB" --username qwen --password qwen-pass 
//db.inlineQueryResultCache.validate({full:true})