module.exports = { inline_query_date_exceeded, inline_query_movie, inline_query_movie_no_result, inline_query_showtime, inline_query_showtime_no_result, inline_query_cache }


function inline_query(chatId, query) {
    return {
        body: {
            "update_id": 502253203,
            "inline_query": {
                "id": "3223780132915284104",
                "from": {
                    "id": Number(chatId),
                    "is_bot": false,
                    "first_name": "Loh_QY",
                    "language_code": "en"
                },
                "query": query,
                "offset": ""
            }
        }
    };
}

function inline_query_date_exceeded(chatId) {
    return inline_query(chatId, "aug 31 amk hub");
}

function inline_query_movie(chatId) {
    return inline_query(chatId, "now showing");
}

function inline_query_movie_no_result(chatId) {
    return inline_query(chatId, "jurong east 3pm");
}

function inline_query_showtime(chatId) {
    return inline_query(chatId, "tenet");
}

function inline_query_showtime_no_result(chatId) {
    return inline_query(chatId, "ghostbuster 3pm this saturday");
}

function inline_query_cache(chatId, cacheId) {
    return {
        body: {
            "update_id": 502253203,
            "inline_query": {
                "id": "3223780132915284104",
                "from": {
                    "id": Number(chatId),
                    "is_bot": false,
                    "first_name": "Loh_QY",
                    "language_code": "en"
                },
                "query": `unique result ❤️ ${cacheId}`,
                "offset": ""
            }
        }
    };
}