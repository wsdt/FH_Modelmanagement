/** Define routes **********************************
 * Allowed http-methods:
 * >> post, get, put, delete */
module.exports = {
    "/": {
        "get":get_login
    },
    "/login": {
        "get":get_login
    }
};

/** Route methods ***********************************/
const page_dir = "./frontend/html/";

function get_login(req, res) {
    openFile(page_dir+"login.html",req,res);
}

function openFile(file, req, res) {
    const fs = require('fs');
    fs.readFile(file, "utf8", function(err, data) {
        if (err) {throw err;} else {
            res.send(data);
        }
    })
}

