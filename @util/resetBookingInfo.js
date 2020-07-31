module.exports = function resetBookingInfo(daysToDbDate, nextWeekAreDaysLessThan) {

    return ({
        movie: { title: null, id: null, debutDateTime: null, isBlockBuster: null },
        dateTime: {
            start: null, end: null,
            daysToDbDate,
            nextWeekAreDaysLessThan
        },
        cinema: [],
        ticketing: [],
        seatNumbers: []
    });

}