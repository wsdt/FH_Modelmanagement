<?php
/** Receives post request from login form */
const TAG = "AuthenticationMiddleware: ";
const SESSION_EXPIRATION = 10000; //when should session expire (seconds)

require_once "../mgr/DbConnection.php";
require_once "../mgr/User.php";

if (!empty($_POST)) { //only when logging in (so we can also use verifySession independently)
    if (!empty($_POST['userName']) && !empty($_POST['clearPassword'])) {
        $dbCon = (new DbConnection())->getDbConnection(true);

        if (empty($_POST['eMail'])) {
            $loginSuccessful = User::areUserCredentialsCorrect($dbCon, $_POST['userName'], $_POST['clearPassword']);
            if ($loginSuccessful) {
                //Set session etc. and redirect
                if (!session_id()) @ session_start(); //NO OUTPUT BEFORE
                $_SESSION['loggedInTimestamp'] = time();
                $_SESSION['userName'] = htmlspecialchars(strtoupper($_POST['userName'])); //to prevent xss or similar
                //header("Location: ./modelupload.php");
                http_response_code(200);
                echo '{"loggedInTimestamp":"' . $_SESSION['loggedInTimestamp'] . '"}';
            } else {
                http_response_code(401);
                echo '{"loggedInTimestamp":"0"}';
            }
        } else {
            //Registration
            $salt = User::createNewSalt();
            if((new User(User::createUniqueId($_POST['userName'],$_POST['clearPassword'],$salt,$_POST['eMail']),
                $_POST['userName'], User::hashPassword($_POST['clearPassword'],$salt), $salt, $_POST['eMail']))->dbInsert($dbCon)) {
                http_response_code(200);
                echo '{"registrationSuccessful":true}';
            } else {
                //Registration failed
                http_response_code(401);
                echo '{"loggedInTimestamp":"0"}';
            }
        }
    } else if (!empty($_POST['logout'])) {
        //No matter what is in logout just do it
        logout();
        http_response_code(200);
        echo '{"loggedInTimestamp":"0"}';
    } else {
        http_response_code(400);
        echo '{"loggedInTimestamp":"0"}';
    }
}


function verifySession($toLoginPage)
{
    if (!session_id()) @ session_start(); //NO OUTPUT BEFORE
    $isSessionInValid = (empty($_SESSION) || !isset($_SESSION['loggedInTimestamp']) || (time() - $_SESSION['loggedInTimestamp']) > SESSION_EXPIRATION) || !isset($_SESSION['userName']);

    if ($isSessionInValid && $toLoginPage) {
        //currently is valid (add more validations)
        header("Location: ./login.php");
    } else if (!$isSessionInValid && !$toLoginPage) {
        header("Location: ./modelupload.php");
    } //else do nothing (session fully valid and no redirection wanted)
}

function logout() {
    if (!session_id()) @ session_start(); //NO OUTPUT BEFORE
    //Delete all session variables
    session_unset();
}
