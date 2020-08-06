const { ObjectId } = require('mongodb');
const { typing, toMovieCallback, editSeatPlanButton, deleteRepeatSeatPlan, sendSeatLegend, sendSeatPlan, getSeats } = require('../../_telegram/reply');
const { MAIN_STATUS } = require('../../@global/CONSTANTS');
const { COLLECTIONS } = require('../../@global/COLLECTIONS');
const populateBookingInfo = require('../../@util/populateBookingInfo');
const assignAndValidateSeats = require('../logic/assignAndValidateSeats');
const mutateSeatNumbers = require('../logic/mutateSeatNumbers');

module.exports = async function onCallback({ data, inline_message_id, sessionToMutate }) {

    const extractRegex = /(?<type>(?:movieTitle|movieId|sId|uSId))\s=(?<value>.+)=/;
    const extractResult = data.match(extractRegex);

    if (extractResult === null) {
        throw `${__filename} | Unrecognized callback_data ${data}`;
    }


    const { type, value } = extractResult.groups;

    switch (type) {
        case 'movieId':
            {
                const [movieId, action] = value.split(' ');
                if (action === 'show') {
                    const movie = await COLLECTIONS.movies.findOne({ _id: movieId }, { title: 1, director: 1, cast: 1, synopsis: 1, runtime: 1 });
                    await toMovieCallback.showMovieDetail(inline_message_id, movie);
                }
                if (action === 'hide') {
                    const movie = await COLLECTIONS.movies.findOne({ _id: movieId }, { title: 1, genre: 1, language: 1, rating: 1, trailer: 1 });
                    await toMovieCallback.hideMovieDetail(inline_message_id, movie);
                }
                if (action === 'showtime') {
                    const movie = await COLLECTIONS.movies.findOne({ _id: movieId });
                    const { _id, title, isBlockBuster, debutDateTime } = movie;
                    sessionToMutate.bookingInfo.movie = { id: _id, title, isBlockBuster, debutDateTime };
                    await toMovieCallback.howToFilter(inline_message_id, _id, title);
                }
                break;
            }
        case 'uSId':
            {
                typing(sessionToMutate.chatId);

                //#0: if button clicked is already 'Choosing for this plan'
                if (value === "NA") { break; }

                const [scheduleId, daysToDbDate, nextWeekAreDaysLessThan] = value.split(' ');
                sessionToMutate.bookingInfo.dateTime = { daysToDbDate: Number(daysToDbDate), nextWeekAreDaysLessThan: Number(nextWeekAreDaysLessThan) };

                //#1: populate booking info with details from showtime
                const showtime = await COLLECTIONS.showtimes.findOne({ _id: ObjectId(scheduleId) });
                // await populateBookingInfo({ showtime, sessionToMutate });

                const { ticketing } = sessionToMutate.bookingInfo;
                for (let i = 0; i < ticketing.length; i++) {
                    //#2a: if there is any previous true, set to false, edit seat plan button
                    const selection = ticketing[i];
                    if (selection.isSelected) {
                        selection.isSelected = false;
                        const { seatPlanCallback } = await editSeatPlanButton(sessionToMutate.chatId, selection, sessionToMutate.bookingInfo.dateTime);
                        sessionToMutate.bookingInfo.ticketing[i].seatPlanCallback = seatPlanCallback;
                    }
                    //#2b: found the selected entry, update isSelected, edit seat plan button
                    if (selection.scheduleId === scheduleId) {
                        selection.isSelected = true;
                        const { seatPlanCallback } = await editSeatPlanButton(sessionToMutate.chatId, selection, sessionToMutate.bookingInfo.dateTime);
                        sessionToMutate.bookingInfo.ticketing[i].seatPlanCallback = seatPlanCallback;
                    }
                }
                //#3a: if seat number exists in payload, use that directly
                console.log("payload: ", sessionToMutate.payload);
                if (sessionToMutate.payload.seatNumber !== null) {
                    console.log("payload contains seatNumber, using ", sessionToMutate.payload.seatNumber, " as seat-number");
                    const text = '';
                    const extractedInfo = {};
                    extractedInfo['seat-number'] = sessionToMutate.payload.seatNumber;
                    const expandedSeatNumObj = await assignAndValidateSeats({ text, extractedInfo, sessionToMutate: sessionToMutate });
                    if (expandedSeatNumObj === undefined) break;
                    await mutateSeatNumbers({ expandedSeatNumObj, sessionToMutate: sessionToMutate });
                    sessionToMutate.payload.seatNumber = null;
                    break;
                }

                //#3b: Repeat showtime and cue for seat numbers
                const { chatId, bookingInfo } = sessionToMutate;
                await getSeats(chatId, bookingInfo);
                break;
            }
        case 'sId':
            {
                console.log('-----View seat plan request received-----');
                typing(sessionToMutate.chatId);
                const [scheduleId, daysToDbDate, nextWeekAreDaysLessThan] = value.split(' ');
                sessionToMutate.bookingInfo.dateTime = { daysToDbDate: Number(daysToDbDate), nextWeekAreDaysLessThan: Number(nextWeekAreDaysLessThan) };

                //#1: if first seat plan sent - send description text
                if (sessionToMutate.bookingInfo.ticketing.length === 0) {
                    console.log('First seating plan sent in current session, sending legend');
                    await sendSeatLegend(sessionToMutate.chatId);
                }

                //#2: populate booking info with details from showtime
                const showtime = await COLLECTIONS.showtimes.findOne({ _id: ObjectId(scheduleId) });
                if (showtime === null) { throw `scheduleId in callback not found in db`; }
                console.log('Retrieved showtime');

                //#3: check if ticketing already has an element with same scheduleid
                let toDeleteMsgId;
                const { ticketing } = sessionToMutate.bookingInfo;
                const sameSeatingPlan = ticketing.filter(selection => selection.scheduleId === scheduleId);
                if (sameSeatingPlan.length !== 0) {
                    console.log('Same plan was viewed previously');
                    toDeleteMsgId = sameSeatingPlan[0].seatPlanMsgId;
                    console.log('To delete plan msg id: ', toDeleteMsgId);
                } else {
                    console.log('Is new seat plan viewed, adding showtime info to ticketing');
                    const { movieId, dateTime, cinema, hall, isPlatinum } = showtime;
                    const selection = {
                        isSelected: false,
                        scheduleId: showtime._id.toString(),
                        movie: {},
                        dateTime,
                        cinema,
                        hall,
                        isPlatinum,
                        seatPlanMsgId: null,
                        seatPlanFileId: null,
                        seatPlanCallback: []
                    };
                    if (movieId === sessionToMutate.bookingInfo.movie.id) {
                        selection.movie = sessionToMutate.bookingInfo.movie;
                    } else {
                        const movie = await COLLECTIONS.movies.findOne({ _id: movieId }, { title: 1, isBlockBuster: 1, debutDateTime: 1 });
                        if (movie === null) { throw `movie not found when creating ticketing entry`; }
                        const { _id, title, isBlockBuster, debutDateTime } = movie;
                        selection.movie = {
                            id: _id.toString(),
                            title, isBlockBuster, debutDateTime
                        };

                    }
                    console.log('Showtime info: ', JSON.stringify(selection));
                    sessionToMutate.bookingInfo.ticketing.push(selection);
                }

                const { chatId, bookingInfo } = sessionToMutate;
                //#4: if is the only plan sent - set isSelected to true
                if (bookingInfo.ticketing.length === 1) {
                    console.log('Set isSelected to true for only plan viewed');
                    sessionToMutate.bookingInfo.ticketing[0].isSelected = true;
                }
                //#5: if second seat plan sent - set isSelected of first to be false, add pick seat button to first seat plan
                if (bookingInfo.ticketing.length === 2) {
                    console.log('Second plan viewed, set first plan isSelected to false');
                    sessionToMutate.bookingInfo.ticketing[0].isSelected = false;
                    const { seatPlanCallback } = await editSeatPlanButton(chatId, bookingInfo.ticketing[0], bookingInfo.dateTime);
                    sessionToMutate.bookingInfo.ticketing[0].seatPlanCallback = seatPlanCallback;

                }

                // else {
                //     console.log('Not first nor second plan viewed, current ticketing length: ', bookingInfo.ticketing.length);
                //     console.log('Current ticketing data: ', bookingInfo.ticketing);
                // }
                //#6: send seat plan with button except for first seat plan sent
                console.log('Sending seat plan');
                const { seatPlanMsgId, seatPlanFileId, seatPlanCallback } = await sendSeatPlan({
                    chat_id: chatId,
                    bookingInfo,
                    seatingPlan: showtime.seatingPlan
                });

                //#7: update seatplanmsgid and seatplanfileid in bookinginfo thus eventually session
                for (let i = 0; i < sessionToMutate.bookingInfo.ticketing.length; i++) {
                    const selection = sessionToMutate.bookingInfo.ticketing[i];
                    if (selection.scheduleId === scheduleId) {
                        sessionToMutate.bookingInfo.ticketing[i].seatPlanMsgId = seatPlanMsgId.toString();
                        sessionToMutate.bookingInfo.ticketing[i].seatPlanFileId = seatPlanFileId;
                        sessionToMutate.bookingInfo.ticketing[i].seatPlanCallback = seatPlanCallback;
                        break;
                    }
                }
                //#8: delete the one to be deleted
                if (toDeleteMsgId !== undefined) {
                    await deleteRepeatSeatPlan(chatId, toDeleteMsgId);
                }

                //#9: update status
                sessionToMutate.status = { main: MAIN_STATUS.CHOOSE_SEAT, secondary: null };
                break;
            }
        default:
            throw `${__filename} | Unrecognized callback type ${type}`;
    }



}