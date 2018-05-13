<?php
/** Receives post request from login form */
const TAG = "AuthenticationMiddleware: ";

require_once "./DbConnection.php";
require_once "./User.php";

//Accept requests
verifyLoginRequest(file_get_contents("php://input"));


function verifyLoginRequest($receivedContent)
{
    //Transform to associative array
    $receivedContent = json_decode($receivedContent, true);

    if (!empty($receivedContent) && !empty($receivedContent['userName']) && !empty($receivedContent['clearPassword'])) {
        $dbCon = (new DbConnection())->getDbConnection(true);

        $loginSuccessful = User::areUserCredentialsCorrect($dbCon, $receivedContent['userName'], $receivedContent['clearPassword']);
        if ($loginSuccessful) {
            //Set session etc. and redirect
            if (!session_id()) @ session_start(); //NO OUTPUT BEFORE
            $_SESSION['loggedInTimestamp'] = time();
            //header("Location: ./modelupload.php");
            http_response_code(200);
        } else {
            http_response_code(401);
        }
    } else {
        http_response_code(400);
    }
}


function verifySession()
{
    if (!session_id()) @ session_start(); //NO OUTPUT BEFORE
    if (!empty($_SESSION) && isset($_SESSION['loggedInTimestamp'])) {
        //currently is valid (add more validations)
        header("Location: ../login.html");
    }
}
