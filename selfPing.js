require('dotenv').config();
const axios = require('axios');

axios({
    method: 'post',
    url: process.env.APP_URL,
    data: {}
});