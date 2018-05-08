<?php
/** Receives post request from login form */
const TAG = "AuthenticationMiddleware: ";

require_once "./DbConnection.php";
require_once "./User.php";

if (!empty($_POST)) {
    verifyLoginRequest();
}


function verifyLoginRequest()
{
    if (!empty($_POST['userName']) && !empty($_POST['clearPassword'])) {
        $dbCon = (new DbConnection())->getDbConnection(true);

        $loginSuccessful = User::areUserCredentialsCorrect($dbCon, $_POST['userName'], $_POST['clearPassword']);
        if ($loginSuccessful) {
            //TODO: Set session etc. and redirect
            if (!session_id()) @ session_start(); //NO OUTPUT BEFORE
            $_SESSION['loggedInTimestamp'] = time();
            header("Location: ./modelupload.php");
        } else {
            echo TAG . "Wrong credentials.";
        }
    } else {
        echo TAG . "Wrong data supplied.";
    }
}


function isSessionValid()
{
    if (!session_id()) @ session_start(); //NO OUTPUT BEFORE
    if (!empty($_SESSION) && isset($_SESSION['loggedInTimestamp'])) {
        //currently is valid (add more validations)
        return true;
    }
    return false;
}
