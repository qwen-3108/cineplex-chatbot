module.exports = { chosen_inline_result, message_via_bot, callback_sId };

function chosen_inline_result(scheduleId) {

}

function message_via_bot(chatId, showtime) { //"sat" "sun"

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