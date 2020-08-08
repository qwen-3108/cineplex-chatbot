module.exports = { initializeLogs, logInfo, logError, getLogs }

const logs = {}

function initializeLogs(id) {
    const time = (new Date()).toISOString();
    logs[id] = `[${time}]\n`;
    console.log("logs[", id, "] initialized: ", logs[id]);
}

function logInfo(id, logText) {
    console.log(logText);
    logs[id] += '[INFO]\t' + logText + '\n';
}

function logError(id, logText) {
    console.error(logText);
    logs[id] += '[ERROR]\t' + logText + '\n';
}

function getLogs(id) {
    return logs[id];
}