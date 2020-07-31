const fs = require('fs');
require('dotenv').config();

function gcpCredGen() {

    fs.writeFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, process.env.GCP_CRED);

}

gcpCredGen();