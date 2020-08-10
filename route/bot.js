const bot = require('express').Router();
const botHandler = require('./botHandler');

bot.post('/', (req, res) => botHandler(req, res));

module.exports = bot;
