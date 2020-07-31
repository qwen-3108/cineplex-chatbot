const setSchema = require('../setSchema');

const ticket = {
    bsonType: "object",
    required: ["scheduleId", "seatNumber", "buyerInfo", "boughtOn"],
    properties: {
        scheduleId: { bsonType: "string" },
        seatNumber: { bsonType: "string" },
        buyerInfo: {
            bsonType: "object",
            properties: {
                chatId: { bsonType: "string" },
                name: { bsonType: "string" },
                phoneNumber: { bsonType: "string" },
            }
        },
        boughtOn: { bsonType: "date" },
    }
};

setSchema("tickets", ticket);

//validation
//mongo "mongodb+srv://cluster0-yti2p.mongodb.net/cinemaDB" --username qwen --password qwen-pass 
//db.tickets.validate({full:true})