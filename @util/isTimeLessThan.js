
module.exports = function isTimeLessThan(timeOne, timeTwo) {
    const t1 = extractTime(timeOne);
    const t2 = extractTime(timeTwo);
    if (t1[0] < t2[0]) {
        return true;
    } else if (t1[0] > t2[0]) {
        return false;
    } else if (t1[1] < t2[1]) {
        return true;
    } else {
        return false;
    }
}

const extractTime = function (dateTime) {
    return [
        dateTime.getHours(),
        dateTime.getMinutes()
    ];
}
