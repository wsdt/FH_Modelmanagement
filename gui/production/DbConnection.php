<?php


/** Used PDO instead of mysqli so it should be easier to transfer
 * this to other dbms. */
class DbConnection
{
    private static $dbServername = "localhost";
    private static $dbName = "fhKufsteinModels";
    private static $dbUsername = "root";
    private static $dbPassword = "";

    private static $dbConnection = null;

    public function exec($sql) {
        DbConnection::getDbConnection()->exec($sql);
    }
    public function query($sql) {
        //TODO: 
    }


    // #################################################################################
    //Private because only used in getDbConnection()
    private function establishConnection()
    {
        try {
            $conn = new PDO("mysql:host=" . DbConnection::$dbServername . ";dbname="
                . DbConnection::$dbName, DbConnection::$dbUsername, DbConnection::$dbPassword);

            // set error mode to exception so we can react to it with try catch
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            //connection successful
            return $conn;
        } catch (PDOException $e) {
            die("Could not establish dbConnection: " . $e->getMessage());
        }
    }

    private function closeConnection()
    {
        DbConnection::$dbConnection = null;
    }

    //Close dbConnection on object destroy
    function __destruct()
    {
        $this->closeConnection();
    }

    //GETTER/SETTER -------------------------
    public function getDbConnection()
    {
        if (DbConnection::$dbConnection == null) {
            DbConnection::$dbConnection = $this->establishConnection();
        }
        return DbConnection::$dbConnection;
    }

}