// simulate request body

module.exports = {
    body: {
        "update_id": 502253052,
        "message": {
            "message_id": 244,
            "from": {
                "id": 750594803,
                "is_bot": false,
                "first_name": "Qwen",
                "language_code": "en"
            },
            "chat": {
                "id": 750594803,
                "first_name": "Qwen",
                "type": "private"
            },
            "date": 1592105453,
            "text": "I'd like to watch soul this Friday 8pm"
        }
    }
}

// inline result query that fail validatation
// {"update_id":414893396,"chosen_inline_result":{"from":{"id":750594803,"is_bot":false,"first_name":"Qwen","language_code":"en"},"query":"unique result ❤️ 1596444236814750
// 594803","result_id":"5ec993b26781fbe16f56db56"}}