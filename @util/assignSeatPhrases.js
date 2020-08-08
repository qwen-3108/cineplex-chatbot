const { REGEX } = require('../@global/CONSTANTS');

module.exports = function assignSeatPhrases(text) {

    const output = { toPush: [], toRemove: [], toReplace: [] };

    const toPushFull = [];
    const toReplaceFull = [];
    const toRemoveFull = [];

    const to_replace = text.match(REGEX.TO_REPLACE);
    const to_replace_2 = text.match(REGEX.TO_REPLACE_2);
    if (to_replace !== null) { toReplaceFull.push(...to_replace); }
    if (to_replace_2 !== null) { toReplaceFull.push(...to_replace_2); }
    console.log(`to_replace: ${JSON.stringify(to_replace)}`,);
    console.log(`to_replace_2: ${JSON.stringify(to_replace_2)}`);

    if (toReplaceFull.length !== 0) {
        const toReplace = toReplaceFull.join(', ').match(REGEX.SEAT_PHRASE);
        if (toReplace !== null) { output.toReplace.push(...toReplace); }

    } else {
        const to_remove = text.match(REGEX.TO_REMOVE);
        const to_push = text.match(REGEX.TO_PUSH);
        const to_push_2 = text.match(REGEX.TO_PUSH_2);
        const to_change = text.match(REGEX.TO_CHANGE);
        console.log(`to_remove: ${JSON.stringify(to_remove)}`);
        console.log(`to_push: ${JSON.stringify(to_push)}`);
        console.log(`to_push_2: ${JSON.stringify(to_push_2)}`);
        console.log(`to_change: ${JSON.stringify(to_change)}`);
        if (to_remove !== null) toRemoveFull.push(...to_remove);
        if (to_push !== null) toPushFull.push(...to_push);
        if (to_push_2 !== null) toPushFull.push(...to_push_2);
        if (to_change !== null) {
            toPushFull.push(...to_change.groups.add);
            toRemoveFull.push(...to_change.groups.remove);
        }
        const toRemove = toRemoveFull.join(', ').match(REGEX.SEAT_PHRASE);
        const toPush = toPushFull.join(', ').match(REGEX.SEAT_PHRASE);
        if (toRemove !== null) output.toRemove.push(...toRemove);
        if (toPush !== null) output.toPush.push(...toPush);
        if (toRemoveFull.length === 0 && toPushFull.length === 0) output.toReplace = text.match(REGEX.SEAT_PHRASE);
    }
    console.log(`Pre-processing assignment: ${JSON.stringify(output)}`);
    return output;

};