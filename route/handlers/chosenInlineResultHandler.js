const { ObjectId } = require('mongodb');
const { COLLECTIONS } = require('../../@global/COLLECTIONS');
const populateBookingInfo = require('../../@util/populateBookingInfo');

module.exports = async function chosenInlineResultHandler({ result_id, sessionToMutate }) {

    const [type, id] = result_id.split(':');
    switch (type) {
        case 'movieId':
            {
                const movie = await COLLECTIONS.movies.findOne(
                    { _id: id },
                    {
                        projection: { title: 1, debutDateTime: 1, isBlockBuster: 1 }
                    });

                sessionToMutate.bookingInfo.movie = {
                    title: movie.title,
                    id: movie._id,
                    debutDateTime: movie.debutDateTime,
                    isBlockBuster: movie.isBlockBuster
                };
            }
            break;
        case 'scheduleId':
            {
                const showtime = await COLLECTIONS.showtimes.findOne(
                    { _id: ObjectId(id) },
                    {
                        projection: { cinema: 1, isPlatinum: 1, dateTime: 1, movieId: 1 }
                    }
                );
                await populateBookingInfo({ showtime, sessionToMutate });
            }
            break;
        default:
            throw `Unrecognized type ${type} in chosen inline result_id`;
    }


}