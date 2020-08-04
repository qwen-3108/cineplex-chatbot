const setSchema = require('../setSchema');
const inlineKeyboard = require('./inlineKeyboard');
const { MAIN_STATUS, SEC_STATUS } = require('../../@global/CONSTANTS');

const selection = {
    bsonType: "object",
    properties: {
        isSelected: { bsonType: "bool" },
        scheduleId: { bsonType: "string" },
        movie: {
            bsonType: "object",
            properties: {
                title: { bsonType: "string" },
                id: { bsonType: "string" },
                isBlockBuster: { bsonType: "bool" },
                debutDateTime: { bsonType: "date" },
            }
        },
        dateTime: { bsonType: "date" },
        cinema: { bsonType: "string" },
        hall: { enum: [1, 2, 3, 4, 5, 6, 7, 8] },
        isPlatinum: { bsonType: "bool" },
        seatPlanMsgId: { bsonType: "string" },
        seatPlanFileId: { bsonType: "string" },
        seatPlanCallback: {
            bsonType: "array",
            items: inlineKeyboard
        }
    }
};

const session = {
    bsonType: "object",
    required: ["_id"],
    properties: {
        _id: { bsonType: "string" },
        sessionInfo: {
            bsonType: "object",
            required: ["startedAt"],
            properties: {
                startedAt: { bsonType: "date" },
                endedAt: { anyOf: [{ bsonType: "date" }, { bsonType: "null" }] }
            }
        },
        status: {
            bsonType: "object",
            properties: {
                main: { enum: Object.values(MAIN_STATUS) },
                secondary: { enum: Object.values(SEC_STATUS) }
            }
        },
        bookingInfo: {
            bsonType: "object",
            properties: {
                movies: {
                    bsonType: "object",
                    properties: {
                        title: {
                            anyOf: [
                                { bsonType: "string" }, { bsonType: "null" }]
                        },
                        id: {
                            anyOf: [
                                { bsonType: "string" }, { bsonType: "null" }]
                        },
                        debutDateTime: {
                            anyOf: [
                                { bsonType: "date" }, { bsonType: "null" }]
                        },
                        isBlockBuster: {
                            anyOf: [
                                { bsonType: "bool" }, { bsonType: "null" }]
                        },
                    }
                },
                dateTime: {
                    bsonType: "object",
                    properties: {
                        start: {
                            anyOf: [
                                { bsonType: "date" }, { bsonType: "null" }]
                        },
                        end: {
                            anyOf: [
                                { bsonType: "date" }, { bsonType: "null" }]
                        },
                        daysToDbDate: { bsonType: "int" },
                        nextWeekAreDaysLessThan: { bsonType: "int" }
                    }
                },
                cinema: {
                    bsonType: "array",
                    items: { bsonType: "string" }
                },
                place: {
                    anyOf: [
                        { bsonType: "string" }, { bsonType: "null" }]
                },
                experience: { bsonType: "string" },
                seatNumbers: {
                    bsonType: "array",
                    items: { bsonType: "string" }
                },
                ticketing: {
                    bsonType: "array",
                    items: selection
                }
            }
        },
        counter: {
            bsonType: "object",
            properties: {
                invalidSeatCount: { bsonType: "int" },
                invalidSeatPhraseCount: { bsonType: "int" },
                seatTakenCount: { bsonType: "int" },
                justTakenCount: { bsonType: "int" },
                editInfoCount: { bsonType: "int" },
                fallbackCount: { bsonType: "int" }
            }
        },
        confirmPayload: {
            bsonType: "object",
            properties: {
                adjustedDateTime: {
                    bsonType: "object",
                    properties: {
                        start: { bsonType: "date" },
                        end: { bsonType: "date" }
                    }
                },
                uniqueSchedule: {
                    bsonType: "object",
                },
                seatPhraseGuess: {
                    bsonType: "object",
                    properties: {
                        toPush: { bsonType: "array", items: { bsonType: "string" } },
                        toReplace: { bsonType: "array", items: { bsonType: "string" } },
                        toRemove: { bsonType: "array", items: { bsonType: "string" } },
                    }
                }
            }
        },
        payload: {
            bsonType: "object",
            properties: {
                seatNumbers: {
                    bsonType: "array",
                    items: {bsonType: "string"}
                }
            }
        }
    }
};

setSchema("sessions", session);

//validation
//mongo "mongodb+srv://cluster0-yti2p.mongodb.net/cinemaDB" --username qwen --password qwen-pass 
//db.sessions.validate({full:true})