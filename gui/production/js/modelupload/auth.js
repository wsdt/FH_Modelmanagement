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
function login(elemUsername, elemClearPwd) {
    let headers = new Headers();
    headers.append('Accept','application/json, application/xml, text/plain, text/html, *.*');
    headers.append('Content-Type','application/x-www-form-urlencoded; charset=utf-8');

    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('userName',elemUsername);
    urlSearchParams.append('clearPassword',elemClearPwd);


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

function register(elemUsername, elemEmail, elemClearPwd) {
    let headers = new Headers();
    headers.append('Accept','application/json, application/xml, text/plain, text/html, *.*');
    headers.append('Content-Type','application/x-www-form-urlencoded; charset=utf-8');

    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('userName',elemUsername);
    urlSearchParams.append('eMail',elemEmail);
    urlSearchParams.append('clearPassword',elemClearPwd);


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
            window.location.href = "./modelupload.php"; //redirect to modelupload page
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