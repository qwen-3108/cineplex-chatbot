const noMovie = [
    [[{
        movie: { "title": null, "id": null, "debutDateTime": null, "isBlockBuster": null },
        dateTime: {
            start: null,
            end: null,
            sessionStartedAt: null
        },
        cinema: [],
        place: null,
        experience: undefined
    }], ""]
];

const ignoreExperience = [
    [[{
        movie: { "title": "TENET", "id": "5ec6603c29431975db467384", "debutDateTime": new Date("2020-05-16T16:00:00.000Z"), "isBlockBuster": true },
        dateTime: {
            start: null,
            end: null,
            sessionStartedAt: null
        },
        cinema: [],
        place: null,
        experience: "Platinum Movie Suites"
    }, { ignoreExperience: true }], "for TENET"]
];

const makeDetailsStr = [
    ['only movie',
        [{
            movie: { "title": "TENET", "id": "5ec6603c29431975db467384", "debutDateTime": new Date("2020-05-16T16:00:00.000Z"), "isBlockBuster": true },
            dateTime: {
                start: null,
                end: null,
                sessionStartedAt: null
            },
            cinema: [],
            place: null,
            experience: undefined
        }], "for TENET"],
    ['only movie and time',
        [{
            movie: { "title": "Disney / Pixar's Soul", "id": "5ec6603c29431975db467385", "debutDateTime": new Date("2020-05-16T16:00:00.000Z"), "isBlockBuster": true },
            dateTime: {
                start: new Date('2020-08-21T17:00:00+08:00'),
                end: new Date('2020-08-21T23:59:59+08:00'),
                sessionStartedAt: new Date('2020-08-16T20:00:00+08:00')
            },
            cinema: [],
            place: null,
            experience: undefined
        }], "for Disney / Pixar's Soul on Friday (21/8) evening"],
    ['only movie and cinema',
        [{
            movie: { "title": "Top Gun Maverick", "id": "5ec6603c29431975db467388", "debutDateTime": "2020-05-16T16:00:00.000Z", "isBlockBuster": false },
            dateTime: {
                start: null,
                end: null,
                sessionStartedAt: null
            },
            cinema: ["Cathay Cineplex Cineleisure"],
            place: null,
            experience: undefined
        }], "for Top Gun Maverick at Cathay Cineplex Cineleisure"],
    ['only movie and place',
        [{
            movie: { "title": "The Clock: Spirits Awakening", "id": "5ec6603c29431975db46737f", "debutDateTime": "2020-05-16T16:00:00.000Z", "isBlockBuster": false },
            dateTime: {
                start: null,
                end: null,
                sessionStartedAt: null
            },
            cinema: ["Cathay Cineplex Downtown East"],
            place: "Pasir Ris",
            experience: undefined
        }], "for The Clock: Spirits Awakening near Pasir Ris"],
    ['only movie and experience',
        [{
            movie: { "title": "Signal 100", "id": "5ec6603c29431975db467381", "debutDateTime": "2020-05-16T16:00:00.000Z", "isBlockBuster": false },
            dateTime: {
                start: null,
                end: null,
                sessionStartedAt: null
            },
            cinema: [],
            place: null,
            experience: "Platinum Movie Suites"
        }], "for Signal 100 in Platinum Movie Suites"],
    ['movie, time, and place',
        [{
            movie: { "title": "Low Season", "id": "5ec6603c29431975db467380", "debutDateTime": "2020-05-16T16:00:00.000Z", "isBlockBuster": false },
            dateTime: {
                start: new Date('2020-08-23T00:00:00+08:00'),
                end: new Date('2020-08-23T23:59:59+08:00'),
                sessionStartedAt: new Date('2020-08-16T20:00:00+08:00')
            },
            cinema: ["Cathay Cineplex AMK Hub", "Cathay Cineplex Downtown East"],
            place: "Sengkang",
            experience: undefined
        }], "for Low Season on next Sunday (23/8) near Sengkang"],
    ['movie, time, and cinema',
        [{
            movie: { "title": "Wonder Woman 1984", "id": "5ec6603c29431975db467386", "debutDateTime": "2020-05-16T16:00:00.000Z", "isBlockBuster": false },
            dateTime: {
                start: new Date('2020-08-22T00:00:00+08:00'),
                end: new Date('2020-08-23T23:59:59+08:00'),
                sessionStartedAt: new Date('2020-08-17T09:00:00+08:00')
            },
            cinema: ["The Cathay Cineplex"],
            place: null,
            experience: undefined
        }], "for Wonder Woman 1984 at The Cathay Cineplex this weekend (22-23 Aug)"],
    ['movie, time, and experience',
        [{
            movie: { "title": "The Secret Garden", "id": "5ec6603c29431975db467387", "debutDateTime": "2020-05-16T16:00:00.000Z", "isBlockBuster": false },
            dateTime: {
                start: new Date('2020-08-22T01:00:00+08:00'),
                end: new Date('2020-08-22T01:00:00+08:00'),
                sessionStartedAt: new Date('2020-08-17T09:00:00+08:00')
            },
            cinema: [],
            place: null,
            experience: "Platinum Movie Suites"
        }], "for The Secret Garden in Platinum Movie Suites on Saturday (22/8) at 1 a.m."],
    ['movie, experience, and place',
        [{
            movie: { "title": "Candyman", "id": "5ec6603c29431975db46738c", "debutDateTime": "2020-05-16T16:00:00.000Z", "isBlockBuster": false },
            dateTime: {
                start: null,
                end: null,
                sessionStartedAt: null
            },
            cinema: ["Cathay Cineplex JEM", "Cathay Cineplex West Mall"],
            place: "Clementi",
            experience: "Platinum Movie Suites"
        }], "for Candyman in Platinum Movie Suites near Clementi"],
    ['movie, experience, and cinema',
        [{
            movie: { "title": "Impetigore", "id": "5ec6603c29431975db46737e", "debutDateTime": "2020-05-16T16:00:00.000Z", "isBlockBuster": false },
            dateTime: {
                start: null,
                end: null,
                sessionStartedAt: null
            },
            cinema: ["Cathay Cineplex JEM"],
            place: null,
            experience: "Platinum Movie Suites"
        }], "for Impetigore at Cathay Cineplex JEM in Platinum Movie Suites"],
    ['movie, time, experience, and place',
        [{
            movie: { "title": "Disney's Jungle Cruise", "id": "5ec6603c29431975db467383", "debutDateTime": "2020-05-16T16:00:00.000Z", "isBlockBuster": true },
            dateTime: {
                start: new Date('2020-08-17T19:00:00+08:00'),
                end: new Date('2020-08-18T05:59:59+08:00'),
                sessionStartedAt: new Date('2020-08-17T09:00:00+08:00')
            },
            cinema: ["Cathay Cineplex Cineleisure", "The Cathay CinePlex"],
            place: "Orchard",
            experience: "Platinum Movie Suites"
        }], "for Disney's Jungle Cruise in Platinum Movie Suites tonight near Orchard"],
    ['movie, time, experience, and cinema',
        [{
            movie: { "title": "A Quiet Place Part II", "id": "5ec6603c29431975db46738a", "debutDateTime": "2020-05-16T16:00:00.000Z", "isBlockBuster": false },
            dateTime: {
                start: new Date('2020-08-19T19:00:00+08:00'),
                end: new Date('2020-08-20T05:59:59+08:00'),
                sessionStartedAt: new Date('2020-08-17T09:00:00+08:00')
            },
            cinema: ["Cathay Cineplex Causeway Point"],
            place: null,
            experience: "Platinum Movie Suites"
        }], "for A Quiet Place Part II at Cathay Cineplex Causeway Point in Platinum Movie Suites on Wednesday (19/8) night"],
];

