const { addDays } = require('date-fns');
const { COLLECTIONS } = require('../../@global/COLLECTIONS');
const { MAIN_STATUS, SEC_STATUS } = require('../../@global/CONSTANTS');
const assignDateTime = require('../../@util/assignDateTime');
const { upcomingMovie, invalidDateTime } = require('../../_telegram/reply');

module.exports = async function validateAndMutateInfo({ extractedInfo, sessionToMutate }) {

    console.log('-----Validating input-----');
    console.log('BookingInfo before assignment: ', JSON.stringify(sessionToMutate.bookingInfo));

    let output = { ok: true };
    let dateExceeds = false;

    for (const param in extractedInfo) {
        if (extractedInfo[param] !== "") {
            switch (param) {
                case 'movie':
                    console.log('Retrieving movie information...');
                    const movie = await COLLECTIONS.movies.findOne({ title: extractedInfo.movie }, { title: 1, debutDateTime: 1, isBlockBuster: 1 });
                    if (movie === null) throw `${__filename} | movie ${extractedInfo.movie} not found in db`;
                    if (movie.debutDateTime > new Date('2020-05-17T23:59')) {
                        console.log('Update: Movie is upcoming movie, notifying users...');
                        await upcomingMovie(sessionToMutate.chatId, movie);
                        sessionToMutate.status = { main: null, secondary: null };
                        output.ok = false;
                        //? not sure if it's ok to just return here without complete assignment of other parameters
                        return output;
                    } else {
                        console.log('Update: Movie is currently screening, assigning id to bookingInfo');
                        sessionToMutate.bookingInfo.movie = {
                            title: extractedInfo.movie,
                            id: movie._id,
                            debutDateTime: new Date(movie.debutDateTime),
                            isBlockBuster: movie.isBlockBuster
                        };
                    }
                    break;
                case 'date-time':
                    console.log('Update: Validating date-time...');
                    const maxDate = addDays(sessionToMutate.sessionInfo.startedAt, 6);
                    const dateTime = assignDateTime(extractedInfo[param]);
                    maxDate.setHours(23, 59, 59);
                    console.log(`Update: Parsed dateTime: ${JSON.stringify(dateTime)}`);
                    if (dateTime.start > maxDate) {
                        console.log('Update: dateTime totally exceed schedule');
                        dateExceeds = true;
                        sessionToMutate.confirmPayload.adjustedDateTime = {
                            start: sessionToMutate.sessionInfo.startedAt,
                            end: maxDate
                        };
                    } else if (dateTime.end > maxDate) {
                        console.log('Update: dateTime partially exceed schedule');
                        dateExceeds = true;
                        sessionToMutate.confirmPayload.adjustedDateTime = { start: dateTime.start, end: maxDate };
                    } else {
                        console.log('Update: dateTime within viable range, assigning to bookingInfo, clearing confirmPayload if any');
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
                default:
                    break;

            }
        }
    }
    console.log(`BookingInfo after assignment: ${JSON.stringify(sessionToMutate.bookingInfo)}`);

    if (dateExceeds) {
        sessionToMutate.status = { main: MAIN_STATUS.PROMPT_DATETIME, secondary: SEC_STATUS.EXCEED_SCHEDULE };
        await invalidDateTime(sessionToMutate.chatId, sessionToMutate.confirmPayload.adjustedDateTime);
        output.ok = false;
    }

    //return whether validation ok
    return output;
};