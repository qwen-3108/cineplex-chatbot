require('dotenv').config();

module.exports = {
    verbose: false,
    testEnvironment: "node",
    testTimeout: 50000,
    reporters: [
        "default",
        ["./node_modules/jest-html-reporter", { includeFailureMsg: true, includeConsoleLog: true }]
    ],
    testPathIgnorePatterns: ["<rootDir>/node_modules/"]
};

