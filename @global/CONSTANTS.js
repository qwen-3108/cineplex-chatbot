module.exports = {
    INLINE_KEYBOARD: {
        MOVIE: {
            text: 'Now Showing',
            switch_inline_query_current_chat: 'now showing'
        }
    },
    ROW: {
        REGULAR: ["Q", "P", "N", "M", "L", "K", "J", "H", "G", "F", "E", "D", "C", "B", "A"],
        PLATINUM: ["K", "J", "H", "G", "F", "E", "D", "C", "B", "A"]
    },
    TIMEZONE_OFFSET: 8,
    FAQ: {
        CUSTOMER_TYPE: {
            STUDENT: 'student',
            SENIOR: 'senior citizen',
            PIONEER_MERDEKA: 'pioneer/merdeka generation',
            CHILD: 'child'
        },
        YES_NO_REGEX: {
            OPEN: /(?:what|when|where|how|why|who)/i,
            YES_NO: /(?:is|are|am|will|would|do|does|did)\s(?:i|my|you|your|he|his|she|her|it|the)/i
        }
    },
    TICKET: {
        WIDTH: 810,
        HEIGHT: 1155,
        DISCLAIMER_LINE_1: 'Feel free to forward this ticket to others as necessary. Do note that each QR code can only be',
        DISCLAIMER_LINE_2: 'scanned once, so kindly make sure you are only forwarding to your intended recipients.',
        LABEL_TEXTS: {
            movie: { x: 55, y: 810 },
            "seat number": { x: 623, y: 810 },
            date: { x: 55, y: 890 },
            time: { x: 355, y: 890 },
            hall: { x: 623, y: 890 },
            cinema: { x: 55, y: 970 },
            experience: { x: 623, y: 970 }
        },
        DETAIL_TEXTS: {
            movie: { x: 55, y: 840 },
            "seat-number": { x: 623, y: 840 },
            date: { x: 55, y: 920 },
            time: { x: 355, y: 920 },
            hall: { x: 623, y: 920 },
            cinema: { x: 55, y: 1000 },
            experience: { x: 623, y: 1000 }
        }
    },
    CINEMA_THUMB: {
        "Cathay Cineplex AMK Hub": 'https://imgur.com/haHZZsd.png',
        "Cathay Cineplex Causeway Point": 'https://imgur.com/mrMqLZ1.png',
        "Cathay Cineplex Cineleisure": 'https://imgur.com/vUmipcg.png',
        "Cathay Cineplex Downtown East": 'https://imgur.com/DjYvsDo.png',
        "Cathay Cineplex JEM": 'https://imgur.com/HWeTQBR.png',
        "Cathay Cineplex Parkway Parade": 'https://imgur.com/oAFlhwm.png',
        "The Cathay Cineplex": 'https://imgur.com/M3HoSCg.png',
        "Cathay Cineplex West Mall": 'https://imgur.com/E9jZGAl.png'
    },
    DATES_IN_DB: {
        0: "2020-05-24",
        1: "2020-05-25",
        2: "2020-05-26",
        3: '2020-05-27',
        4: "2020-05-28",
        5: "2020-05-29",
        6: "2020-05-30"
    },
    INTENT: {
        BOOK: 'bookTicket',
        ANSWER: 'bookTicket - answer',
        EDIT: 'bookTicket - edit',
        ASK_OTHER: 'bookTicket - ask',
        CHOOSE_SEAT: 'chooseSeat',
        EDIT_SEAT: 'chooseSeat - edit',
        REMOVE_SEAT: 'chooseSeat - remove',
        CHANGE_SEAT: 'chooseSeat - change',
        ADD_SEAT: 'chooseSeat - add',
        FAQ_ADVANCE_BOOKING: 'faq - advanceBooking',
        FAQ_CANCEL_BOOKING: 'faq - cancelBooking',
        FAQ_MODIFY_BOOKING: 'faq - modifyBooking',
        FAQ_MOVIE_SCHED: 'faq - movieScheduleUpdate',
        FAQ_OPERATING_HOURS: 'faq - checkOperatingHours',
        FAQ_TICKET_PRICE: 'faq - checkTicketPrice',
        FAQ_MOVIE_AVAILABILITY: 'faq - checkMovieAvailability',
        FAQ_NOW_SHOWING: 'faq - nowShowing',
        CANCEL: 'cancel',
        END: 'cancel - yes',
        CONFIRM: 'confirm',
        FALLBACK: 'fallback',
        WELCOME: 'welcome',
        INLINE_QUERY_MOVIE: 'inlineQuery - movie',
        INLINE_QUERY_SHOWTIME: 'inlineQuery - showtime',
        INLINE_QUERY_CACHE: 'inlineQuery - cachedResult'
    },
    MAIN_STATUS: {
        NULL: null,
        PROMPT_MOVIE: 'prompt-movie',
        PROMPT_DATETIME: 'prompt-datetime',
        GET_CINEMA: 'get-cinema',
        GET_CINEMA_TIME_EXP: 'get cinema time exp',
        GET_TIME_EXP: 'get time and/or exp',
        GET_EXP: 'get exp',
        CONFIRM_PROCEED: 'confirm  proceed',
        CHOOSE_SEAT: 'choose seat',
        CONFIRM_DETAILS: 'confirm-details',
        AWAIT_PAYMENT: 'await-payment',
        COMPLETE: 'complete',
        CANCELLED: 'cancelled',
    },
    SEC_STATUS: {
        //slot filling
        NULL: null,
        EXCEED_SCHEDULE: 'exceed schedule',
        UPCOMING_MOVIE: 'upcoming-movie',
        WARN_PLATINUM: 'warn platinum',
        CONFIRM_EDIT: 'confirm-edit',
        //choose-seat
        INVALID_SEAT: 'invalid seat',
        INVALID_SEAT_PHRASE: 'invalid seat phrase',
        SEAT_TAKEN: 'seat taken',
        MODIFY_SEAT: 'modify seat',
        CONFIRM_SEAT: 'confirm seat',
        CONFIRM_CONTINUE: 'confirm continue',
        //from faq
        CONFIRM_MOVIE: 'confirm movie',
    },
    NO_RESULT_REASON: {
        NO_SLOT: 'NO_SLOT',
        SOLD_OUT: 'SOLD_OUT',
        ALL_SOLD_OUT: 'ALL_SOLD_OUT',
        END_PAGINATION: 'END_PAGINATIOn'
    },
    SEAT_STATUS: {
        AVAILABLE: 0,
        SOLD: 1,
        RESERVED: 2
    },
    REGEX: {
        SEAT_PHRASE: /[A-Z]\d+(?:\s?(?:to|\-)\s?[A-Z]\d+)?/gi,
        START_END_SEAT: /(?<startSeat>[A-Z]\d+)(?:\s?(?:to|-)\s?(?<endSeat>[A-Z]\d+))?/i,
        SEAT_NUM: /[A-Z]\d+/gi,
        SEAT_CHAR_NUM: /(?<row>[A-Z])(?<num>\d+)/i,
        ROW_CHAR: /[A-Z]/i,
        NUM: /\d+/,
        TO_PUSH: /(?<=(?:it'?s |add |give me |book ))(?:(?:[A-Z]\d+)(?:\s?(?:to|-)\s?)?(?:[A-Z]\d+)?)(?:(?:,\s?|,?\s?(?:and|&|n)\s)?(?:(?:[A-Z]\d+)(?:\s?(?:to|-)\s?)?(?:[A-Z]\d+)?))*/i,
        TO_PUSH_2: /(?<=(?:i get |to get |take |and ))(?:(?:[A-Z]\d+)(?:\s?(?:to|-)\s?)?(?:[A-Z]\d+)?)(?:(?:,\s?|,?\s?(?:and|&|n)\s)?(?:(?:[A-Z]\d+)(?:\s?(?:to|-)\s?)?(?:[A-Z]\d+)?))*(?= too)/i,
        TO_REPLACE: /(?<=(?:just|only)\s)(?:(?:[A-Z]\d+)(?:\s?(?:to|-)\s?)?(?:[A-Z]\d+)?)(?:(?:,\s?|,?\s?(?:and|&|n)\s)?(?:(?:[A-Z]\d+)(?:\s?(?:to|-)\s?)?(?:[A-Z]\d+)?))*/i,
        TO_REPLACE_2: /(?:(?:[A-Z]\d+)(?:\s?(?:to|-)\s?)?(?:[A-Z]\d+)?)(?:(?:,\s?|,?\s?(?:and|&|n)\s)?(?:(?:[A-Z]\d+)(?:\s?(?:to|-)\s?)?(?:[A-Z]\d+)?))*(?= instead)/i,
        TO_CHANGE: /(?<=(?:change|change from)\s)(?<remove>(?:[A-Z]\d+)(?:\s?(?:to|-)\s?)?(?:[A-Z]\d+)?)(?:\sto\s)(?<add>(?:[A-Z]\d+)(?:\s?(?:to|-)\s?)?(?:[A-Z]\d+)?)*/i,
        TO_REMOVE: /(?<=(?:no|don't need|won't get|not getting|not|remove|release|instead of|not taking|delete|get rid of)\s)(?:(?:[A-Z]\d+)(?:\s?(?:to|-)\s?)?(?:[A-Z]\d+)?)(?:(?:,\s?|,?\s?(?:and|&|n)\s)?(?:(?:[A-Z]\d+)(?:\s?(?:to|-)\s?)?(?:[A-Z]\d+)?))*/i,
    }
}