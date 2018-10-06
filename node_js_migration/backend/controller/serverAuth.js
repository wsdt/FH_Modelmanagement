const mod_user = require('../models/user');

//TODO: receive post requests and return json/response to auth.js in frontend





<?php
if (!session_id()) @ session_start(); //NO OUTPUT BEFORE

require_once "../mgr/_conf.php";
require_once "../mgr/_MGR_FACTORY.php";

//Load languagepack
$LANG_PACK = _MGR_FACTORY::getMgrLanguage()->getLanguageJson();

/** Receives post request from login form */
const TAG = "AuthenticationMiddleware: ";

require_once "../classes/User.php";

if (!empty($_POST)) { //only when logging in (so we can also use verifySession independently)
    $dbCon = _MGR_FACTORY::getMgrDb()->getDbConnection(true);
    if (!empty($_POST['userName']) && !empty($_POST['clearPassword'])) {
        if (empty($_POST['eMail'])) {
            $loginSuccessful = \classes\User::areUserCredentialsCorrect($dbCon, $_POST['userName'], $_POST['clearPassword']);
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
            $salt = \classes\User::createNewSalt();
            $response_json = (new \classes\User(\classes\User::createUniqueId($_POST['userName'],$_POST['clearPassword'],$salt,$_POST['eMail']),
                $_POST['userName'], \classes\User::hashPassword($_POST['clearPassword'],$salt), $salt, $_POST['eMail']))->dbInsert($dbCon);
            if($response_json["success"]) {
                http_response_code(200);
                echo '{"registrationSuccessful":true}';
            } else {
                //Registration failed
                header("HTTP/1.1 401 ".$response_json["msg"]);
                echo '{"loggedInTimestamp":"0"}';
            }
        }
    } else if (!empty($_POST['logout'])) {
        //No matter what is in logout just do it
        logout();
        http_response_code(200);
        echo '{"loggedInTimestamp":"0"}';
    } else if (!empty($_POST["eMail"])) {
        // lost password
        $newClearPwd = \classes\User::createNewSalt();

        $to = $_POST['eMail'];
        $subject = $LANG_PACK['pages']['login_php']['lostpwd_recovery']['subject'];
        $message = "<html>
            <head>".$LANG_PACK['pages']['login_php']['lostpwd_recovery']['head']."</head>
            <body>
            <h1>".$LANG_PACK['pages']['login_php']['lostpwd_recovery']['head']."</h1>
            <p>".$LANG_PACK['pages']['login_php']['lostpwd_recovery']['body_intro']."</p>
            <strong>".$newClearPwd."</strong>

            <p>".$LANG_PACK['pages']['login_php']['lostpwd_recovery']['body_conclusion']."</p>
            </body>
            </html>";
        $headers = "MIME-Version: 1.0\r\n".
        "Content-type:text/html;charset=UTF-8\r\n".
        "From: <pwdmgr@fh-kufstein.at>\r\n";

        $user = \classes\User::dbQueryWithEmail($dbCon,$_POST["eMail"]);
        if (!empty($user)) {
        # Send the mail
            if(!@mail($to, $subject, $message, $headers)) {
                // mail sending not successful
                header("HTTP/1.1 500 ".error_get_last()["message"]);
                echo '{"loggedInTimestamp":"0"}';
            } else {
                // Only change pwd when mail sending successful
                $user->setClearPassword($newClearPwd);
                $user->dbReplace($dbCon);
                http_response_code(200);
                echo '{"pwdRecoverySuccessful":true}';
            }
        } else {
            //Registration failed
            header("HTTP/1.1 401 ".$LANG_PACK['pages']['login_php']['lostpwd_recovery']['mail_notfound']);
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
    $isSessionInValid = (empty($_SESSION) || !isset($_SESSION['loggedInTimestamp']) || (time() - $_SESSION['loggedInTimestamp']) > \SESSION\SESSION_EXPIRATION) || !isset($_SESSION['userName']);

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
