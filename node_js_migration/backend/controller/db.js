const mod_orm = require('orm');
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

    //pseudo_private
    static _setup_db(expressInstance) {
        console.log("Db:setup_db: Setting up db.");

        const mod_mysql = require('mysql');
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

                const mod_bcrypt = require("bcrypt");
                expressInstance.use(mod_orm.express(DB_CONNECTION_STRING, {
                    define: function (db, models, next) {
                        models.user = db.define("user", {
                            usr_id: String,
                            usr_name: String,
                            usr_email: String,
                            usr_hashedpwd: String,
                            usr_salt: String,
                            usr_preflang: String
                        }, {
                            methods: {
                                setClearPassword: function (clearPwd) {
                                    mod_bcrypt.hash(clearPwd, 10, (err, hash) => {
                                        this.usr_hashedpwd = hash;
                                        console.log("server:setup_db:setClearPwd: Have set clear pwd after hashing it.");
                                    });
                                },
                                isPasswordCorrect: function (clearPwd) {
                                    return mod_bcrypt.compare(clearPwd, this.usr_hashedpwd, (err, res) => {
                                        return res;
                                    });
                                }
                            }
                        });
                        next();
                    }
                }));
                isDbConfigured = true;
                console.log("Db:_setup_db: Db setup successfully: "+DB_CONNECTION_PROPS.user+";;"+DB_CONNECTION_STRING);
            });
        });
    }
}


module.exports = Db;

/*<?php
namespace mgr {
    require_once '_conf.php';
    include_once '../classes/User.php'; //optional because only needed in insertDefaultData();

    /** Used PDO instead of mysqli so it should be easier to transfer
     * this to other dbms. *
class DbMgr
{
    private static $dbConnection = null;

    /** DEFAULT DATA INSERTION (Delete in production mode)
     * This method get's only called on database creation! *
    private function insertDefaultData($anonymousDbCon)
{
    // Create default db
    $anonymousDbCon->exec("CREATE DATABASE IF NOT EXISTS " . \DB\DB_NAME . "; USE " . \DB\DB_NAME . ";");
    $anonymousDbCon->exec("CREATE TABLE IF NOT EXISTS User (
    usr_id VARCHAR(500) PRIMARY KEY,
    usr_username VARCHAR(250) NOT NULL UNIQUE,
    usr_hashedpassword VARCHAR(500) NOT NULL UNIQUE,
    usr_salt VARCHAR(250) NOT NULL UNIQUE,
    usr_email VARCHAR(250) NOT NULL UNIQUE,
    usr_pref_lang VARCHAR(10) NOT NULL
);");

    $salt = \classes\User::createNewSalt();
    $clearPwd = "12345";
    $email = "test@test.com";
    $username = "test";
    require_once '_conf.php';
    (new \classes\User(\classes\User::createUniqueId($username, $clearPwd, $salt, $email),
    $username, \classes\User::hashPassword($clearPwd, $salt), $salt, $email, DEFAULT_LANG))->dbReplace($anonymousDbCon);
}


    //Do not use these methods if database does not exist
    public function exec($sql)
{
    DbMgr::getDbConnection(true)->exec($sql);
}

    public function query($sql)
{
    return DbMgr::getDbConnection(true)->query($sql);
}


    // #################################################################################
    public function __construct()
{
    $this->getDbConnection(false); // by opening with false default data get's inserted
    $this->closeConnection();
}

    //Private because only used in getDbConnection()
    private function establishConnection($doesDatabaseExist = false)
{
    try {
        $conn = new \PDO("mysql:host=" . \DB\DB_SERVERNAME .
        (($doesDatabaseExist) ? ";dbname=" . \DB\DB_NAME : ""),
    \DB\DB_USERNAME, \DB\DB_PASSWORD);

        // set error mode to exception so we can react to it with try catch
        $conn->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
        //connection successful

        //if db hasn't existed before, we will insert our default data
        if (!$doesDatabaseExist) {
            $this->insertDefaultData($conn);
        }

        return $conn;
    } catch (\PDOException $e) {
    die("<p>Could not establish dbConnection: " . $e->getMessage() . "</p>");
}
}

    private static function closeConnection()
{
    DbMgr::$dbConnection = null;
}

    //Close dbConnection on object destroy
    function __destruct()
{
    $this->closeConnection();
}

    //GETTER/SETTER -------------------------
    //MUST NOT BE STATIC TO force constr to be called
    public function getDbConnection($doesDatabaseExist)
{
    if (DbMgr::$dbConnection == null) {
        DbMgr::$dbConnection = $this->establishConnection($doesDatabaseExist);
    }
    return DbMgr::$dbConnection;
}

}
}*/