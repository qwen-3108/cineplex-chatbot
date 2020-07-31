const setSchema = require('../setSchema');

const place = {
    bsonType: "object",
    minProperties: 3,
    additionalProperties: false,
    properties: {
        name: { bsonType: "string" },
        type: { enum: ["MRT"] },
        geometry: {
            bsonType: "object",
            properties: {
                type: { enum: ["Point", "Polygon"] },
                coordinates: {
                    bsonType: "array",
                    items: [{ bsonType: "double" }, { bsonType: "double" }]
                }
            }
        }
    }
};

setSchema("places", place);

//validation
//mongo "mongodb+srv://cluster0-yti2p.mongodb.net/cinemaDB" --username qwen --password qwen-pass 
//db.places.validate({full:true})