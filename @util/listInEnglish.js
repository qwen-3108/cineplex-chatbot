module.exports = function listInEnglish(arrOfPhrases) {
    const str = arrOfPhrases.reduce((acc, cur, i) => {

        if (i === arrOfPhrases.length - 1) {
            if (arrOfPhrases.length > 2) {
                return acc += `, and ${cur}`;
            } else {
                return acc += ` and ${cur}`;
            }
        } else {
            return acc += `, ${cur}`;
        }
        // if (i < arrOfPhrases.length - 2) {
    });
    return str;
}