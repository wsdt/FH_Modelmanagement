const mod_express = require('express');
const express_app = mod_express();

/* SERVER CONFIGURATION ***********************************/
/** If true, then all requests to 80 get redirected to 443. */
const HTTPS_REDIRECT = true;


// Set up server ++++++++++++++++++++++++++
setup_443();
if (HTTPS_REDIRECT) {
    setup_80();
}

// Functions ++++++++++++++++++++++++++++++
function setup_80() {
    const mod_http = require("http");
    mod_http.createServer(function (req, res) {
        //redirect to https
        res.writeHead(301, {"Location": "https://" + req.headers['host'] + req.url});
        res.end();
    }).listen(80);
    console.log('server.js:setup_80: Port 80 setup done (redirect to 443 activated).');
}

function setup_443() {
    const mod_https = require('https'),
        mod_fs = require('fs');

    const con_secret_key = './backend/secrets/key.pem';
    const con_secret_cert = './backend/secrets/cert.pem';
    const con_secret_pwd = '12345';

    const options = {
        key: mod_fs.readFileSync(con_secret_key),
        cert: mod_fs.readFileSync(con_secret_cert),
        passphrase: con_secret_pwd
    };

    mod_https.createServer(options, express_app).listen(443);
    console.log('server.js:setup_443: Port 443 setup done.');
}

// Export to other files (to export multiple see: https://stackoverflow.com/questions/8595509/how-do-you-share-constants-in-nodejs-modules)
module.exports = express_app;
