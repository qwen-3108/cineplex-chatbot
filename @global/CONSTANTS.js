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
    NA_THUMB: "https://i.imgur.com/2wZkHHL.png",
    DATES_IN_DB: {
        0: "2020-05-24",
        1: "2020-05-25",
        2: "2020-05-26",
        3: '2020-05-27',
        4: "2020-05-28",
        5: "2020-05-29",
        6: "2020-05-30"
    },
    PARAMETERS: {
        EXPERIENCE: {
            PLATINUM: 'Platinum Movie Suites',
            REGULAR: ''
        },
        CUSTOMER_TYPE: {
            CHILDREN: 'children',
            STUDENT: 'student',
            SENIOR_CITIZEN: 'senior citizen',
            PIONEER_MERDEKA: 'pioneer/merdeka generation'
        }
    },
    INTENT: {
        SERVICE: {
            SELF: 'service',
            BOOK: {
                SELF: 'book',
                START: { SELF: 'start' },
                EDIT_INFO: { SELF: 'editInfo' },
                ANSWER_PROMPT: { SELF: 'answerPrompt' },
                WHAT_ABOUT: { SELF: 'whatAbout' },
                SEAT: {
                    SELF: 'seat',
                    FIRST_CHOOSE: { SELF: 'firstChoose' },
                    EDIT: { SELF: 'edit' },
                    ADD: { SELF: 'add' },
                    CHANGE: { SELF: 'change' },
                    REMOVE: { SELF: 'remove' },
                }
            }
        },
        PRODUCT_QUERY: {
            SELF: 'productQuery',
            NOW_SHOWING: { SELF: 'nowShowing' },
            MOVIE: {
                SELF: 'movie',
                AVAILABLE: { SELF: 'available' },
                IS_BLOCKBUSTER: { SELF: 'isBlockBuster' },
                PRICE: { SELF: 'price' },
                SHOWTIME: { SELF: 'showtime' },
            }
        },
        FAQ: {
            SELF: 'faq',
            NORMAL_RATES: {
                SELF: 'normalRates',
                CALCULATION: { SELF: 'calculation' }
            },
            SPECIAL_RATES: {
                SELF: 'specialRates',
                GENERAL: { SELF: 'general' },
                CHANNEL: { SELF: 'channel' },
                PRICE: { SELF: 'price' },
                SCOPE: { SELF: 'scope' },
                ELIGIBILITY: { SELF: 'eligibility' },
            },
            EXPERIENCES: {
                SELF: 'experiences',
                PLATINUM: {
                    SELF: 'platinum',
                    FEATURES: { SELF: 'features' },
                    SCOPE: { SELF: 'scope' },
                    PRICE: { SELF: 'price' },
                }
            },
            PROGRAMME: {
                SELF: 'programme',
                BLOCKBUSTER: {
                    SELF: 'blockbuster',
                    ABOUT: { SELF: 'about' },
                    PRICING_REASON: { SELF: 'pricingReason' },
                    HOW_TO_KNOW: { SELF: 'howToKnow' },
                }
            },
            CINEMA: {
                SELF: 'cinema',
                ADDRESS: { SELF: 'address' }
            },
            OPERATIONS: {
                SELF: 'operations',
                CHANGE_BOOKING: { SELF: 'changeBooking' },
                CANCEL_BOOKING: { SELF: 'cancelBooking' },
                ADVANCE_BOOKING: { SELF: 'advanceBooking' },
                SHOWTIME_UPDATING: { SELF: 'showtimeUpdating' },
                OPERATING_HOURS: { SELF: 'operatingHours' },
            },
        },
        CANCEL: { SELF: 'cancel' },
        END: { SELF: 'cancel - yes' },
        REPLY_TO_CONFIRM: {
            SELF: 'replyToConfirm',
            YES: { SELF: 'yes' },
            NO: { SELF: 'no' },
        },
        FALLBACK: { SELF: 'fallback' },
        WELCOME: { SELF: 'welcome' },
        INLINE: {
            MOVIE: { SELF: 'inline.movie' },
            SHOWTIME: { SELF: 'inline.showtime' },
            CACHE: { SELF: 'inline.cachedResult' }
        }
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
        EXCEED_SCHEDULE_TOTAL: 'exceed schedule total',
        EXCEED_SCHEDULE_PARTIAL: 'exceed schedule partial',
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
        IS_YES_NO: /(?:is|are|am|will|would|do|does|did|can)\s(?:i|my|you|your|he|his|she|her|it|the)/i,
        NOT_YES_NO: /(?:what|when|where|how|why|who)/i,
        THANKS: /(?:thanks|thank you)/i
    }
}