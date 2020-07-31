const { addDays } = require('date-fns');
const { COLLECTIONS } = require('../@global/COLLECTIONS');

module.exports = async function populateBookingInfo({ showtime, sessionToMutate }) {

    console.log('Populating booking info from showtime...');
    const { _id, cinema, hall, isPlatinum, dateTime, movieId } = showtime;

    if (sessionToMutate.bookingInfo.movie.id !== movieId) {
        const movie = await COLLECTIONS.movies.findOne({ _id: movieId });
        sessionToMutate.bookingInfo.movie = {
            id: movieId,
            title: movie.title,
            isBlockBuster: movie.isBlockBuster,
            debutDateTime: movie.debutDateTime
        };
    }

    const date = new Date(dateTime);
    console.log('date in DB: ', date);
    const { daysToDbDate, nextWeekAreDaysLessThan } = sessionToMutate.bookingInfo.dateTime;
    console.log(daysToDbDate, nextWeekAreDaysLessThan);
    const mappedDate = date.getDay() < nextWeekAreDaysLessThan ? addDays(date, daysToDbDate + 7) : addDays(date, daysToDbDate);
    console.log('mappedDate: ', mappedDate);

    sessionToMutate.bookingInfo.dateTime = {
        start: mappedDate,
        end: mappedDate,
        daysToDbDate,
        nextWeekAreDaysLessThan
    };

    sessionToMutate.bookingInfo.place = null;
    sessionToMutate.bookingInfo.cinema = cinema;

}