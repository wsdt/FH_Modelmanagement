<?php
/**
 * Created by IntelliJ IDEA.
 * User: kevin
 * Date: 27.04.2018
 * Time: 19:07
 */

class User
{
    private $id;
    private $username;
    private $hashedPassword;
    private $salt;

    public function setClearPassword($clearPassword) {
        $this->setHashedPassword(crypt($clearPassword,$this->getSalt()));
    }
    public function isPasswordCorrect($clearPassword) {
        return hash_equals($this->getHashedPassword(),crypt($clearPassword,$this->getSalt()));
    }


    //GETTER / SETTERS -------------------------------------
    public function setId($id) {
        $this->id = $id;
    }
    public function getId() {
        return $this->id;
    }
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