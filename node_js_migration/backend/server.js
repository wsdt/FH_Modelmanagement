const express = require('express');
const express_app = express();
let https_server = setup_443();

/* SERVER CONFIGURATION ***********************************/
/** If true, then all requests to 80 get redirected to 443. */
const HTTPS_REDIRECT = true;


// Set up other ports than 443 ++++++++++++++++++++++++++
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

    //Set static base url for all inline refs (stylesheets, js)
    express_app.use(express.static("frontend"));
    //enable json data body parsing
    express_app.use(express.json());
    //use orm module
    setup_db();

    console.log('server.js:setup_443: Port 443 setup done.');
    return mod_https.createServer(options, express_app).listen(443);
}

function setup_db() {
    const mod_orm = require('orm');
    const mod_bcrypt = require('bcrypt');

    express_app.use(mod_orm.express("mysql://root:@localhost/fhkuf_models", {
        define: function (db, models) {
            models.user = db.define("user", {
                usr_id : String,
                usr_name : String,
                usr_email : String,
                usr_hashedpwd : String,
                usr_salt : String,
                usr_preflang : String
            }, {
                methods: {
                    setClearPassword: function(clearPwd) {
                        mod_bcrypt.hash(clearPwd, 10, (err, hash) => {
                            this.usr_hashedpwd = hash;
                            console.log("server:setup_db:setClearPwd: Have set clear pwd after hashing it.");
                        });
                    },
                    isPasswordCorrect: function (clearPwd) {
                        return mod_bcrypt.compare(clearPwd, this.usr_hashedpwd, (err, res)=>{
                            return res;
                        });
                    }
                }
            });
        }
    }));
}


// Export to other files (to export multiple see: https://stackoverflow.com/questions/8595509/how-do-you-share-constants-in-nodejs-modules)
module.exports = express_app;
