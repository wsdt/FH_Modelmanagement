const Mod_fs = require('fs');

/** Define routes **********************************
 * Allowed http-methods:
 * >> post, get, put, delete */
module.exports = {
    "/": {
        "get": get_login
    },
    "/v1/login": {
        "get": get_login
    },
    "/v1/upload": {
        "get": get_upload
    },
    "/v1/model": {
        "get": get_models,
        "post": post_model
    }
};

/** Route methods ***********************************/
const page_dir = "./frontend/html/";
const data_dir = "./backend/data/";

//TODO: add middleware sess
/** Saves new model/compression */
function post_model(req, res) {
    let newModel = req.body;
    if (newModel !== undefined && newModel !== null && newModel !== "") {
        try {
            newModel = JSON.parse(newModel);
            Mod_fs.writeFile(data_dir + newModel.objectTripleID + ".json", newModel, "utf8"); //no callback
            console.log("routes:post_model: Tried to save new model.");
        } catch(e) {
            console.error("routes:post_model: Could not save new model, as it is not valid JSON -> " + JSON.stringify(newModel)+ "\n"+JSON.stringify(e));
        }
    } else {
        console.error("routes:post_model: Could not save new model as no data might be available -> " + newModel);
    }
}

//TODO: add middleware
/** Returns specific model (via get-param) or if not provided
 * all saved models. */
function get_models(req, res) {
    let modelId = req.query.objectTripleID; //$_GET["objectTripleID"]

    if (modelId !== undefined && modelId !== null && modelId !== "") {
        //Only return one json obj
        console.log("routes:get_models: Requested model -> " + modelId);
        let modelJson = JSON.parse(Mod_fs.readFileSync(data_dir + modelId, "utf8"));
        if (modelJson === undefined || modelJson === null || modelJson === {} || modelJson === []) {
            console.error("routes:get_models: Requested model NOT found.");
            return {};
        } else {
            return modelJson;
        }
    } else {
        Mod_fs.readdir(data_dir, function (err, items) {
            console.log("routes:get_models: Found models -> " + items);

            let resultJsonArr = [];
            if (err || items === undefined || items === null) {
                console.warn("routes:get_all_models: Found no models.");
            } else {
                items.forEach(function (model) {
                    resultJsonArr.push(JSON.parse(Mod_fs.readFileSync(data_dir + model, "utf8")));
                });
            }

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(resultJsonArr));
        });
    }
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

