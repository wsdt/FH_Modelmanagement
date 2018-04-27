<?php
/**
 * Created by IntelliJ IDEA.
 * User: kevin
 * Date: 27.04.2018
 * Time: 19:07
 */

class User
{
    private $username;
    private $hashedPassword;
    private $salt;

    public function setClearPassword($clearPassword) {
        $this->setHashedPassword(openssl_digest($clearPassword.$this->getSalt(),"sha512"));
    }
    public function isPasswordCorrect($clearPassword) {
        //TODO:
        return true;
    }


    //GETTER / SETTERS -------------------------------------
    public function setSalt($salt) {
        $this->salt = $salt;
    }
    public function getSalt() {
        return $this->salt;
    }
    public function setHashedPassword($hashedPassword) {
        $this->hashedPassword = $hashedPassword;
    }
    public function getHashedPassword() {
        return $this->hashedPassword;
    }
    public function getUsername() {
        return $this->username;
    }
    public function setUsername($username) {
        $this->username = $username;
    }
}