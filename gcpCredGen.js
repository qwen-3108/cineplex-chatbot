const fs = require('fs');
require('dotenv').config();

function gcpCredGen() {

    const writePath = './' + process.env.GOOGLE_APPLICATION_CREDENTIALS;
    fs.writeFile(writePath, process.env.GCP_CRED, err => console.log(err));

}

gcpCredGen();