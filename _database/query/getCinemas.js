const { COLLECTIONS } = require('../../@global/COLLECTIONS');

module.exports = async function getCinemas(cinemaArr) {

    const searchCursor = await COLLECTIONS.cinemas.find({ cinema: { $in: cinemaArr } });
    const cinemas = await searchCursor.toArray();
    if (cinemas.length === 0) {
        throw `${__filename} | No cinema found`;
    } else {
        console.log('Update: Cinemas retrieved');
        return cinemas;
    }

}