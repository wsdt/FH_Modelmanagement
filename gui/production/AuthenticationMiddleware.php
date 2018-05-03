<?php
/** Receives post request from login form */
const TAG = "AuthenticationMiddleware: ";

require_once "./DbConnection.php";
require_once "./User.php";

if (!empty($_POST)) {
    if (!empty($_POST['userName']) && !empty($_POST['clearPassword'])) {
        $loginSuccessful = User::areUserCredentialsCorrect(DbConnection::getDbConnection(true),$_POST['userName'],$_POST['clearPassword']);
        if ($loginSuccessful) {
            //TODO: Set session etc. and redirect

        } else {
            echo TAG."Wrong credentials.";
        }
    } else {
        echo TAG."Wrong data supplied.";
    }
} else {
    echo TAG."No post request detected.";
}
