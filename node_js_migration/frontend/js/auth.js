/** Throws an generic error so we know that authentication has failed.*/
function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

/** Logs current user out.*/
function logout() {
    let headers = new Headers();
    headers.append('Accept', 'application/json, application/xml, text/plain, text/html, *.*');
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');

    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('logout', 'START_LOGOUT');

    fetch("../middlewares/AuthenticationMiddleware.php",
        {
            credentials: 'include',
            method: "post",
            headers: headers,
            body: urlSearchParams
        })
        .then(handleErrors)
        .then((resp) => resp.json())
        .then(function (res) {
            console.log('Submitted logout request.');
            window.location.href = "./login.php"; //redirect to login page
        })
        .catch(function (error) {
            new PNotify({
                title: 'Log-Out failed',
                text: 'Could not log you out. Please contact administrator.',
                type: 'error',
                styling: 'bootstrap3'
            });
        });
}

/** Sends fetch request to login user (better usability) */
function login(valUsername, valClearPwd) {
    fetch('/v1/login', {
        method: 'post',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({usr_name: valUsername, usr_clearPwd: valClearPwd})
    }).then((res) => res.json())
        .then(res => {
            if (res !== undefined && res !== null && res !== "") {
                if (res.user_authenticated) {
                    window.location = "/v1/upload";
                }
                new PNotify({
                    title: res.res_title,
                    text: res.res_text,
                    type: res.notification_type,
                    styling: 'bootstrap3'
                });
            }
        })
        .catch(error => {
            console.error("auth:login: Could not login -> "+JSON.stringify(error));
            new PNotify({
                title: 'Server Error',
                text: 'An error occurred. Please try it again.',
                type: 'error',
                styling: 'bootstrap3'
            });
        });
}

function register(valUsername, valEmail, valClearPwd) {
    fetch('/v1/register', {
        method: 'post',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({usr_name: valUsername, usr_clearPwd: valClearPwd, usr_mail:valEmail})
    }).then((res) => res.json())
        .then(res => {
            if (res !== undefined && res !== null && res !== "") {
                if (res.user_registered) {
                    window.location = "/#signin";
                }
                new PNotify({
                    title: res.res_title,
                    text: res.res_text,
                    type: res.notification_type,
                    styling: 'bootstrap3'
                });
            }
        })
        .catch(error => {
            console.error("auth:register: Could not register user -> "+JSON.stringify(error));
            new PNotify({
                title: 'Server Error',
                text: 'An error occurred. Please try it again.',
                type: 'error',
                styling: 'bootstrap3'
            });
        });
}

// Assumes that email is unique (see user.php)
function lostpassword(emailVal) {
    let headers = new Headers();
    headers.append('Accept', 'application/json, application/xml, text/plain, text/html, *.*');
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');

    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('eMail', emailVal);

    fetch("../middlewares/AuthenticationMiddleware.php",
        {
            credentials: 'include',
            method: "post",
            headers: headers,
            body: urlSearchParams
        })
        .then(handleErrors)
        .then((resp) => resp.json())
        .then(function (res) {
            console.log('Submitted lostPwdJson.');
            new PNotify({
                title: 'Password sent',
                text: 'We have sent you a new password to your email -> ' + elemEmail.value,
                type: 'success',
                styling: 'bootstrap3'
            });
            // do not, user has to register: window.location.href = "./modelupload.php"; //redirect to modelupload page
        })
        .catch(function (error) {
            new PNotify({
                title: 'Password recovery failed',
                text: 'Unfortunately, we couldn\'t send you a new password. (' + error + ')',
                type: 'error',
                styling: 'bootstrap3'
            });
        });
}
