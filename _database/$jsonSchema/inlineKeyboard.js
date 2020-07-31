const inlineKeyboard = {
    bsonType: "array",
    items: {
        bsonType: "object",
        required: ["text"],
        properties: {
            text: { bsonType: "string" },
            callback_data: { bsonType: "string" },
            switch_inline_query_current_chat: { bsonType: "string" }
        }
    }
};

module.exports = inlineKeyboard;