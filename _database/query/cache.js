const { COLLECTIONS } = require('../../@global/COLLECTIONS');

module.exports = { inlineQueryResult, chosenInlineResult };

async function inlineQueryResult(cacheId, inlineQueryResult) {

    const outcome = await COLLECTIONS.inlineQueryResultCache.insertOne({
        _id: cacheId,
        cachedAt: new Date(),
        inlineQueryResult
    });
    if (outcome.result.ok === 1) {
        console.log('cache inlineQueryResult successfully');
    }
}

async function chosenInlineResult(inline_message_id, query) {

    const outcome = await COLLECTIONS.chosenInlineResultCache.insertOne({
        _id: inline_message_id,
        cachedAt: new Date(),
        query
    });
    if (outcome.result.ok === 1) {
        console.log('cache chosenInlineResult successfully for query: ', query);
    }
}


