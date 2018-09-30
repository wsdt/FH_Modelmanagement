const mod_orm = require('orm');
const mod_mysql = require('mysql');
const DB_CONNECTION_PROPS = {
    driver: "mysql",
    user: "root",
    pwd: "",
    host: "localhost",
    db_name: "fhkuf_models"
};
const DB_CONNECTION_STRING = DB_CONNECTION_PROPS.driver + "://" +
    DB_CONNECTION_PROPS.user + ":" + DB_CONNECTION_PROPS.pwd + "@" +
    DB_CONNECTION_PROPS.host + "/" + DB_CONNECTION_PROPS.db_name;
let isDbConfigured = false;

class Db {

    constructor(expressInstance) {
        if (!isDbConfigured) {
            Db._setup_db(expressInstance);
        }
    }

    /** Returns connection obj. */
    static returnConnectable() {
        return mod_mysql.createConnection(DB_CONNECTION_STRING);
    }

    //pseudo_private
    static _setup_db(expressInstance) {
        console.log("Db:setup_db: Setting up db.");

        let anonym_con = mod_mysql.createConnection({
            host: DB_CONNECTION_PROPS.host,
            user: DB_CONNECTION_PROPS.user,
            password: DB_CONNECTION_PROPS.pwd
        });
        anonym_con.connect(function (err) {
            if (err) throw err;
            console.log("Db:setup_db: Established anonymous connection.");
            //Create database
            anonym_con.query("CREATE DATABASE IF NOT EXISTS " + DB_CONNECTION_PROPS.db_name + ";", function (err, data) {
                if (err) {
                    console.error("Db:_setup_db: Database couldn't be created.");
                    throw err;
                }

                anonym_con.end();
                let con = mod_mysql.createConnection(DB_CONNECTION_STRING);
                con.connect(function (err) {
                   if (err) throw err;
                   console.log("Db:setup_db: Established non-anonymous connection.");
                   //Create tables
                    con.query("CREATE TABLE IF NOT EXISTS user (" +
                        "usr_id VARCHAR(20)," +
                        "usr_name VARCHAR(100)," +
                        "usr_mail VARCHAR(120)," +
                        "usr_hashedPwd VARCHAR(128)," +
                        "usr_salt VARCHAR(64)," +
                        "usr_prefLang VARCHAR(6)," +
                        "PRIMARY KEY (usr_id)"+
                        ");");

                    //insert default user
                    const mod_user = require("../models/user");
                    const testuser_salt = mod_user.createNewSalt();
                    con.query("INSERT INTO user (usr_id,usr_name,usr_mail,usr_hashedPwd,usr_salt,usr_prefLang) VALUES ('" +
                        mod_user.createUniqueId()+"','test','test@test.gmail.com','"+mod_user.hashPassword("12345",testuser_salt)+"','"+testuser_salt+"','de'"+
                        ");");
                    con.end();
                });
                isDbConfigured = true;
                console.log("Db:_setup_db: Db setup successfully.");
            });
        });
    }
}


module.exports = Db;
