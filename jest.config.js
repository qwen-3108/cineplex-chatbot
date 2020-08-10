require('dotenv').config();

module.exports = {
    testEnvironment: "node",
    testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/development_aid/"]
};

