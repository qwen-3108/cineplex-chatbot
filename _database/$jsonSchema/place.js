const setSchema = require('../setSchema');

const place = {
    bsonType: "object",
    maxProperties: 4,
    properties: {
        name: { bsonType: "string" },
        type: { enum: ["MRT", "LRT"] },
        geometry: {
            bsonType: "object",
            properties: {
                type: { enum: ["Point", "Polygon"] },
                coordinates: {
                    bsonType: "array",
                    items: [{ bsonType: "string" }, { bsonType: "string" }]
                }
            }
        }
    }
};

setSchema("places", place);