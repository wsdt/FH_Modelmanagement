const Mod_fs = require('fs');

/** Define routes **********************************
 * Allowed http-methods:
 * >> post, get, put, delete */
module.exports = {
    "/": {
        "get": get_login
    },
    "/login": {
        "get": get_login
    },
    "/upload": {
        "get": get_upload
    },
    "/model": {
        "get": get_all_models
    }
};

/** Route methods ***********************************/
const page_dir = "./frontend/html/";

//TODO: add middleware
function get_all_models(req, res) {
    const path = "./backend/data/";

    Mod_fs.readdir(path, function (err, items) {
        console.log("routes:get_all_models: Found models -> " + items);

        let resultJsonArr = [];
        if (err || items === undefined || items === null) {
            console.warn("routes:get_all_models: Found no models.");
        } else {
            items.forEach(function (model) {
                resultJsonArr.push(JSON.parse(Mod_fs.readFileSync(path + model, "utf8")));
            });
        }

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(resultJsonArr));
    });
}

//TODO: Add middleware for session (automatic redirect to login)
function get_upload(req, res) {
    openFile(page_dir + "modelupload.html", req, res);
}

//TODO: Add session middleware (if logged in redirect to upload)
function get_login(req, res) {
    openFile(page_dir + "login.html", req, res);
}

function openFile(file, req, res) {
    Mod_fs.readFile(file, "utf8", function (err, data) {
        if (err) {
            throw err;
        } else {
            res.send(data);
        }
    })
}

