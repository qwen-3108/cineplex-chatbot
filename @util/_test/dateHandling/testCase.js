// Sund Mond Tues Wedn Thur Frid Satu
// 0524 0525 0526 0527 0528 0529 0530
// 0809 0810 0811 0812 0813 0814 0815
// 0816 0817 0818 0819 0820 0821 0822

module.exports = {
    decideMaxDate: [
        //description, startedAt, expectedDate, expectedPhrase
        ['Enquiry made on 12am --> maxDate is up to next same day of week - 1 23:59pm',
            new Date("2020-08-11T00:00:00+08:00"),
            new Date("2020-08-17T23:59:59+08:00"), "Monday (17/8) night"],
        ['Enquiry made between 12am - 6am --> is up to next same day of week - 1 23:59pm',
            new Date("2020-08-11T03:00:00+08:00"),
            new Date("2020-08-17T23:59:59+08:00"), "Monday (17/8) night"],
        ['Enquiry made on 6am --> maxDate is up to next same day of week 5:59am',
            new Date("2020-08-11T06:00:00+08:00"),
            new Date("2020-08-18T05:59:59+08:00"), "Monday (17/8, inclusive of time to 6am next day)"],
        ['Enquiry made between 6am - 12pm --> maxDate is up to next same day of week 5:59am',
            new Date("2020-08-11T09:00:00+08:00"),
            new Date("2020-08-18T05:59:59+08:00"), "Monday (17/8, inclusive of time to 6am next day)"],
        ['Enquiry made on 12pm --> maxDate is up to next same day of week 11:59am ',
            new Date("2020-08-11T12:00:00+08:00"),
            new Date("2020-08-18T11:59:59+08:00"), "next Tuesday (18/8) noon"],
        ['Enquiry made between 12pm - 6pm --> maxDate is up to next same day of week 11:59am',
            new Date("2020-08-11T15:00:00+08:00"),
            new Date("2020-08-18T11:59:59+08:00"), "next Tuesday (18/8) noon"],
        ['Enquiry made on 6pm --> maxDate is up to next same day of week 5:59pm',
            new Date("2020-08-11T18:00:00+08:00"),
            new Date("2020-08-18T17:59:59+08:00"), "next Tuesday (18/8) afternoon"],
        ['Enquiry made between 6pm - 12am --> maxDate is up to next same day of week 5:59pm',
            new Date("2020-08-11T21:00:00+08:00"),
            new Date("2020-08-18T17:59:59+08:00"), "next Tuesday (18/8) afternoon"],

    ],

    mapDateTime: [
        ['day > nextWeekAreDaysLessThan --> should NOT add extra 7 days',
            new Date("2020-08-12T12:00:00+08:00"),
            new Date("2020-05-29T16:00:00+08:00"),
            new Date("2020-08-14T16:00:00+08:00")],
        ['day = nextWeekAreDaysLessThan but time later than sessionStartedAt --> should NOT add extra 7 days',
            new Date("2020-08-12T06:00:00+08:00"),
            new Date("2020-05-27T13:00:00+08:00"),
            new Date("2020-08-12T13:00:00+08:00")],
        //day = nextWeekAreDaysLessThan | time disgustingly equal --> IMPOSSIBLE, cuz not in query range
        ['day = nextWeekAreDaysLessThan but time earlier than sessionStartedAt --> should add extra 7 days',
            new Date("2020-08-12T18:00:00+08:00"),
            new Date("2020-05-27T13:00:00+08:00"),
            new Date("2020-08-19T13:00:00+08:00")],
        ['day < nextWeekAreDaysLessThan --> should add extra 7 days',
            new Date("2020-08-12T12:00:00+08:00"),
            new Date("2020-05-25T10:00:00+08:00"),
            new Date("2020-08-17T10:00:00+08:00")]
    ]

};