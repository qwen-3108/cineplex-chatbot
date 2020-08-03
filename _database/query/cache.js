const { COLLECTIONS } = require('../../@global/COLLECTIONS');

module.exports = { inlineQueryResult, chosenInlineResult };

async function inlineQueryResult(cacheId, inlineQueryResult) {

    const { acknowledged, insertedId } = await COLLECTIONS.inlineQueryResultCache.insertOne({
        _id: cacheId,
        cachedAt: new Date(),
        inlineQueryResult
    });
    if (acknowledged) {
        console.log("inlineQueryResult's cache id: ", insertedId);
        return insertedId;
    } else {
        console.log("fail to cache inlineQueryResult");
    }
}

async function chosenInlineResult(inline_message_id, query) {

    const cache = await COLLECTIONS.chosenInlineResultCache.insertOne({
        _id: inline_message_id,
        cachedAt: new Date(),
        query
    });
    if (acknowledged) {
        console.log("chosenInlineResult's cache id: ", insertedId);
        return insertedId;
    } else {
        console.log("fail to cache inlineQueryResult");
    }
}


