module.exports = function assignDateTime(dateTimeObj) {

    let date = {
        start: null, end: null,
    };

    if (typeof dateTimeObj === 'string') {
        date.start = new Date(dateTimeObj);
        date.end = new Date(dateTimeObj);
        if (date.start.getHours() === 12) {
            date.start.setHours(0, 0, 0);
            date.end.setHours(23, 59, 59);
        }
    } else if (dateTimeObj.hasOwnProperty('date_time')) {
        date.start = new Date(dateTimeObj['date_time']);
        date.end = new Date(dateTimeObj['date_time']);
    } else if (dateTimeObj.hasOwnProperty('startDateTime') && dateTimeObj.hasOwnProperty('endDateTime')) {
        date.start = new Date(dateTimeObj['startDateTime']);
        date.end = new Date(dateTimeObj['endDateTime']);
    } else if (dateTimeObj.hasOwnProperty('startDate') && dateTimeObj.hasOwnProperty('endDate')) {
        date.start = new Date(dateTimeObj['startDate']);
        date.end = new Date(dateTimeObj['endDate']);
    } else if (dateTimeObj.hasOwnProperty('startTime') && dateTimeObj.hasOwnProperty('endTime')) {
        date.start = new Date(dateTimeObj['startTime']);
        date.end = new Date(dateTimeObj['endTime']);
    } else {
        throw `${__filename} | Unrecongized dateTimeObj format: ${JSON.stringify(dateTimeObj)}`;
    }

    console.log('Parsed date time: ', JSON.stringify(date));
    return date;
};