const setSchema = require('../setSchema');

const logs = {
    bsonType: "object",
    properties: {
        _id: { bsonType: "string" },
        data: { bsonType: "string" },
    }
};

setSchema("logs", logs);
