const crypto = require('crypto');
const db = require('../controller/db');

class User {
    constructor(usr_id, usr_name, usr_mail, usr_hashedPwd, usr_salt, usr_prefLang) {
        /** User Id which identifies the user accross languages etc. (cleaner) */
        this.id = usr_id;
        /** Username has an unique constraint (in db), so we can also query
         * users by their nickname (non-case-sensitive).
         * Username is also used to determine userAvatar (in images/users/x.jpg) */
        this.name = usr_name;
        this.mail = usr_mail;
        /** As usual, we only save hashed pwds. We are using the crypt() method
         * to hash passwords. */
        this.hashedPwd = usr_hashedPwd;
        /** Also as usual we use salts to prevent rainbow table attacks etc. */
        this.salt = usr_salt;
        /** User preferences ------------------------------------
         -> User language (displaying language of contents) */
        this.prefLang = usr_prefLang;
    }

    static createUniqueId() {
        //Thanks to: http://www.frontcoded.com/javascript-create-unique-ids.html
        return "id-" + Math.random().toString(36).substr(2, 16);
    }

    static createNewSalt() {
        return crypto.randomBytes(32).toString('hex'); //or toString('base64')
    }

    static hashPassword(clearPwd, salt) {
        let hash = crypto.createHmac('sha512', salt);
        hash.update(clearPwd);
        return hash.digest('hex');
    }

    set clearPassword(clearPwd) {
        this.hashedPwd = User.hashPassword(clearPwd, User.createNewSalt());
    }

    isPasswordCorrect(clearPwd) {
        return (User.hashPassword(clearPwd, this.salt) === this.hashedPwd);
    }

    /** Provide already mapped userObj to register a new user. */
    static registerNewUser(userObj, fErr, fSuc) {
        let con = db.returnConnectable();
        con.connect(function (err) {
            if (err) {
                if (User.isFunction(fErr)) {
                    fErr();
                }
                throw err;
            }

            con.query("INSERT INTO user (usr_id, usr_name, usr_mail, usr_hashedPwd, usr_salt, usr_prefLang) VALUES ('" +userObj.id+
                "','"+userObj.name+"', '"+userObj.mail+"','"+userObj.hashedPwd+"','"+userObj.salt+"','"+userObj.prefLang+"');", function (err, result) {
                if (err) {
                    if (User.isFunction(fErr)) {
                        fErr();
                    }
                    throw err;
                }

                if (User.isFunction(fSuc)) {
                    fSuc();
                }
                con.end();
            });
        });
    }

    static areUserCredentialsCorrect(userName, clearPwd, fSuc) {
        User.db_queryUserByName(userName, msg => {
            console.log("user:areUserCredentialsCorrect: User does not exist. User msg -> "+JSON.stringify(msg));
            fSuc(false); //e.g. user does not exist!!, just say pwd/user wrong
        }, user => {
            //Success will be only executed if user exists
            if (User.isFunction(fSuc)) {
                fSuc(user.isPasswordCorrect(clearPwd));
            }
        });
    }

    static isFunction(functionVar) {
        return typeof functionVar === "function";
    }

    /** Should be already extracted from the array.*/
    static mapDbRowToUser(jsonObj) {
        return new User(jsonObj.usr_id, jsonObj.usr_name, jsonObj.usr_mail,
            jsonObj.usr_hashedPwd, jsonObj.usr_salt, jsonObj.usr_prefLang);
    }

    /** @param id: User id to identify user.
     * @param fErr: Callback function which will be called if user can't be queried.
     * @param fSuc: Callback function which is called on success.*/
    static db_queryUserById(id, fErr, fSuc) {
        let con = db.returnConnectable();
        con.connect(function (err) {
            if (err) {
                if (User.isFunction(fErr)) {
                    fErr();
                }
                throw err;
            }
            let userRes = con.query("SELECT * FROM user where usr_id='" + id + "';", function (err, result, field) {
                if (err || result === undefined) {
                    if (User.isFunction(fErr)) {
                        fErr();
                    }
                    throw err;
                }
                let queriedUser = User.mapDbRowToUser(result[0]);
                if (User.isFunction(fSuc)) {
                    fSuc(queriedUser);
                }
                con.end();
            });
        });
    }

    /** @param name: User name to identify user (needs to be unique too, but is not the primary key).
     * @param fErr: Callback function which will be called if user can't be queried.
     * @param fSuc: Callback function which is called on success.*/
    static db_queryUserByName(name, fErr, fSuc) {
        let con = db.returnConnectable();
        con.connect(function (err) {
            if (err) {
                if (User.isFunction(fErr)) {
                    fErr();
                }
                throw err;
            }
            let userRes = con.query("SELECT * FROM user where usr_name='" + name + "';", function (err, result, field) {
                if (err || result === undefined || result[0] === undefined) {
                    if (User.isFunction(fErr)) {
                        fErr("User does not exist");
                    }
                    /*throw err; Do not throw error just bc. user not found*/
                } else {
                    let queriedUser = User.mapDbRowToUser(result[0]);
                    if (User.isFunction(fSuc)) {
                        fSuc(queriedUser);
                    }
                }
                con.end();
            });

        });
    }
}

module.exports = User;