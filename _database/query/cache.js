const { COLLECTIONS } = require('../../@global/COLLECTIONS');

module.exports = { inlineQueryResult, chosenInlineResult };

async function inlineQueryResult(cacheId, inlineQueryResult) {

    const outcome = await COLLECTIONS.inlineQueryResultCache.insertOne({
        _id: cacheId,
        cachedAt: new Date(),
        inlineQueryResult
    });
    console.log('return from caching inlineQueryResult: ', JSON.stringify(outcome));
}

async function chosenInlineResult(inline_message_id, query) {

    const outcome = await COLLECTIONS.chosenInlineResultCache.insertOne({
        _id: inline_message_id,
        cachedAt: new Date(),
        query
    });
    console.log('return from caching chosenInlineResult: ', JSON.stringify(outcome));
}


