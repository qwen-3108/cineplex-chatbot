const { COLLECTIONS } = require('../../../../../@global/COLLECTIONS');
const { MAIN_STATUS, SEC_STATUS } = require('../../../../../@global/CONSTANTS');
const LOGS = require('../../../../../@global/LOGS');
const assignDateTime = require('../../../../../@util/assignDateTime');
const reply = require('../../../../../_telegram/reply');
const decideMaxDate = require('../../../../../@util/decideMaxDate');

module.exports = async function validateAndMutateInfo({ extractedInfo, sessionToMutate }) {

    const chatId = sessionToMutate.chatId;
    LOGS.logInfo(chatId, '-----Validating input-----');
    LOGS.logInfo(chatId, `BookingInfo before assignment: ${JSON.stringify(sessionToMutate.bookingInfo)}`);

    let output = { ok: true };
    let dateExceeds = null;

    for (const param in extractedInfo) {
        if (extractedInfo[param] !== "") {
            switch (param) {
                case 'movie':
                    LOGS.logInfo(chatId, 'Retrieving movie information...');
                    const movie = await COLLECTIONS.movies.findOne({ title: extractedInfo.movie }, { title: 1, debutDateTime: 1, isBlockBuster: 1 });
                    if (movie === null) throw `${__filename} | movie ${extractedInfo.movie} not found in db`;
                    if (movie.debutDateTime > new Date('2020-05-17T23:59')) {
                        LOGS.logInfo(chatId, 'Update: Movie is upcoming movie, notifying users...');
<<<<<<< Updated upstream
                        await reply.upcomingMovie(chatId, movie);
=======
                        await upcomingMovie(chatId, movie);
>>>>>>> Stashed changes
                        sessionToMutate.status = { main: null, secondary: null };
                        output.ok = false;
                        //? not sure if it's ok to just return here without complete assignment of other parameters
                        return output;
                    } else {
                        LOGS.logInfo(chatId, 'Update: Movie is currently screening, assigning id to bookingInfo');
                        sessionToMutate.bookingInfo.movie = {
                            title: extractedInfo.movie,
                            id: movie._id,
                            debutDateTime: new Date(movie.debutDateTime),
                            isBlockBuster: movie.isBlockBuster
                        };
                    }
                    break;
                case 'date-time':
                    LOGS.logInfo(chatId, 'Update: Validating date-time...');
                    const maxDate = decideMaxDate(sessionToMutate.sessionInfo.startedAt);
                    const dateTime = assignDateTime(extractedInfo[param]);
                    LOGS.logInfo(chatId, `Update: Parsed dateTime: ${JSON.stringify(dateTime)}`);
                    if (dateTime.start > maxDate) {
                        LOGS.logInfo(chatId, 'Update: dateTime totally exceed schedule');
                        dateExceeds = { isTotal: true, maxDate };
                    } else if (dateTime.end > maxDate) {
                        LOGS.logInfo(chatId, 'Update: dateTime partially exceed schedule');
                        dateExceeds = { isTotal: false, maxDate };
                        sessionToMutate.confirmPayload.adjustedDateTime = { start: dateTime.start, end: maxDate };
                    } else {
                        LOGS.logInfo(chatId, 'Update: dateTime within viable range, assigning to bookingInfo, clearing confirmPayload if any');
                        sessionToMutate.bookingInfo.dateTime.start = dateTime.start;
                        sessionToMutate.bookingInfo.dateTime.end = dateTime.end;
                        sessionToMutate.confirmPayload.adjustedDateTime = {}; //user provide values themselves at adjusted date time
                    }
                    break;
                case 'place':
                    sessionToMutate.bookingInfo.place = extractedInfo.place;
                    const placeCursor = await COLLECTIONS.places.find({ name: extractedInfo.place });
                    const place = await placeCursor.toArray();
                    if (place.length === 0) throw 'Custom error: No such place in database';
                    if (place.length > 1) throw 'More than one place matched in database';
                    let distance = 0;
                    let nearbyCinemas = [];
                    while (nearbyCinemas.length === 0) {
                        distance += 5000;
                        const cinemaCursor = await COLLECTIONS.cinemas.find(
                            {
                                location: {
                                    $near: {
                                        $geometry: {
                                            type: place[0].geometry.type,
                                            coordinates: place[0].geometry.coordinates.map(str => Number(str))
                                        },
                                        $maxDistance: distance
                                    }
                                }
                            }, { cinema: 1 });
                        nearbyCinemas = await cinemaCursor.toArray();
                    }
                    sessionToMutate.bookingInfo.cinema = nearbyCinemas.map(cinemaObj => cinemaObj.cinema);
                    break;
                case 'cinema':
                    sessionToMutate.bookingInfo.place = null;
                    sessionToMutate.bookingInfo.cinema = [extractedInfo.cinema];
                    break;
                case 'experience':
                    sessionToMutate.bookingInfo.experience = extractedInfo.experience;
                    break;
                case 'customer-type':
                    break;
                default:
                    break;
            }
        }
    }
    LOGS.logInfo(chatId, `BookingInfo after assignment: ${JSON.stringify(sessionToMutate.bookingInfo)}`);

    //handle failed validation (currently only date-time)
    if (dateExceeds) {
        output.ok = false;
        sessionToMutate.status = dateExceeds.isTotal
            ? { main: MAIN_STATUS.PROMPT_DATETIME, secondary: SEC_STATUS.EXCEED_SCHEDULE_TOTAL }
            : { main: MAIN_STATUS.PROMPT_DATETIME, secondary: SEC_STATUS.EXCEED_SCHEDULE_PARTIAL };
        await reply.invalidDateTime(chatId, dateExceeds.isTotal, dateExceeds.maxDate);
    }

    //return whether validation ok
    LOGS.logInfo(chatId, `output from validateAndMutateInfo.js: ${JSON.stringify(output)}`);
    return output;
};