const randomDate = "08-14-20";
const endOfWeek = "05-30-20 23:59:59";
const startOfWeek = "05-24-20 00:00:00";

module.exports = {

    makeDbQuery: [
        [
            'when ask about movie should form query with movieId',
            {
                movieId: "movie_id",
                dateTimeObj: { start: null, end: null, sessionStartedAt: randomDate },
                cinemaArr: [],
            },
            { movieId: "movie_id" }
        ],
        [
            'when ask about cinema should form query with cinema array',
            {
                movieId: null,
                dateTimeObj: { start: null, end: null, sessionStartedAt: randomDate },
                cinemaArr: ["cinema_1", "cinema_2"],
            },
            { cinema: { $in: ["cinema_1", "cinema_2"] } }
        ],
        [
            'when ask about platinum should form query with experience',
            {
                movieId: null,
                dateTimeObj: { start: null, end: null, sessionStartedAt: randomDate },
                cinemaArr: [],
                experience: 'Platinum Movie Suites'
            },
            { isPlatinum: true }
        ],
        [
            'when ask about regular should form query with experience',
            {
                movieId: null,
                dateTimeObj: { start: null, end: null, sessionStartedAt: randomDate },
                cinemaArr: [],
                experience: 'Regular'
            },
            { isPlatinum: false }
        ],
        [
            'when ask about today (on Friday) should form query from sessionStartTime (hour) till tomorrow 05:59:59',
            {
                movieId: null,
                dateTimeObj: { start: "08-14-20 00:00:00", end: "08-14-20 23:59:59", sessionStartedAt: "08-14-20 03:41:26" },
                cinemaArr: [],
            },
            { dateTime: { $gte: new Date("05-29-20 03:00:00"), $lte: new Date("05-30-20 05:59:59") } }
        ],
        [
            'when ask about today (on Saturday) should form query from sessionStartTime (hour) till end of week + start of week till Sunday 05:59:59',
            {
                movieId: null,
                dateTimeObj: { start: "08-15-20 00:00:00", end: "08-15-20 23:59:59", sessionStartedAt: "08-15-20 03:41:26" },
                cinemaArr: [],
            },
            {
                $or: [
                    { dateTime: { $gte: new Date("05-30-20 03:00:00"), $lte: new Date(endOfWeek) } },
                    { dateTime: { $gte: new Date(startOfWeek), $lte: new Date("05-24-20 05:59:59") } }
                ]
            }
        ],
        [
            'when ask about this Sunday (on Thursday) should form query from 00:00:00 Sunday till 05:59:59 Monday',
            {
                movieId: null,
                dateTimeObj: { start: "08-16-20 00:00:00", end: "08-16-20 23:59:59", sessionStartedAt: "08-13-20 03:41:26" },
                cinemaArr: [],
            },
            { dateTime: { $gte: new Date("05-24-20 00:00:00"), $lte: new Date("05-25-20 05:59:59") } }
        ],
        [
            'when ask about this Saturday (on Thursday) should form query from 00:00:00 Saturday till end of week + start of week till Sunday 05:59:59',
            {
                movieId: null,
                dateTimeObj: { start: "08-15-20 00:00:00", end: "08-15-20 23:59:59", sessionStartedAt: "08-13-20 03:41:26" },
                cinemaArr: [],
            },
            {
                $or: [
                    { dateTime: { $gte: new Date("05-30-20 00:00:00"), $lte: new Date(endOfWeek) } },
                    { dateTime: { $gte: new Date(startOfWeek), $lte: new Date("05-24-20 05:59:59") } }
                ]
            }
        ],
        [
            'when ask about next Thursday (on Friday 3am) should form query from 00:00:00 till 23:59:59 next Thursday',
            {
                movieId: null,
                dateTimeObj: { start: "08-20-20 00:00:00", end: "08-20-20 23:59:59", sessionStartedAt: "08-14-20 03:00:00" },
                cinemaArr: [],
            },
            { dateTime: { $gte: new Date("05-28-20 00:00:00"), $lte: new Date("05-28-20 23:59:59") } }
        ],
        [
            'when ask about next Thursday (on Friday 9am) should form query from 00:00:00 next Thursday till 05:59:59 next Friday',
            {
                movieId: null,
                dateTimeObj: { start: "08-20-20 00:00:00", end: "08-20-20 23:59:59", sessionStartedAt: "08-14-20 09:00:00" },
                cinemaArr: [],
            },
            { dateTime: { $gte: new Date("05-28-20 00:00:00"), $lte: new Date("05-29-20 05:59:59") } }
        ],
        [
            'when ask about next Friday (on Friday 3am) should form query where end time is next Thursday 23:59:59',
            {
                movieId: null,
                dateTimeObj: { start: "08-21-20 00:00:00", end: "08-21-20 23:59:59", sessionStartedAt: "08-14-20 03:00:00" },
                cinemaArr: [],
            },
            { dateTime: { $gte: new Date("05-29-20 00:00:00"), $lte: new Date("05-28-20 23:59:59") } }
        ],
        [
            'when ask about next Friday (on Friday 9am) should form query from 00:00:00 till 05:59:59 next Friday',
            {
                movieId: null,
                dateTimeObj: { start: "08-21-20 00:00:00", end: "08-21-20 23:59:59", sessionStartedAt: "08-14-20 09:00:00" },
                cinemaArr: [],
            },
            { dateTime: { $gte: new Date("05-29-20 00:00:00"), $lte: new Date("05-29-20 05:59:59") } }
        ],
        [
            'when ask about next Friday (on Friday 3pm) should form query from 00:00:00 till 11:59:59 next Friday',
            {
                movieId: null,
                dateTimeObj: { start: "08-21-20 00:00:00", end: "08-21-20 23:59:59", sessionStartedAt: "08-14-20 15:00:00" },
                cinemaArr: [],
            },
            { dateTime: { $gte: new Date("05-29-20 00:00:00"), $lte: new Date("05-29-20 11:59:59") } }
        ],
        [
            'when ask about next Friday (on Friday 9pm) should form query from 00:00:00 till 17:59:59 next Friday',
            {
                movieId: null,
                dateTimeObj: { start: "08-21-20 00:00:00", end: "08-21-20 23:59:59", sessionStartedAt: "08-14-20 21:00:00" },
                cinemaArr: [],
            },
            { dateTime: { $gte: new Date("05-29-20 00:00:00"), $lte: new Date("05-29-20 17:59:59") } }
        ],
        [
            'when ask about this weekend (on Tuesday) should form query from Saturday 00:00:00 till end of week + start of week till Sunday 23:59:59',
            {
                movieId: null,
                dateTimeObj: { start: "08-15-20 00:00:00", end: "08-16-20 23:59:59", sessionStartedAt: "08-11-20 03:41:26" },
                cinemaArr: [],
            },
            {
                $or: [
                    { dateTime: { $gte: new Date("05-30-20 00:00:00"), $lte: new Date(endOfWeek) } },
                    { dateTime: { $gte: new Date(startOfWeek), $lte: new Date("05-24-20 23:59:59") } }
                ]
            }
        ],
        [
            'when ask from this Friday till next Tuesday (on Friday) should form query from sessionStartTime (hour) till end of week + start of week till next Thursday 23:59:59',
            {
                movieId: null,
                dateTimeObj: { start: "08-14-20 00:00:00", end: "08-18-20 23:59:59", sessionStartedAt: "08-14-20 03:41:26" },
                cinemaArr: [],
            },
            {
                $or: [
                    { dateTime: { $gte: new Date("05-29-20 03:00:00"), $lte: new Date(endOfWeek) } },
                    { dateTime: { $gte: new Date(startOfWeek), $lte: new Date("05-26-20 23:59:59") } }
                ]
            }
        ],
        [
            'when ask about this Friday till next Friday (on Friday 3am) should form query from sessionStartTime (hour) till end of week + start of week till next Thursday 23:59:59',
            {
                movieId: null,
                dateTimeObj: { start: "08-14-20 00:00:00", end: "08-21-20 23:59:59", sessionStartedAt: "08-14-20 03:41:26" },
                cinemaArr: [],
            },
            {
                $or: [
                    { dateTime: { $gte: new Date("05-29-20 03:00:00"), $lte: new Date(endOfWeek) } },
                    { dateTime: { $gte: new Date(startOfWeek), $lte: new Date("05-28-20 23:59:59") } }
                ]
            }
        ],
        [
            'when ask about this Friday till next Friday (on Friday 9am) should form query from sessionStartTime (hour) till end of week + start of week till next Friday 05:59:59',
            {
                movieId: null,
                dateTimeObj: { start: "08-14-20 00:00:00", end: "08-21-20 23:59:59", sessionStartedAt: "08-14-20 09:41:26" },
                cinemaArr: [],
            },
            {
                $or: [
                    { dateTime: { $gte: new Date("05-29-20 09:00:00"), $lte: new Date(endOfWeek) } },
                    { dateTime: { $gte: new Date(startOfWeek), $lte: new Date("05-29-20 05:59:59") } }
                ]
            }
        ],
        [
            'when ask about this Friday till next Friday (on Friday 3pm) should form query from sessionStartTime (hour) till end of week + start of week till next Friday 11:59:59',
            {
                movieId: null,
                dateTimeObj: { start: "08-14-20 00:00:00", end: "08-21-20 23:59:59", sessionStartedAt: "08-14-20 15:41:26" },
                cinemaArr: [],
            },
            {
                $or: [
                    { dateTime: { $gte: new Date("05-29-20 15:00:00"), $lte: new Date(endOfWeek) } },
                    { dateTime: { $gte: new Date(startOfWeek), $lte: new Date("05-29-20 11:59:59") } }
                ]
            }
        ],
        [
            'when ask about this Friday till next Friday (on Friday 9pm) should form query from sessionStartTime (hour) till end of week + start of week till next Friday 17:59:59',
            {
                movieId: null,
                dateTimeObj: { start: "08-14-20 00:00:00", end: "08-21-20 23:59:59", sessionStartedAt: "08-14-20 21:41:26" },
                cinemaArr: [],
            },
            {
                $or: [
                    { dateTime: { $gte: new Date("05-29-20 21:00:00"), $lte: new Date(endOfWeek) } },
                    { dateTime: { $gte: new Date(startOfWeek), $lte: new Date("05-29-20 17:59:59") } }
                ]
            }
        ],
        [
            'when ask about this Tuesday till this Friday (on Tuesday) should form query from sessionStartTime (hour) till this Friday 23:59:59',
            {
                movieId: null,
                dateTimeObj: { start: "08-11-20 00:00:00", end: "08-14-20 23:59:59", sessionStartedAt: "08-11-20 15:11:00" },
                cinemaArr: [],
            },
            { dateTime: { $gte: new Date("05-26-20 15:00:00"), $lte: new Date("05-29-20 23:59:59") } }
        ],
    ]

}

