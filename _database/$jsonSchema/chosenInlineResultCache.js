const setSchema = require('../setSchema');

const chosenInlineResultCache = {
    bsonType: "object",
    required: ["_id", "cachedAt", "query"],
    properties: {
        _id: { bsonType: "string" },
        cachedAt: { bsonType: "date" },
        query: { type: "string" },
        state: { enum: ["show", "hide"] }
    }
};

setSchema("chosenInlineResultCache", chosenInlineResultCache);