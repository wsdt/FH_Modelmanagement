const db = require('../controller/db');

class Settings {
    static loginWithoutAuth(req, fErr) {
        let dbCon = db.returnConnectable();
        dbCon.query("SELECT set_login FROM settings;", function(err, result) {
            if ((err || result === undefined) && Settings.isFunction(fErr)) {
                fErr();
            } //do not throw error
                if(result[0].set_login === 0) {
                    require("../middleware/sessionMiddleware").sessLogin(req, "NO_AUTH");
                    console.warn("db:loginWithoutAuth: Login is deactivated.");
                } else {
                    console.log("db:loginWithoutAuth: Login activated.");
                }

            dbCon.end();
        });
    }

    static isFunction(functionVar) {
        return typeof functionVar === "function";
    }
}

module.exports = Settings;