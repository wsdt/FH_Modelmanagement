<?php

class User
{
    private $id;
    private $username;
    private $hashedPassword;
    private $salt;

    public function __construct($id, $username, $hashedPassword, $salt)
    {
        $this->setId($id);
        $this->setUsername($username);
        $this->setHashedPassword($hashedPassword);
        $this->setSalt($salt);
    }

    public static function hashPassword($clearPassword,$salt) {
        return crypt($clearPassword, $salt);
    }

    public function setClearPassword($clearPassword)
    {
        $this->setHashedPassword(self::hashPassword($clearPassword, $this->getSalt()));
    }

    private function isPasswordCorrect($clearPassword)
    {
        return hash_equals($this->getHashedPassword(), self::hashPassword($clearPassword,$this->getSalt()));
    }

    public static function areUserCredentialsCorrect($dbCon, $userName, $clearpassword) {
        $user = User::dbQueryWithUsername($dbCon, $userName);
        if (empty($user)) {
            return false;
        } else {
            return $user->isPasswordCorrect($clearpassword);
        }
    }

    //DB CRUD
    public function dbReplace($dbCon) {
        $dbCon->exec("REPLACE INTO User (usr_id, usr_username, usr_hashedpassword, usr_salt) VALUES (
            " . $this->getId() . ",
            '" . $this->getUsername() . "',
            '" . $this->getHashedPassword() . "',
            '" . $this->getSalt() . "'
        );");
    }

    public function dbInsert($dbCon)
    {
        $dbCon->exec("INSERT INTO User (usr_id,usr_username,usr_hashedpassword,usr_salt) VALUES (
            " . $this->getId() . ",
            '" . $this->getUsername() . "',
            '" . $this->getHashedPassword() . "',
            '" . $this->getSalt() . "'
        );");
    }

    public function dbUpdate($dbCon)
    {
        $dbCon->exec("UPDATE User SET 
            usr_id = " . $this->getId() . ",
            usr_username = '" . $this->getUsername() . "',
            usr_hashedpassword = '" . $this->getHashedPassword() . "',
            usr_salt = '" . $this->getSalt() . "' WHERE usr_id = " . $this->getId() . ";");
    }

    public function dbDelete($dbCon)
    {
        $dbCon->exec("DELETE FROM User WHERE usr_id = " . $this->getId() . ";");
    }

    public static function dbQuery($dbCon, $userId)
    {
        foreach ($dbCon->query("SELECT usr_id, usr_username, usr_hashedpassword, usr_salt FROM User WHERE usr_id=".$userId.";") as $row) {
            //return first (and should be only row/user which is returned from sql)
            return new User($row['usr_id'],$row['usr_username'],$row['usr_hashedpassword'],$row['usr_salt']);
        }
        echo "User::dbQuery: Could not fetch user with id: ".$userId;
        return null;
    }

    //possible, bc. username is unique in sql
    public static function dbQueryWithUsername($dbCon, $userName) {
        foreach ($dbCon->query("SELECT usr_id, usr_username, usr_hashedpassword, usr_salt FROM User WHERE usr_username='".$userName."';") as $row) {
            //return first (and should be only row/user which is returned from sql)
            return new User($row['usr_id'],$row['usr_username'],$row['usr_hashedpassword'],$row['usr_salt']);
        }
        echo "<p>User::dbQuery: Could not fetch user with name: ".$userName."</p>";
        return null;
    }


    //GETTER / SETTERS -------------------------------------
    public function setId($id)
    {
        $this->id = $id;
    }

    public function getId()
    {
        return $this->id;
    }

    public function setSalt($salt)
    {
        $this->salt = $salt;
    }

    public function getSalt()
    {
        return $this->salt;
    }

    public function setHashedPassword($hashedPassword)
    {
        $this->hashedPassword = $hashedPassword;
    }

    public function getHashedPassword()
    {
        return $this->hashedPassword;
    }

    public function getUsername()
    {
        return $this->username;
    }

    public function setUsername($username)
    {
        $this->username = $username;
    }
}