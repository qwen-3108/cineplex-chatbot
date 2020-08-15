const setSchema = require('../setSchema');
const { SEAT_STATUS } = require('../../@global/CONSTANTS');

const showtime = {
    bsonType: "object",
    maxProperties: 9,
    properties: {
        _id: { bsonType: "objectId" },
        cinema: { bsonType: "string" },
        dateTime: { bsonType: "date" },
        hall: { enum: [1, 2, 3, 4, 5, 6, 7, 8] },
        movieId: { bsonType: "string" },
        isPlatinum: { bsonType: "bool" },
        totalSeats: { bsonType: "int" },
        sold: { bsonType: "int" },
        seatingPlan: {
            bsonType: "object",
            patternProperties: {
                "^[A-Q]": {
                    bsonType: "object",
                    properties: {
                        status: { bsonType: "int" },
                        reserved: {
                            bsonType: "object",
                            properties: {
                                at: {
                                    oneOf: [
                                        { bsonType: "date" },
                                        { bsonType: "null" }]
                                },
                                by: {
                                    oneOf: [
                                        { bsonType: "string" },
                                        { bsonType: "null" }]
                                }
                            }
                        },
                        sold: {
                            bsonType: "object",
                            properties: {
                                at: {
                                    oneOf: [
                                        { bsonType: "date" },
                                        { bsonType: "null" }]
                                },
                                to: {
                                    oneOf: [
                                        { bsonType: "string" },
                                        { bsonType: "null" }]
                                },
                                ticketId: {
                                    oneOf: [
                                        { bsonType: "objectId" },
                                        { bsonType: "null" }]
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

setSchema("showtimes", showtime);