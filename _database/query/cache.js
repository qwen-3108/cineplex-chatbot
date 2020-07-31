const { COLLECTIONS } = require('../../@global/COLLECTIONS');

module.exports = { inlineQueryResult, chosenInlineResult };

async function inlineQueryResult(cacheId, inlineQueryResult) {

    const cache = await COLLECTIONS.inlineQueryResultCache.insertOne({
        _id: cacheId,
        cachedAt: new Date(),
        inlineQueryResult
    });
    console.log("inlineQueryResult's cache id: ", cache._id);
    return cache._id;
}

async function chosenInlineResult(inline_message_id, query) {

    const cache = await COLLECTIONS.chosenInlineResultCache.insertOne({
        _id: inline_message_id,
        cachedAt: new Date(),
        query
    })
    console.log("chosenInlineResult's cache id: ", cache._id);
    return cache._id;
}


