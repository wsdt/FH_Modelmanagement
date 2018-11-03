const mod_session = require('express-session');
const app = require('../server');
const mod_user = require('../models/user');
const mod_settings = require("../models/settings");

app.use(mod_session({
    secret: mod_user.createNewSalt(),
    resave: true,
    saveUninitialized: true,
    proxy: 'true',
    cookie: {maxAge: 24*60*60*1000} //expires after 24 hours
})); //enable sessions
app.set('trust proxy', 1); //trust first proxy

class sessionMiddleware {
    static sessLogin(req, userName) {
        //set session
        req.session.userName = userName;
        console.log("sessionMiddleware:sessLogin: Set session-cookie.");
    }

    static sessLogout(req) {
        //set session to null
        req.session.userName = null;
    }

    // Set session if login is deactivated
    static isSessionValid(req) {
        mod_settings.loginWithoutAuth(req, null,null);

        return (req !== undefined && req !== null &&
            req.session !== undefined && req.session !== null &&
            req.session.userName !== undefined && req.session.userName !== null); //currently just evaluating whether any value has been set (TODO)
    }
}

module.exports = sessionMiddleware;