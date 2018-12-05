const Mod_fs = require('fs');
const mod_user = require('../models/user');
const mod_sessionMiddleware = require('../middleware/sessionMiddleware');

/** Define routes **********************************
 * Allowed http-methods:
 * >> post, get, put, delete */
module.exports = {
    "/": {
        "get": get_login
    },
    "/v1/login": {
        "get": get_login,
        "post": post_login
    },
    "/v1/logout": {
        "post": post_logout
    },
    "/v1/register": {
        "post": post_register
    },
    "/v1/lostpwd": {
        "post": post_lostpwd
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

function isValueNotEmpty(val) {
    return (val !== undefined && val !== null && val !== "");
}

function post_logout(req, res) {
    //just delete session (redirect on frontend)
    let logout_req = req.body;

    if (isValueNotEmpty(logout_req) && isValueNotEmpty(logout_req.logout) && logout_req.logout === true) {
        mod_sessionMiddleware.sessLogout(req);
        res.json({
            loggedOut: true,
            res_title: "Logged out",
            res_text: "You have been logged out successfully.",
            notification_type: "success"
        });
    } else {
        res.json({
            loggedOut: false,
            res_title: "Request malformed",
            res_text: "Could not logout. Please try again.",
            notification_type: "error"
        });
    }
}

function post_lostpwd(req, res) {
    let lostpwd_req = req.body;
    if (isValueNotEmpty(lostpwd_req)) {
        try {
            if (isValueNotEmpty(lostpwd_req.usr_mail)) {
                mod_user.db_queryUserByMail(lostpwd_req.usr_mail, () => {
                    res.json({
                        pwd_resetted: false,
                        res_title: "Db error",
                        res_text: "Could not reset your password. Maybe user does not exist.",
                        notification_type: "error"
                    });
                },(userObj) => {
                    userObj.resetPassword(() => {
                        res.json({
                            pwd_resetted: false,
                            res_title: "Db error",
                            res_text: "Your user exists but we could not reset your password due to an internal error.",
                            notification_type: "error"
                        });
                    }, () => {
                        res.json({
                            pwd_resetted: true,
                            res_title: "Password resetted",
                            res_text: "We resetted your password successfully. Please look into your mails.",
                            notification_type: "success"
                        });
                    });
                });
            } else {
                res.json({
                    pwd_resetted: false,
                    res_title: "Invalid",
                    res_text: "Please provide a mail.",
                    notification_type: "error"
                });
            }
        } catch (e) {
            console.error("routes:post_lostpwd: Could not reset user pwd due to an unknown error -> "+JSON.stringify(e));
            res.json({
                pwd_resetted: false,
                res_title: "Error",
                res_text: "An unknown error occurred. Try it later again or contact administrator.",
                notification_type: "error"
            });
        }
    } else {
        console.error("routes:post_lostpwd: Could not reset pwd as no data might be available -> " + lostpwd_req);
        res.json({
            pwd_resetted: false,
            res_title: "Invalid request",
            res_text: "Please do not send random requests to this url.",
            notification_type: "error"
        });
    }
}

function post_register(req, res) {
    let register_req = req.body;
    if (isValueNotEmpty(register_req)) {
        try {
            if (isValueNotEmpty(register_req.usr_name) && isValueNotEmpty(register_req.usr_mail) && isValueNotEmpty(register_req.usr_clearPwd)) {
                let usr_salt = mod_user.createNewSalt();
                let newUser = new mod_user(
                    mod_user.createUniqueId(),
                    register_req.usr_name,
                    register_req.usr_mail,
                    mod_user.hashPassword(register_req.usr_clearPwd,usr_salt),
                    usr_salt,
                    "de" /* German by default */
                );

                mod_user.registerNewUser(newUser,() => {
                    res.json({
                        user_registered: false,
                        res_title: "Db error",
                        res_text: "Could not register new user. Maybe user already exists. Mail, username and id needs to be unique.",
                        notification_type: "error"
                    });
                },() => {
                    res.json({
                        user_registered: true,
                        res_title: "User registered",
                        res_text: "Your user "+register_req.usr_name+" has been registered successfully.",
                        notification_type: "success"
                    });
                });

            } else {
                res.json({
                    user_registered: false,
                    res_title: "Invalid",
                    res_text: "Please provide a username, mail and a password.",
                    notification_type: "error"
                });
            }
        } catch (e) {
            console.error("routes:post_register: Could not register user due to an unknown error -> "+JSON.stringify(e));
            res.json({
                user_registered: false,
                res_title: "Error",
                res_text: "An unknown error occurred. Try it later again or contact administrator.",
                notification_type: "error"
            });
        }
    } else {
        console.error("routes:post_login: Could not login as no data might be available -> " + register_req);
        res.json({
            user_registered: false,
            res_title: "Invalid request",
            res_text: "Please do not send random requests to this url.",
            notification_type: "error"
        });
    }
}

function post_login(req, res) {
    let login_req = req.body;
    if (isValueNotEmpty(login_req)) {
        try {
            mod_user.areUserCredentialsCorrect(login_req.usr_name, login_req.usr_clearPwd,
                isLoginSuccessful => {
                    if (isLoginSuccessful) {
                        //set also session
                        mod_sessionMiddleware.sessLogin(req,login_req.usr_name);

                        res.json({
                            user_authenticated: true,
                            res_title: "Authorized",
                            res_text: "Password and user are valid.",
                            notification_type: "success"
                        });
                    } else {
                        res.json({
                            user_authenticated: false,
                            res_title: "Unauthorized",
                            res_text: "Password or user is wrong.",
                            notification_type: "error"
                        });
                    }
                });
        } catch (e) {
            console.error("routes:post_login: Could not login due to an unknown error -> "+JSON.stringify(e));
            res.json({
                user_authenticated: false,
                res_title: "Unauthorized",
                res_text: "Something seems to be wrong with your credentials or a deep nested error occurred.",
                notification_type: "error"
            });
        }
    } else {
        console.error("routes:post_login: Could not login as no data might be available -> " + login_req);
        res.json({
            user_authenticated: false,
            res_title: "Pre-Condition failed",
            res_text: "Request malformed.",
            notification_type: "error"
        });
    }
}

/** Saves new model/compression */
function post_model(req, res) {
    let newModel = req.body;

    if (mod_sessionMiddleware.isSessionValid(req)) {
        if (newModel !== undefined && newModel !== null && newModel !== "") {
            try {
                console.log("routes:post_model:1 -> "+JSON.stringify(newModel)+ " ; "+newModel.constructor+ ";;");
                newModel = JSON.parse(newModel);
                console.log("routes:post_model:2");
                Mod_fs.writeFile(data_dir + newModel.objectTripleID + ".json", newModel, "utf8"); //no callback
                console.log("routes:post_model: Tried to save new model.");
            } catch (e) {
                console.error("routes:post_model: Could not save new model, as it is not valid JSON -> " + JSON.stringify(newModel) + "\n" + JSON.stringify(e));
            }
        } else {
            console.error("routes:post_model: Could not save new model as no data might be available -> " + newModel);
        }
    } else {
        console.error("routes:post_model: User not logged in.");
        //no redirect necessary as it is a post request.
    }
}

/** Returns specific model (via get-param) or if not provided
 * all saved models. */
function get_models(req, res) {

    if (mod_sessionMiddleware.isSessionValid(req)) {
        let modelId = req.query.objectTripleID;
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
    } else {
        console.error("routes:get_all_models: User session not valid. Redirecting ...");
        res.writeHead(301, {Location: '/'});
        res.end();
    }
}

function get_upload(req, res) {
    if (mod_sessionMiddleware.isSessionValid(req)) {
        openFile("modelupload", req, res, {userName:req.session.userName});
    } else {
        console.error("routes:get_upload: User session not valid. Redirecting ...");
        res.writeHead(301, {Location: '/'});
        res.end();
    }
}

function get_login(req, res) {
    if (!mod_sessionMiddleware.isSessionValid(req)) {
        openFile("login", req, res, {});
    } else {
        console.warn("routes:get_login: User session valid. Redirecting ...");
        res.writeHead(301, {Location: '/v1/upload'});
        res.end();
    }
}

function openFile(file, req, res, optionJson) {
    res.render(file,optionJson);
    /*Mod_fs.readFile(file, "utf8", function (err, data) {
        if (err) {
            throw err;
        } else {
            res.send(data);
        }
    })*/
}

