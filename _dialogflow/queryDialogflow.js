const dialogflow = require('dialogflow');
const { addHours } = require('date-fns');
const LOGS = require('../@global/LOGS');

module.exports = async function queryDialogflow(id, message) {

    LOGS.logInfo(id, '-----detecting intent-----');

    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.sessionPath(process.env.DIALOGFLOW_PROJECT_ID, id);
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: message,
                languageCode: 'en-US'
            }
        },
    };
    //detect intent
    const response = await sessionClient.detectIntent(request);
    //log intent
    const intent = response[0].queryResult.intent.displayName;
    LOGS.logInfo(id, `Detected intent: ${intent}`);
    //log parameters
    let extractedInfo;
    extractedInfo = flatten({
        structValue: response[0].queryResult.parameters,
        kind: 'structValue'
    });
    if (extractedInfo.hasOwnProperty('date-time') && extractedInfo.hasOwnProperty('movie')) {
        if (extractedInfo['date-time'] !== "") {
            const input = response[0].queryResult.queryText;
            const nightPhraseInMovieName = extractedInfo.movie.match(/night/gi) || [];
            const nightPhraseInInput = input.match(/night/gi) || [];
            const timeIsNight = nightPhraseInInput.length - nightPhraseInMovieName.length > 0;
            if (timeIsNight) {
                extractedInfo['date-time'] = extendNightRange(extractedInfo['date-time']);
            }
        }
    }
    LOGS.logInfo(id, `Extracted info: ${JSON.stringify(extractedInfo)}`);
    //return
    return ({
        intent,
        extractedInfo
    });
}

/*----Helper functions----*/

function flatten(data, depthStr = '/') {
    // LOGS.logInfo(id, 'depth: ', depthStr);
    // LOGS.logInfo(id, 'data to be flattened: ', data);
    const notObject = typeof data !== 'object';
    const notArray = Array.isArray(data);
    const notNull = data !== null;
    if (notObject && notArray && notNull) {
        return data;
    } else {
        switch (data.kind) {
            case 'structValue':
                const obj = {};
                for (const key in data.structValue.fields) {
                    obj[key] = flatten(data.structValue.fields[key], depthStr + `${key}/`);
                    // LOGS.logInfo(id, `At ${depthStr}, flattened key (${key}): `, obj[key]);
                }
                // LOGS.logInfo(id, `At ${depthStr}, obj: `, obj);
                return obj;
                break;
            case 'listValue':
                const arr = data.listValue.values.map((value, index) => {
                    return flatten(value, depthStr + `index ${index}/`);
                })
                // LOGS.logInfo(id, 'flattened arr', arr);
                return arr;
                break;
            case 'stringValue':
                return data.stringValue;
                break;
            case 'numberValue':
                return data.numberValue;
                break;
            default:
                throw `Custom error: Non of - structValue | listValue | stringValue | numberValue, ${JSON.stringify(data)}`;
        }
    }
}

function extendNightRange(dateTimeObj) {
    const startDateTime = new Date(dateTimeObj.startDateTime);
    const startTime = startDateTime.getHours();
    const endDateTime = new Date(dateTimeObj.endDateTime);
    const endTime = endDateTime.getHours();
    if (startTime !== 17 || endTime !== 23) {
        throw `Custom error IN extendNightRange: startTime - ${startTime}, endTime - ${endTime} not NIGHT`;
    } else {
        newStartDateTime = addHours(startDateTime, 2);
        newEndDateTime = addHours(endDateTime, 7);
        return ({ startDateTime: newStartDateTime.toString(), endDateTime: newEndDateTime.toString() });
    }
}