module.exports = { noMovie, ignoreExperience, makeDetailsStr };

/*

Here are the showtimes for TENET at Cathay JEM in Platinum Movie Suites this weekend

movie - cinema - experience - time - place

no movie
ignoreExperience flag

movie (must have movie) //tenet
movie + time  //soul this Friday evening
movie + cinema  //top gun maverick at Cathay Cineplex Cineleisure
movie + place //the clock near Pasir Ris
movie + experience //signal 100 in Platinum Movie Suites
movie + time + place //low season next Sunday near Sengkang
movie + time + cinema //wonder woman at The Cathay Cineplex this weekend
movie + time + experience //secret garden in Platinum Movie Suites on Saturday 1 a.m.
movie + place + experience //candyman in Platinum Movie Suites near Clementi
movie + cinema + experience //impetigore at Cathay Cineplex JEM in Platinum Movie Suites
movie + time + place + experience //jungle cruise in Platinum Movie Suites tonight near Orchard
movie + time + cinema + experience //a quiet place at Cathay Cineplex Causeway Point in Platinum Movie Suites on Wednesday night

{
    movie: {
        title: null,
        id: null,
        debutDateTime: null,
        isBlockBuster: null
    },
    dateTime:{
        start: null
        end: null
        sessionStartedAt: null
    },
    cinema: [],
    place: null,
    experience: undefined
}



*/



