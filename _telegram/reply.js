module.exports = {
    basics: require('./reply/basics'),
    typing: require('./reply/typing'),
    //fill slot
    fillSlot: require('./reply/fillSlot'),
    invalidDateTime: require('./reply/invalidDateTime'),
    noResult: require('./reply/noResult'),
    upcomingMovie: require('./reply/upcomingMovie'),
    warnPlatinum: require('./reply/warnPlatinum'),
    confirmEdit: require('./reply/confirmEdit'),
    firstTimes: require('./reply/firstTimes'),
    //everything about seating plans
    sendSeatLegend: require('./reply/sendSeatLegend'),
    sendSeatPlan: require('./reply/sendSeatPlan'),
    editSeatPlanButton: require('./reply/editSeatPlanButton'),
    deleteRepeatSeatPlan: require('./reply/deleteRepeatSeatPlan'),
    editSeatPlan: require('./reply/editSeatPlan'),
    //confirming seating plan
    alertMultipleShowtimes: require('./reply/alertMultipleShowtimes'),
    getSeats: require('./reply/getSeats'),
    //choose seat
    alertSeatProblem: require('./reply/alertSeatProblem'),
    toEditSeatReq: require('./reply/toEditSeatReq'),
    getEditSeats: require('./reply/getEditSeats'),
    confirmSeats: require('./reply/confirmSeats'),
    //confirm order
    confirmDetails: require('./reply/confirmDetails'),
    getPayment: require('./reply/getPayment'),
    //successful payment
    sendTickets: require('./reply/sendTickets'),
    finish: require('./reply/finish'),
    //fallback
    toFallback: require('./reply/toFallback'),
    //others
    answerPreCheckoutQuery: require('./reply/answerPreCheckoutQuery'),
    toMovieCallback: require('./reply/toMovieCallback'),
    //FAQ
    faq: require('./reply/faq'),
    faqTicketPrice: require('./reply/faqTicketPrice'),
    faqMovieAvailability: require('./reply/faqMovieAvailability'),
    //send error
    sendError: require('./reply/sendError'),
}