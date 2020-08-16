module.exports = {
    basics: require('./reply/basics'),
    //fill slot
    fillSlot: require('./reply/fillSlot'),
    upcomingMovie: require('./reply/upcomingMovie'),
    invalidDateTime: require('./reply/invalidDateTime'),
    getDayWithinSchedule: require('./reply/getDayWithinSchedule'),
    noResult: require('./reply/noResult'),
    warnPlatinum: require('./reply/warnPlatinum'),
    confirmEdit: require('./reply/confirmEdit'),
    firstMovieCard: require('./reply/firstMovieCard'),
    firstShowtimeCard: require('./reply/firstShowtimeCard'),
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
    toMovieCallback: require('./reply/toMovieCallback'),
    //FAQ
    faq: require('./reply/faq'),
    faqTicketPrice: require('./reply/faqTicketPrice'),
    faqMovieAvailability: require('./reply/faqMovieAvailability'),
    //send error
    sendError: require('./reply/sendError'),
    //rejectedConfirm
    acknowledgeReject: require('./reply/acknowledgeReject'),
    askForMoreInfo: require('./reply/askForMoreInfo'),
    askToRepeat: require('./reply/askToRepeat'),
    //productQuery
    narrowSearch: require('./reply/narrowSearch'),
}