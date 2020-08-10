module.exports = function resetBookingInfo() {

    return ({
        movie: { title: null, id: null, debutDateTime: null, isBlockBuster: null },
        dateTime: { start: null, end: null },
        cinema: [],
        ticketing: [],
        seatNumbers: []
    });

}