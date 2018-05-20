<?php
/** Receives post request from login form */
const TAG = "AuthenticationMiddleware: ";
const SESSION_EXPIRATION = 10000; //when should session expire (seconds)

require_once "./DbConnection.php";
require_once "./User.php";


if (!empty($_POST)) { //only when logging in (so we can also use verifySession independently)
    verifyLoginRequest();
}


function verifyLoginRequest()
{
    if (!empty($_POST['userName']) && !empty($_POST['clearPassword'])) {
        $dbCon = (new DbConnection())->getDbConnection(true);
        $loginSuccessful = User::areUserCredentialsCorrect($dbCon, $_POST['userName'], $_POST['clearPassword']);
        if ($loginSuccessful) {
            //Set session etc. and redirect
            if (!session_id()) @ session_start(); //NO OUTPUT BEFORE
            $_SESSION['loggedInTimestamp'] = time();
            //header("Location: ./modelupload.php");
            http_response_code(200);
            echo '{"loggedInTimestamp":"'.$_SESSION['loggedInTimestamp'].'"}';
        } else {
            http_response_code(401);
            echo '{"loggedInTimestamp":"0"}';
        }
    } else {
        http_response_code(400);
        echo '{"loggedInTimestamp":"0"}';
    }
}


function verifySession($toLoginPage)
{
    if (!session_id()) @ session_start(); //NO OUTPUT BEFORE
    $isSessionInValid = (empty($_SESSION) || !isset($_SESSION['loggedInTimestamp']) || (time() - $_SESSION['loggedInTimestamp']) > SESSION_EXPIRATION);

    if ($isSessionInValid && $toLoginPage) {
        //currently is valid (add more validations)
        header("Location: ./login.php");
    } else if (!$isSessionInValid && !$toLoginPage) {
        header("Location: ./modelupload.php");
    } //else do nothing (session fully valid and no redirection wanted)
}
