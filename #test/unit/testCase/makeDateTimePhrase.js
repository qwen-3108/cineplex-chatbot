const sessionStartedOnMon = new Date('2020-08-10T09:00:00+08:00');
const sessionStartedOnSun = new Date('2020-08-09T09:00:00+08:00');

const includeTimeTestCase = [
    [[{ start: new Date('2020-08-16T14:00:00+08:00'), end: new Date('2020-08-16T14:00:00+08:00'), sessionStartedAt: sessionStartedOnMon }, { includeTimePhrase: false }], "on Sunday (16/8)"],
    [[{ start: new Date('2020-08-16T14:00:00+08:00'), end: new Date('2020-08-16T14:00:00+08:00'), sessionStartedAt: sessionStartedOnMon }], "on Sunday (16/8) at 2 p.m."],
    [[new Date('2020-08-16T14:00:00+08:00'), { sessionStartedAt: sessionStartedOnMon, includeTimePhrase: false }], "on Sunday (16/8)"],
    [[new Date('2020-08-16T14:00:00+08:00'), { sessionStartedAt: sessionStartedOnMon }], "on Sunday (16/8) at 2 p.m."],
]

const expressTimeTestCase = [
    [[{ start: new Date('2020-08-10T12:00:00+08:00'), end: new Date('2020-08-10T23:59:00+08:00'), sessionStartedAt: sessionStartedOnMon }],
        "today from noon to midnight"],
    [[{ start: new Date('2020-08-11T12:00:00+08:00'), end: new Date('2020-08-11T16:00:00+08:00'), sessionStartedAt: sessionStartedOnMon }],
        "tomorrow from noon to 4 p.m."],
    [[{ start: new Date('2020-08-12T20:00:00+08:00'), end: new Date('2020-08-12T23:59:00+08:00'), sessionStartedAt: sessionStartedOnMon }],
        "on Wednesday (12/8) from 8 p.m. to midnight"],
    [[{ start: new Date('2020-08-13T11:00:00+08:00'), end: new Date('2020-08-13T15:00:00+08:00'), sessionStartedAt: sessionStartedOnMon }],
        "on Thursday (13/8) from 11 a.m. to 3 p.m."],
    [[{ start: new Date('2020-08-14T05:00:00+08:00'), end: new Date('2020-08-14T11:59:00+08:00'), sessionStartedAt: sessionStartedOnMon }],
        "on Friday (14/8) morning"],
    [[{ start: new Date('2020-08-14T12:00:00+08:00'), end: new Date('2020-08-14T17:59:00+08:00'), sessionStartedAt: sessionStartedOnMon }],
        "on Friday (14/8) afternoon"],
    [[{ start: new Date('2020-08-14T17:00:00+08:00'), end: new Date('2020-08-14T23:59:00+08:00'), sessionStartedAt: sessionStartedOnMon }],
        "on Friday (14/8) evening"],
    [[{ start: new Date('2020-08-14T19:00:00+08:00'), end: new Date('2020-08-15T05:59:00+08:00'), sessionStartedAt: sessionStartedOnMon }],
        "on Friday (14/8) night"],
    [[{ start: new Date('2020-08-14T17:00:00+08:00'), end: new Date('2020-08-14T23:00:00+08:00'), sessionStartedAt: sessionStartedOnMon }],
        "on Friday (14/8) from 5 p.m. to 11 p.m."],
    [[{ start: new Date('2020-08-15T16:00:00+08:00'), end: new Date('2020-08-15T16:00:00+08:00'), sessionStartedAt: sessionStartedOnMon }],
        "on Saturday (15/8) at 4 p.m."],
    [[new Date('2020-08-15T16:00:00+08:00'), { sessionStartedAt: sessionStartedOnMon }], "on Saturday (15/8) at 4 p.m."],
    [[new Date('2020-08-15T00:00:00+08:00'), { sessionStartedAt: sessionStartedOnMon }], "on Saturday (15/8) at midnight"],
    [[new Date('2020-08-15T12:00:00+08:00'), { sessionStartedAt: sessionStartedOnMon }], "on Saturday (15/8) at noon"],
];

