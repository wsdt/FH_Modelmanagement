<?php

class User
{
    /** User Id which identifies the user accross languages etc. (cleaner) */
    private $id;
    /** Username has an unique constraint (in db), so we can also query
     * users by their nickname (non-case-sensitive).
     * Username is also used to determine userAvatar (in images/users/x.jpg) */
    private $username;
    private $email;
    /** As usual, we only save hashed pwds. We are using the crypt() method
     to hash passwords. */
    private $hashedPassword;
    /** Also as usual we use salts to prevent rainbow table attacks etc. */
    private $salt;

    # Used to display db errors
    public static $response_json = '{"success":true,"msg":"No information available."}';

    public function __construct($id, $username, $hashedPassword, $salt, $email)
    {
        $this->setId($id);
        $this->setUsername($username);
        $this->setHashedPassword($hashedPassword);
        $this->setSalt($salt);
        $this->setEmail($email);
    }

    public static function createUniqueId($userName, $clearPassword, $salt, $email) {
        return crypt($userName.$clearPassword.$salt.$email,self::createNewSalt());
    }

    public static function createNewSalt() {
        return uniqid(mt_rand(), true);
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
        $affectedRowCount = $dbCon->exec("REPLACE INTO User (usr_id, usr_username, usr_hashedpassword, usr_salt, usr_email) VALUES (
            '" . $this->getId() . "',
            '" . $this->getUsername() . "',
            '" . $this->getHashedPassword() . "',
            '" . $this->getSalt() . "',
            '".$this->getEmail()."'
        );");

        return ($affectedRowCount <= 0) ? false : true;
    }

    /** E.g. for registration to provoke exception when user exists already. */
    public function dbInsert($dbCon)
    {
        $response_json = json_decode(User::$response_json, true);
        try {
            $affectedRowCount = $dbCon->exec("INSERT INTO User (usr_id,usr_username,usr_hashedpassword,usr_salt,usr_email) VALUES (
            '" . $this->getId() . "',
            '" . $this->getUsername() . "',
            '" . $this->getHashedPassword() . "',
            '" . $this->getSalt() . "',
            '" . $this->getEmail() . "'
        );");
        } catch (PDOException $e) {
            $response_json["msg"] = $e->getMessage();
            $response_json["success"] = false;
            return $response_json;
        }

        if ($affectedRowCount <= 0) {
            $response_json["success"] = false;
        }
        return $response_json;
    }

    public function dbUpdate($dbCon)
    {
        $affectedRowCount = $dbCon->exec("UPDATE User SET 
            usr_id = '" . $this->getId() . "',
            usr_username = '" . $this->getUsername() . "',
            usr_hashedpassword = '" . $this->getHashedPassword() . "',
            usr_salt = '" . $this->getSalt() . "',
            usr_email = '".$this->getEmail()."' WHERE usr_id = " . $this->getId() . ";");

        return ($affectedRowCount <= 0) ? false : true;
    }

    public function dbDelete($dbCon)
    {
        $affectedRowCount = $dbCon->exec("DELETE FROM User WHERE usr_id = '" . $this->getId() . "';");

        return ($affectedRowCount <= 0) ? false : true;
    }

    public static function dbQuery($dbCon, $userId)
    {
        foreach ($dbCon->query("SELECT usr_id, usr_username, usr_hashedpassword, usr_salt, usr_email FROM User WHERE usr_id='".$userId."';") as $row) {
            //return first (and should be only row/user which is returned from sql)
            return new User($row['usr_id'],$row['usr_username'],$row['usr_hashedpassword'],$row['usr_salt'], $row['usr_email']);
        }
        echo "User::dbQuery: Could not fetch user with id: ".$userId;
        return null;
    }

    //possible, bc. username is unique in sql
    public static function dbQueryWithUsername($dbCon, $userName) {
        foreach ($dbCon->query("SELECT usr_id, usr_username, usr_hashedpassword, usr_salt, usr_email FROM User WHERE usr_username='".$userName."';") as $row) {
            //return firdst (and should be only row/user which is returned from sql)
            return new User($row['usr_id'],$row['usr_username'],$row['usr_hashedpassword'],$row['usr_salt'], $row['usr_email']);
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

    public function setEmail($email) {
        $this->email = $email;
    }

    public function getEmail() {
        return $this->email;
    }
}