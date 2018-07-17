<?php

include 'User.php'; //optional because only needed in insertDefaultData();

/** Used PDO instead of mysqli so it should be easier to transfer
 * this to other dbms. */
class DbConnection
{
    private static $dbServername = "127.0.0.1";
    private static $dbName = "fhkufmodels";
    private static $dbUsername = "root";
    private static $dbPassword = "";

    private static $dbConnection = null;

    /** DEFAULT DATA INSERTION (Delete in production mode)
     This method get's only called on database creation! */
    private function insertDefaultData($anonymousDbCon) {
        // Create default db
        $anonymousDbCon->exec("CREATE DATABASE IF NOT EXISTS ".DbConnection::$dbName."; USE ".DbConnection::$dbName.";");
        $anonymousDbCon->exec("CREATE TABLE IF NOT EXISTS User (
          usr_id VARCHAR(500) PRIMARY KEY, 
          usr_username VARCHAR(250) NOT NULL UNIQUE, 
          usr_hashedpassword VARCHAR(500) NOT NULL UNIQUE, 
          usr_salt VARCHAR(250) NOT NULL UNIQUE, 
          usr_email VARCHAR(250) NOT NULL UNIQUE
        );");

        $salt = User::createNewSalt();
        $clearPwd = "12345"; $email = "test@test.com"; $username = "test";
        (new User(User::createUniqueId($username,$clearPwd,$salt,$email),
            $username,User::hashPassword($clearPwd,$salt),$salt, $email))->dbReplace($anonymousDbCon);
    }


    //Do not use these methods if database does not exist
    public function exec($sql)
    {
        DbConnection::getDbConnection(true)->exec($sql);
    }

    public function query($sql)
    {
        return DbConnection::getDbConnection(true)->query($sql);
    }


    // #################################################################################
    public function __construct()
    {
        $this->getDbConnection(false); // by opening with false default data get's inserted
        $this->closeConnection();
    }

    //Private because only used in getDbConnection()
    private function establishConnection($doesDatabaseExist=false)
    {
        try {
            $conn = new PDO("mysql:host=" . DbConnection::$dbServername .
                (($doesDatabaseExist) ? ";dbname=" . DbConnection::$dbName : ""),
                DbConnection::$dbUsername, DbConnection::$dbPassword);

            // set error mode to exception so we can react to it with try catch
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            //connection successful

            //if db hasn't existed before, we will insert our default data
            if (!$doesDatabaseExist) {
                $this->insertDefaultData($conn);
            }

            return $conn;
        } catch (PDOException $e) {
            die("<p>Could not establish dbConnection: " . $e->getMessage() . "</p>");
        }
    }

    private static function closeConnection()
    {
        DbConnection::$dbConnection = null;
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
        if (DbConnection::$dbConnection == null) {
            DbConnection::$dbConnection = $this->establishConnection($doesDatabaseExist);
        }
        return DbConnection::$dbConnection;
    }

}