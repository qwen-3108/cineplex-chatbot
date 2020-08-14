module.exports = { message_via_bot_cinema, message_via_bot_showtime, callback_sId, callback_uSId, plain_text, non_existing_seat, weird_seat_phase, taken_seats, just_taken_seats, valid_seats, successful_payment };

function message_via_bot_cinema(chatId, cinema) {
    return ({
        body: {
            "update_id": 414892331,
            "message": {
                "message_id": 61,
                "from": {
                    "id": Number(chatId),
                    "is_bot": false,
                    "first_name": "Qwen",
                    "language_code": "en"
                },
                "chat": {
                    "id": Number(chatId),
                    "first_name": "Qwen",
                    "type": "private"
                },
                "date": 1594864992,
                "text": `💬 ${cinema}`,
                "via_bot": {
                    "id": 1365952297,
                    "is_bot": true,
                    "first_name": "Cathay Cineplex",
                    "username": "cathay_sg_bot"
                }
            }
        }
    });
}

function message_via_bot_showtime(chatId, showtime) { //"sat" "sun"

    let text;
    let scheduleId;

    switch (showtime) {
        case "sat":
            text = "TENET\n15 August 2020 (Sat), 4 PM\nCathay Cineplex AMK Hub\n� Ticket price: S$ 13.50";
            scheduleId = "5f1fbb80b21f8bd3567c532b";
            break;
        case "sun":
            text = "TENET\n16 August 2020 (Sun), 4 PM\nCathay Cineplex AMK Hub\n� Ticket price: S$ 13.50";
            scheduleId = "5f1fbb3ab21f8bd3567c522b";
            break;
        default:
            throw `Wrong value passed. Please pass only 'sat' or 'sun'`;
    }

    return ({
        body: {
            "update_id": 414894584,
            "message": {
                "message_id": 2797,
                "from": { "id": Number(chatId), "is_bot": false, "first_name": "Qiao Wen", "username": "qwenstillsnoozing", "language_code": "en" },
                "chat": { "id": Number(chatId), "first_name": "Qiao Wen", "username": "qwenstillsnoozing", "type": "private" },
                "date": 1597123618,
                "text": text,
                "entities": [{ "offset": 0, "length": 5, "type": "bold" }],
                "reply_markup": {
                    "inline_keyboard": [[
                        { "text": "Back to List", "switch_inline_query_current_chat": "unique result ❤️ 1597123433029750594803" },
                        { "text": "Seating Plan", "callback_data": `sId =${scheduleId}= ` }
                    ]]
                },
                "via_bot": { "id": 1365952297, "is_bot": true, "first_name": "Cathay Cineplex", "username": "cathay_sg_bot" }
            }
        }
    });
}

function callback_sId(chatId, showtime) { //"sat" "sun"

    let scheduleId;

    switch (showtime) {
        case "sat":
            scheduleId = "5f1fbb80b21f8bd3567c532b";
            break;
        case "sun":
            scheduleId = "5f1fbb3ab21f8bd3567c522b";
            break;
        default:
            throw `Wrong value passed. Please pass only 'sat' or 'sun'`;
    }

    return ({
        body: {
            "update_id": 414892257,
            "callback_query": {
                "id": "3223780131628589681",
                "from": {
                    "id": Number(chatId),
                    "is_bot": false,
                    "first_name": "Qwen",
                    "language_code": "en"
                },
                "inline_message_id": "BQAAAFwRAADzKr0sZgzTYzf0pz0",
                "chat_instance": "5140223267136962557",
                "data": `sId =${scheduleId}=`
            }
        }
    });

}

function callback_uSId(chatId, showtime) { //"sat" "sun" "selected"

    let scheduleId;

    switch (showtime) {
        case "sat":
            scheduleId = "5f1fbb80b21f8bd3567c532b";
            break;
        case "sun":
            scheduleId = "5f1fbb3ab21f8bd3567c522b";
            break;
        case "selected":
            scheduleId = "NA";
            break;
        default:
            throw `Wrong value passed. Please pass only 'sat', 'sun' or 'selected'`;
    }

    return ({
        body: {
            "update_id": 414892257,
            "callback_query": {
                "id": "3223780131628589681",
                "from": {
                    "id": Number(chatId),
                    "is_bot": false,
                    "first_name": "Qwen",
                    "language_code": "en"
                },
                "inline_message_id": "BQAAAFwRAADzKr0sZgzTYzf0pz0",
                "chat_instance": "5140223267136962557",
                "data": `uSId =${scheduleId}=`
            }
        }
    });

}

function plain_text(chatId, text) {
    return ({
        body: {
            "update_id": 502253052,
            "message": {
                "message_id": 1263,
                "from": {
                    "id": Number(chatId),
                    "is_bot": false,
                    "first_name": "Loh_QY",
                    "language_code": "en"
                },
                "chat": {
                    "id": Number(chatId),
                    "first_name": "Loh_QY",
                    "type": "private"
                },
                "date": 1596185584,
                "text": text
            }
        }
    });
}

function non_existing_seat(chatId) {
    return plain_text(chatId, "F7 to G88");
}

function weird_seat_phase(chatId) {
    return plain_text(chatId, "F7 to D3");
}

function taken_seats(chatId) {
    return plain_text(chatId, "A13");
}

function just_taken_seats(chatId) {
    return plain_text(chatId, "A14");
}

function valid_seats(chatId) {
    return plain_text(chatId, "Q1, Q2");
}

function successful_payment(chatId) {
    return ({
        body: {

            "update_id": 502253150,
            "message": {
                "message_id": 627,
                "from": {
                    "id": Number(chatId),
                    "is_bot": false,
                    "first_name": "Qwen",
                    "language_code": "en"
                },
                "chat": {
                    "id": Number(chatId),
                    "first_name": "Qwen",
                    "type": "private"
                },
                "date": 1593524063,
                "successful_payment": {
                    "currency": "SGD",
                    "total_amount": 1900,
                    "invoice_payload": "123",
                    "order_info": {
                        "name": "LOH QIAO WEN",
                        "phone_number": "6583886548"
                    },
                    "telegram_payment_charge_id": "_",
                    "provider_payment_charge_id": "ch_1GzjbOGSFvAD62iWzAsiwdo2"

                }
            }
        }
    });
}

