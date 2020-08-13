const setSchema = require('../setSchema');

const cinema = {
    bsonType: "object",
    maxProperties: 6,
    properties: {
        cinema: { bsonType: "string" },
        address: {
            bsonType: "object",
            properties: {
                line1: { bsonType: "string" },
                line2: { bsonType: "string" },
                postCode: { bsonType: "int" }
            }
        },
        location: {
            bsonType: "object",
            properties: {
                type: {
                    enum: ["Point", "Polygon"]
                },
                coordinates: {
                    bsonType: "array",
                    items: [{ bsonType: "double" }, { bsonType: "double" }]
                }
            }
        },
        mrt: { bsonType: "string" },
        withPlatinumMovieSuites: { bsonType: "bool" },
    }
};

setSchema("cinemas", cinema);

//validation
//mongo "mongodb+srv://cluster0-yti2p.mongodb.net/cinemaDB" --username qwen --password qwen-pass 
//db.cinemas.validate({full:true})