const expressDateTestCase = [
    [[{ start: new Date('2020-08-16T00:00:00+08:00'), end: new Date('2020-08-16T23:59:00+08:00'), sessionStartedAt: sessionStartedOnMon }], "on Sunday (16/8)"],
    [[{ start: new Date('2020-08-18T00:00:00+08:00'), end: new Date('2020-08-18T23:59:00+08:00'), sessionStartedAt: sessionStartedOnMon }], "on next Tuesday (18/8)"],
    [[{ start: new Date('2020-08-22T00:00:00+08:00'), end: new Date('2020-08-22T23:59:00+08:00'), sessionStartedAt: sessionStartedOnMon }], "on next Saturday (22/8)"],
    [[{ start: new Date('2020-08-23T00:00:00+08:00'), end: new Date('2020-08-23T23:59:00+08:00'), sessionStartedAt: sessionStartedOnMon }], "on August 23 (Sun)"],
    [[{ start: new Date('2020-08-10T11:00:00+08:00'), end: new Date('2020-08-14T23:59:00+08:00'), sessionStartedAt: sessionStartedOnMon }], "from today to Friday (14/8)"],
    [[{ start: new Date('2020-08-14T00:00:00+08:00'), end: new Date('2020-08-16T23:59:00+08:00'), sessionStartedAt: sessionStartedOnMon }], "from Friday (14/8) to Sunday (16/8)"],
    [[{ start: new Date('2020-08-15T00:00:00+08:00'), end: new Date('2020-08-20T23:59:00+08:00'), sessionStartedAt: sessionStartedOnMon }], "from Saturday (15/8) to next Thursday (20/8)"],
    [[{ start: new Date('2020-08-18T00:00:00+08:00'), end: new Date('2020-08-20T23:59:00+08:00'), sessionStartedAt: sessionStartedOnMon }], "from next Tuesday (18/8) to Thursday (20/8)"],
    [[{ start: new Date('2020-08-20T00:00:00+08:00'), end: new Date('2020-08-25T23:59:00+08:00'), sessionStartedAt: sessionStartedOnMon }], "from next Thursday (20/8) to August 25 (Tue)"],
    [[{ start: new Date('2020-08-25T00:00:00+08:00'), end: new Date('2020-08-28T23:59:00+08:00'), sessionStartedAt: sessionStartedOnMon }], "from August 25 to 28 (Tue-Fri)"],
    [[{ start: new Date('2020-08-15T00:00:00+08:00'), end: new Date('2020-08-16T23:59:00+08:00'), sessionStartedAt: sessionStartedOnMon }], "this weekend (15-16 Aug)"],
    [[{ start: new Date('2020-08-22T00:00:00+08:00'), end: new Date('2020-08-23T23:59:00+08:00'), sessionStartedAt: sessionStartedOnMon }], "next weekend (22-23 Aug)"],
    [[{ start: new Date('2020-08-29T00:00:00+08:00'), end: new Date('2020-08-30T23:59:00+08:00'), sessionStartedAt: sessionStartedOnMon }], "on August 29 and 30 (Sat-Sun)"],
    [[{ start: new Date('2020-08-12T00:00:00+08:00'), end: new Date('2020-08-13T23:59:00+08:00'), sessionStartedAt: sessionStartedOnMon }], "on Wednesday (12/8) and Thursday (13/8)"],
    [[{ start: new Date('2020-08-19T00:00:00+08:00'), end: new Date('2020-08-20T23:59:00+08:00'), sessionStartedAt: sessionStartedOnMon }], "on next Wednesday (19/8) and Thursday (20/8)"],
    [[{ start: new Date('2020-08-26T00:00:00+08:00'), end: new Date('2020-08-27T23:59:00+08:00'), sessionStartedAt: sessionStartedOnMon }], "on August 26 and 27 (Wed-Thu)"],
    //sessionStartedAt is sunday
    [[{ start: new Date('2020-08-16T00:00:00+08:00'), end: new Date('2020-08-16T23:59:00+08:00'), sessionStartedAt: sessionStartedOnSun }], "on next Sunday (16/8)"],
    [[{ start: new Date('2020-08-12T00:00:00+08:00'), end: new Date('2020-08-12T23:59:00+08:00'), sessionStartedAt: sessionStartedOnSun }], "on Wednesday (12/8)"],
    [[{ start: new Date('2020-08-19T00:00:00+08:00'), end: new Date('2020-08-19T23:59:00+08:00'), sessionStartedAt: sessionStartedOnSun }], "on next Wednesday (19/8)"],

];

const combineDateTimeTestCase = [
    [[{ start: new Date('2020-08-10T05:00:00+08:00'), end: new Date('2020-08-10T11:59:00+08:00'), sessionStartedAt: sessionStartedOnMon }], "this morning"],
    [[new Date('2020-08-10T12:00:00+08:00'), { sessionStartedAt: sessionStartedOnMon }], "today at noon"],
    [[{ start: new Date('2020-08-10T12:00:00+08:00'), end: new Date('2020-08-10T17:59:00+08:00'), sessionStartedAt: sessionStartedOnMon }], "this afternoon"],
    [[{ start: new Date('2020-08-10T17:00:00+08:00'), end: new Date('2020-08-10T23:59:00+08:00'), sessionStartedAt: sessionStartedOnMon }], "this evening"],
    [[{ start: new Date('2020-08-10T19:00:00+08:00'), end: new Date('2020-08-11T05:59:00+08:00'), sessionStartedAt: sessionStartedOnMon }], "tonight"],
    [[{ start: new Date('2020-08-23T05:00:00+08:00'), end: new Date('2020-08-23T11:59:00+08:00'), sessionStartedAt: sessionStartedOnMon }], "on the morning of August 23 (Sun)"],
    [[{ start: new Date('2020-08-23T12:00:00+08:00'), end: new Date('2020-08-23T17:59:00+08:00'), sessionStartedAt: sessionStartedOnMon }], "on the afternoon of August 23 (Sun)"],
    [[{ start: new Date('2020-08-23T17:00:00+08:00'), end: new Date('2020-08-23T23:59:00+08:00'), sessionStartedAt: sessionStartedOnMon }], "on the evening of August 23 (Sun)"],
    [[{ start: new Date('2020-08-23T19:00:00+08:00'), end: new Date('2020-08-24T05:59:00+08:00'), sessionStartedAt: sessionStartedOnMon }], "on the night of August 23 (Sun)"],
    [[{ start: new Date('2020-08-23T07:00:00+08:00'), end: new Date('2020-08-23T07:00:00+08:00'), sessionStartedAt: sessionStartedOnMon }], "on August 23 (Sun) at 7 a.m."],
    [[{ start: new Date('2020-08-23T14:00:00+08:00'), end: new Date('2020-08-23T16:00:00+08:00'), sessionStartedAt: sessionStartedOnMon }], "on August 23 (Sun) from 2 p.m. to 4 p.m."],

];

module.exports = { includeTimeTestCase, expressTimeTestCase, expressDateTestCase, combineDateTimeTestCase };