/** Contains login and registration procedures */

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
    headers.append('Accept','application/json, application/xml, text/plain, text/html, *.*');
    headers.append('Content-Type','application/x-www-form-urlencoded; charset=utf-8');

    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('logout','START_LOGOUT');

    fetch("../middlewares/AuthenticationMiddleware.php",
        {
            credentials: 'include',
            method: "post",
            headers: headers,
            body: urlSearchParams
        })
        .then(handleErrors)
        .then((resp) => resp.json())
        .then(function(res) {
            console.log('Submitted logout request.');
            window.location.href = "./login.php"; //redirect to login page
        })
        .catch(function(error) {
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
    let headers = new Headers();
    headers.append('Accept','application/json, application/xml, text/plain, text/html, *.*');
    headers.append('Content-Type','application/x-www-form-urlencoded; charset=utf-8');

    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('userName',valUsername);
    urlSearchParams.append('clearPassword',valClearPwd);


    fetch("../middlewares/AuthenticationMiddleware.php",
        {
            credentials: 'include',
            method: "post",
            headers: headers,
            body: urlSearchParams
        })
        .then(handleErrors)
        .then((resp) => resp.json())
        .then(function(res) {
            console.log('Submitted userCredentialsJson.');
            window.location.href = "./modelupload.php"; //redirect to modelupload page
        })
        .catch(function(error) {
            console.log(error);
            new PNotify({
                title: 'Unauthorized',
                text: 'Username or password is wrong ('+error+').',
                type: 'error',
                styling: 'bootstrap3'
            });

        });
}

function register(valUsername, valEmail, valClearPwd) {
    let headers = new Headers();
    headers.append('Accept','application/json, application/xml, text/plain, text/html, *.*');
    headers.append('Content-Type','application/x-www-form-urlencoded; charset=utf-8');

    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('userName',valUsername);
    urlSearchParams.append('eMail',valEmail);
    urlSearchParams.append('clearPassword',valClearPwd);


    fetch("../middlewares/AuthenticationMiddleware.php",
        {
            credentials: 'include',
            method: "post",
            headers: headers,
            body: urlSearchParams
        })
        .then(handleErrors)
        .then((resp) => resp.json())
        .then(function(res) {
            console.log('Submitted RegisterJson.');
            new PNotify({
                title: 'Registration successfully',
                text: 'The user "'+valUsername.value+'" has been registered successfully.',
                type: 'success',
                styling: 'bootstrap3'
            });
            // do not, user has to register: window.location.href = "./modelupload.php"; //redirect to modelupload page
        })
        .catch(function(error) {
            new PNotify({
                title: 'Registration failed',
                text: 'Unfortunately, we couldn\'t register your new account. ('+error+')',
                type: 'error',
                styling: 'bootstrap3'
            });
        });
}

// Assumes that email is unique (see user.php)
function lostpassword(emailVal) {
    let headers = new Headers();
    headers.append('Accept','application/json, application/xml, text/plain, text/html, *.*');
    headers.append('Content-Type','application/x-www-form-urlencoded; charset=utf-8');

    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('eMail',emailVal);

    fetch("../middlewares/AuthenticationMiddleware.php",
        {
            credentials: 'include',
            method: "post",
            headers: headers,
            body: urlSearchParams
        })
        .then(handleErrors)
        .then((resp) => resp.json())
        .then(function(res) {
            console.log('Submitted lostPwdJson.');
            new PNotify({
                title: 'Password sent',
                text: 'We have sent you a new password to your email -> '+elemEmail.value,
                type: 'success',
                styling: 'bootstrap3'
            });
            // do not, user has to register: window.location.href = "./modelupload.php"; //redirect to modelupload page
        })
        .catch(function(error) {
            new PNotify({
                title: 'Password recovery failed',
                text: 'Unfortunately, we couldn\'t send you a new password. ('+error+')',
                type: 'error',
                styling: 'bootstrap3'
            });
        });
}
