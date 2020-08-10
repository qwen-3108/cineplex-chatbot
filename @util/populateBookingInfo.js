const { COLLECTIONS } = require('../@global/COLLECTIONS');
const mapDateTime = require('./mapDateTime');

module.exports = async function populateBookingInfo({ showtime, sessionToMutate }) {

    console.log('Populating booking info from showtime...');
    const { cinema, isPlatinum, dateTime, movieId } = showtime;

    if (sessionToMutate.bookingInfo.movie.id !== movieId) {
        const movie = await COLLECTIONS.movies.findOne({ _id: movieId });
        sessionToMutate.bookingInfo.movie = {
            id: movieId,
            title: movie.title,
            isBlockBuster: movie.isBlockBuster,
            debutDateTime: movie.debutDateTime
        };
    }

    const mappedDate = mapDateTime(dateTime, sessionToMutate.bookingInfo.dateTime.sessionStartedAt);
    sessionToMutate.bookingInfo.dateTime.start = mappedDate;
    sessionToMutate.bookingInfo.dateTime.end = mappedDate;

    sessionToMutate.bookingInfo.place = null;
    sessionToMutate.bookingInfo.cinema = [cinema];

    sessionToMutate.bookingInfo.experience = isPlatinum ? 'Platinum Movie Suites' : 'Regular';

}