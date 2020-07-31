require('dotenv').config();

module.exports = {
    verbose: true,
    globalSetup: "./#test/setup.js",
    globalTeardown: "./#test/teardown.js",
};