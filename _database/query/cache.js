const { COLLECTIONS } = require('../../@global/COLLECTIONS');

module.exports = { inlineQueryResult, chosenInlineResult };

async function inlineQueryResult(cacheId, inlineQueryResult) {

    await COLLECTIONS.inlineQueryResultCache.insertOne({
        _id: cacheId,
        cachedAt: new Date(),
        inlineQueryResult
    });
    console.log('cache inlineQueryResult successfully');
}

async function chosenInlineResult(inline_message_id, query, state) {

    await COLLECTIONS.chosenInlineResultCache.insertOne({
        _id: inline_message_id,
        cachedAt: new Date(),
        query,
        state
    });
    console.log('cache chosenInlineResult successfully for query: ', query, ', state: ', state);
}


